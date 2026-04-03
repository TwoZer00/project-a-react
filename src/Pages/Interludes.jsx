import { Mic } from '@mui/icons-material';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material';
import { collection, deleteDoc, doc, getFirestore, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { deleteObject, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { MuiFileInput } from 'mui-file-input';
import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { getInterludes, getLoggedUserRef } from '../firebase/utills';
import { InputField } from './Login';
import { INTERLUDE_TYPES, InterludeCard } from './Dashboard/Interludes/DashboardInterludes';

export default function Interludes() {
    const [initData, setInitData] = useOutletContext();
    const [interludes, setInterludes] = useState([]);
    const [file, setFile] = useState(null);
    const [type, setType] = useState('between');
    const [title, setTitle] = useState('');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        setInitData(val => ({ ...val, main: { ...val?.main, title: 'Station interludes' } }));
        loadInterludes();
    }, []);

    const loadInterludes = async () => {
        const userId = getLoggedUserRef().id;
        const data = await getInterludes(userId);
        setInterludes(data);
    };

    const handleUpload = async () => {
        if (!file || !title.trim()) return;
        setUploading(true);
        const userId = getLoggedUserRef().id;
        const db = getFirestore();
        const interludeRef = doc(collection(db, "user", userId, "interludes"));
        const storageRef = ref(getStorage(), `interludes/${userId}/${interludeRef.id}/${file.name}`);
        const task = uploadBytesResumable(storageRef, file);

        task.on('state_changed',
            (snap) => {
                setInitData(val => ({ ...val, loading: { state: 'loading', progress: (snap.bytesTransferred / snap.totalBytes) * 100 } }));
            },
            null,
            async () => {
                await setDoc(interludeRef, {
                    title: title.trim(),
                    type,
                    filePath: task.snapshot.ref.toString(),
                    creationTime: serverTimestamp()
                });
                setFile(null);
                setTitle('');
                setInitData(val => {
                    const temp = { ...val };
                    delete temp.loading;
                    temp.notification = { type: 'success', msg: 'Interlude uploaded!' };
                    return temp;
                });
                setUploading(false);
                loadInterludes();
            }
        );
    };

    const handleDelete = async (interlude) => {
        const userId = getLoggedUserRef().id;
        await deleteDoc(doc(getFirestore(), "user", userId, "interludes", interlude.id));
        try { await deleteObject(ref(getStorage(), interlude.filePath)); } catch (e) { /* ignore */ }
        setInterludes(prev => prev.filter(i => i.id !== interlude.id));
    };

    const handleUpdate = async (id, updates) => {
        const userId = getLoggedUserRef().id;
        await updateDoc(doc(getFirestore(), "user", userId, "interludes", id), updates);
        setInterludes(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
    };

    return (
        <Stack gap={3}>
            <Typography variant="h6">🎙️ Station Interludes</Typography>
            <Typography variant="body2" color="text.secondary">
                Record short clips that play between your tracks, as intros, outros, or credits. Make your station feel like real radio.
            </Typography>

            <Stack gap={2} direction={{ xs: 'column', sm: 'row' }} alignItems="flex-start">
                <InputField label="Title" type="text" name="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
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
                disabled={uploading || !file || !title.trim()}
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
