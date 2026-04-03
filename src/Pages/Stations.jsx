import { Add, Delete, Edit, Radio, Shuffle } from '@mui/icons-material';
import { Box, Button, Card, CardContent, Checkbox, Chip, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, Switch, TextField, Typography } from '@mui/material';
import { collection, deleteDoc, doc, getFirestore, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import { getLoggedUserRef, getPostsUser, getUserStations } from '../firebase/utills';

export default function Stations() {
    const [initData, setInitData] = useOutletContext();
    const [stations, setStations] = useState([]);
    const [posts, setPosts] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState(null);

    useEffect(() => {
        setInitData(val => ({ ...val, main: { ...val?.main, title: 'My Stations' } }));
        load();
    }, []);

    const load = async () => {
        const userId = getLoggedUserRef().id;
        const [stationData, postData] = await Promise.all([
            getUserStations(userId),
            getPostsUser(userId)
        ]);
        setStations(stationData);
        setPosts(postData.filter(p => p.indexed));
    };

    const handleDelete = async (id) => {
        const userId = getLoggedUserRef().id;
        await deleteDoc(doc(getFirestore(), "user", userId, "stations", id));
        setStations(prev => prev.filter(s => s.id !== id));
    };

    const handleSave = async (data) => {
        const userId = getLoggedUserRef().id;
        const db = getFirestore();
        if (data.id) {
            const { id, ...rest } = data;
            await updateDoc(doc(db, "user", userId, "stations", id), rest);
            setStations(prev => prev.map(s => s.id === id ? { ...s, ...rest } : s));
        } else {
            const ref = doc(collection(db, "user", userId, "stations"));
            const station = { ...data, creationTime: serverTimestamp() };
            await setDoc(ref, station);
            setStations(prev => [...prev, { ...station, id: ref.id }]);
        }
        setDialogOpen(false);
        setEditing(null);
    };

    return (
        <Stack gap={2}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">📻 My Stations</Typography>
                <Button
                    variant="contained"
                    size="small"
                    startIcon={<Add />}
                    onClick={() => { setEditing(null); setDialogOpen(true); }}
                >
                    New station
                </Button>
            </Stack>
            <Typography variant="body2" color="text.secondary">
                Create themed stations from your posts. Visitors can tune in from your profile.
            </Typography>

            {stations.length > 0 ? (
                <Stack gap={1}>
                    {stations.map(s => (
                        <Card key={s.id} variant="outlined">
                            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.5, '&:last-child': { pb: 1.5 } }}>
                                <Radio color="primary" />
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body1" fontWeight={500}>{s.name}</Typography>
                                    {s.description && <Typography variant="caption" color="text.secondary">{s.description}</Typography>}
                                    <Stack direction="row" gap={1} mt={0.5}>
                                        <Chip label={`${s.postIds?.length || 0} tracks`} size="small" />
                                        {s.shuffle && <Chip icon={<Shuffle />} label="Shuffle" size="small" variant="outlined" />}
                                    </Stack>
                                </Box>
                                <IconButton size="small" onClick={() => { setEditing(s); setDialogOpen(true); }}>
                                    <Edit fontSize="small" />
                                </IconButton>
                                <IconButton size="small" color="error" onClick={() => handleDelete(s.id)}>
                                    <Delete fontSize="small" />
                                </IconButton>
                            </CardContent>
                        </Card>
                    ))}
                </Stack>
            ) : (
                <EmptyState icon="📻" message="No stations yet" />
            )}

            <StationDialog
                open={dialogOpen}
                onClose={() => { setDialogOpen(false); setEditing(null); }}
                onSave={handleSave}
                posts={posts}
                initial={editing}
            />
        </Stack>
    );
}

function StationDialog({ open, onClose, onSave, posts, initial }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedPosts, setSelectedPosts] = useState([]);
    const [shuffle, setShuffle] = useState(true);

    useEffect(() => {
        if (initial) {
            setName(initial.name || '');
            setDescription(initial.description || '');
            setSelectedPosts(initial.postIds || []);
            setShuffle(initial.shuffle ?? true);
        } else {
            setName('');
            setDescription('');
            setSelectedPosts([]);
            setShuffle(true);
        }
    }, [initial, open]);

    const togglePost = (postId) => {
        setSelectedPosts(prev =>
            prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]
        );
    };

    const handleSave = () => {
        if (!name.trim() || selectedPosts.length === 0) return;
        onSave({
            ...(initial?.id ? { id: initial.id } : {}),
            name: name.trim(),
            description: description.trim(),
            postIds: selectedPosts,
            shuffle
        });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{initial ? 'Edit station' : 'New station'}</DialogTitle>
            <DialogContent>
                <Stack gap={2} mt={1}>
                    <TextField
                        label="Station name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        fullWidth
                        size="small"
                    />
                    <TextField
                        label="Description (optional)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        fullWidth
                        size="small"
                        multiline
                        rows={2}
                    />
                    <FormControlLabel
                        control={<Switch checked={shuffle} onChange={(e) => setShuffle(e.target.checked)} />}
                        label="Shuffle tracks"
                    />
                    <Typography variant="subtitle2">
                        Select tracks ({selectedPosts.length} selected)
                    </Typography>
                    <List sx={{ maxHeight: 300, overflow: 'auto', border: 1, borderColor: 'divider', borderRadius: 1 }}>
                        {posts.map(post => (
                            <ListItem key={post.id} disablePadding>
                                <ListItemButton dense onClick={() => togglePost(post.id)}>
                                    <ListItemIcon sx={{ minWidth: 36 }}>
                                        <Checkbox
                                            edge="start"
                                            checked={selectedPosts.includes(post.id)}
                                            size="small"
                                        />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={post.title}
                                        secondary={post.category?.id}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" onClick={handleSave} disabled={!name.trim() || selectedPosts.length === 0}>
                    {initial ? 'Save' : 'Create'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
