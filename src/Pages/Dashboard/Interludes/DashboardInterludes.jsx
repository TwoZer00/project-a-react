import { Close, Delete, Edit, Mic, Save } from '@mui/icons-material';
import { Box, Button, Card, CardContent, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, IconButton, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import { collection, deleteDoc, doc, getFirestore, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { deleteObject, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { MuiFileInput } from 'mui-file-input';
import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { InputField } from '../../Login';
import { getAudioUrl, getInterludes } from '../../../firebase/utills';

export const INTERLUDE_TYPES = [
    { value: 'intro', label: '🎙️ Intro', desc: 'Plays when station starts' },
    { value: 'between', label: '🔄 Between tracks', desc: 'Plays between songs' },
    { value: 'outro', label: '👋 Outro', desc: 'Plays when station or single track ends' },
    { value: 'credit', label: '📝 Credit', desc: 'Short sign-off after your content' },
];

export default function DashboardInterludes() {
    const [[user], , setTitle] = useOutletContext();
    const [interludes, setInterludes] = useState([]);
    const [file, setFile] = useState(null);
    const [type, setType] = useState('between');
    const [title2, setTitle2] = useState('');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        setTitle('Interludes');
        if (user?.id) loadInterludes();
    }, [user]);

    const loadInterludes = async () => {
        const data = await getInterludes(user.id);
        setInterludes(data);
    };

    const handleUpload = async () => {
        if (!file || !title2.trim() || !user?.id) return;
        setUploading(true);
        const db = getFirestore();
        const interludeRef = doc(collection(db, "user", user.id, "interludes"));
        const storageRef = ref(getStorage(), `interludes/${user.id}/${interludeRef.id}/${file.name}`);
        const task = uploadBytesResumable(storageRef, file);
        task.on('state_changed', null, null, async () => {
            await setDoc(interludeRef, {
                title: title2.trim(),
                type,
                filePath: task.snapshot.ref.toString(),
                creationTime: serverTimestamp()
            });
            setFile(null);
            setTitle2('');
            setUploading(false);
            loadInterludes();
        });
    };

    const handleDelete = async (interlude) => {
        const db = getFirestore();
        await deleteDoc(doc(db, "user", user.id, "interludes", interlude.id));
        try { await deleteObject(ref(getStorage(), interlude.filePath)); } catch (e) { /* file may not exist */ }
        setInterludes(prev => prev.filter(i => i.id !== interlude.id));
    };

    const handleUpdate = async (id, updates) => {
        const db = getFirestore();
        await updateDoc(doc(db, "user", user.id, "interludes", id), updates);
        setInterludes(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
    };

    return (
        <Stack gap={3} p={2}>
            <Typography variant="h6">🎙️ Station Interludes</Typography>
            <Typography variant="body2" color="text.secondary">
                Record short clips that play between your tracks, as intros, outros, or credits.
            </Typography>

            <Stack gap={2} direction={{ xs: 'column', sm: 'row' }} alignItems="flex-start">
                <InputField label="Title" type="text" name="title" value={title2} onChange={(e) => setTitle2(e.target.value)} required />
                <FormControl sx={{ minWidth: 160 }}>
                    <InputLabel>Type</InputLabel>
                    <Select value={type} label="Type" onChange={(e) => setType(e.target.value)}>
                        {INTERLUDE_TYPES.map(t => <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>)}
                    </Select>
                </FormControl>
            </Stack>
            <MuiFileInput
                value={file}
                onChange={setFile}
                inputProps={{ accept: 'audio/*' }}
                getSizeText={(v) => `${(v?.size / Math.pow(1024, 2)).toFixed(2)} MB`}
            />
            <Button
                variant="contained"
                startIcon={<Mic />}
                onClick={handleUpload}
                disabled={uploading || !file || !title2.trim()}
                sx={{ alignSelf: 'flex-start' }}
            >
                {uploading ? 'Uploading...' : 'Upload interlude'}
            </Button>

            {interludes.length > 0 && (
                <Stack gap={1}>
                    <Typography variant="subtitle2">Your interludes ({interludes.length})</Typography>
                    {INTERLUDE_TYPES.map(typeInfo => {
                        const items = interludes.filter(i => i.type === typeInfo.value);
                        if (items.length === 0) return null;
                        return (
                            <Box key={typeInfo.value}>
                                <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                                    {typeInfo.label} — {typeInfo.desc}
                                </Typography>
                                {items.map(i => (
                                    <InterludeCard key={i.id} interlude={i} onDelete={handleDelete} onUpdate={handleUpdate} />
                                ))}
                            </Box>
                        );
                    })}
                </Stack>
            )}
        </Stack>
    );
}

export function InterludeCard({ interlude, onDelete, onUpdate }) {
    const [audioUrl, setAudioUrl] = useState(null);
    const [editing, setEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(interlude.title);
    const [editType, setEditType] = useState(interlude.type);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const typeInfo = INTERLUDE_TYPES.find(t => t.value === interlude.type);

    useEffect(() => {
        if (interlude.filePath) getAudioUrl(interlude.filePath).then(setAudioUrl);
    }, [interlude.filePath]);

    const handleSave = () => {
        if (!editTitle.trim()) return;
        onUpdate(interlude.id, { title: editTitle.trim(), type: editType });
        setEditing(false);
    };

    const handleCancel = () => {
        setEditTitle(interlude.title);
        setEditType(interlude.type);
        setEditing(false);
    };

    if (editing) {
        return (
            <Card variant="outlined" sx={{ mb: 1 }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1, '&:last-child': { pb: 1 } }}>
                    <TextField
                        size="small"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        sx={{ flex: 1 }}
                    />
                    <FormControl size="small" sx={{ minWidth: 130 }}>
                        <Select value={editType} onChange={(e) => setEditType(e.target.value)}>
                            {INTERLUDE_TYPES.map(t => <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <IconButton size="small" color="primary" onClick={handleSave}><Save fontSize="small" /></IconButton>
                    <IconButton size="small" onClick={handleCancel}><Close fontSize="small" /></IconButton>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <Card variant="outlined" sx={{ mb: 1 }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1, '&:last-child': { pb: 1 } }}>
                    <Box sx={{ flex: 1 }}>
                        <Stack direction="row" gap={1} alignItems="center">
                            <Typography variant="body2" fontWeight={500}>{interlude.title}</Typography>
                            <Chip label={typeInfo?.label || interlude.type} size="small" variant="outlined" />
                        </Stack>
                    </Box>
                    {audioUrl && <audio src={audioUrl} controls style={{ height: 32, maxWidth: 200 }} />}
                    <IconButton size="small" onClick={() => setEditing(true)}><Edit fontSize="small" /></IconButton>
                    <IconButton size="small" color="error" onClick={() => setDeleteOpen(true)}><Delete fontSize="small" /></IconButton>
                </CardContent>
            </Card>
            <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
                <DialogTitle>Delete interlude?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        "{interlude.title}" will be permanently deleted. This cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
                    <Button color="error" onClick={() => { onDelete(interlude); setDeleteOpen(false); }}>Delete</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
