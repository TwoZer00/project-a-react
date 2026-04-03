import { Search } from '@mui/icons-material';
import { Box, InputAdornment, Link, List, ListItem, ListItemButton, Paper, Stack, TextField, Typography } from '@mui/material';
import { collection, getDocs, getFirestore, limit, orderBy, query, where } from 'firebase/firestore';
import React, { useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import UserAvatar from './UserAvatar';
import { labels, windowLang } from '../utils';

export default function SearchUsers() {
    const [results, setResults] = useState([]);
    const [searchVal, setSearchVal] = useState('');
    const [open, setOpen] = useState(false);
    const debounce = useRef(null);

    const handleSearch = (val) => {
        setSearchVal(val);
        clearTimeout(debounce.current);
        if (val.trim().length < 2) { setResults([]); setOpen(false); return; }
        debounce.current = setTimeout(async () => {
            const db = getFirestore();
            const q = query(
                collection(db, 'user'),
                where('username', '>=', val.trim()),
                where('username', '<=', val.trim() + '\uf8ff'),
                orderBy('username'),
                limit(6)
            );
            const snap = await getDocs(q);
            setResults(snap.docs.map(d => ({ ...d.data(), id: d.id })));
            setOpen(true);
        }, 300);
    };

    return (
        <Box sx={{ position: 'relative', width: '100%', maxWidth: 300 }}>
            <TextField
                size="small"
                placeholder={labels[windowLang]['search-users']}
                value={searchVal}
                onChange={(e) => handleSearch(e.target.value)}
                onBlur={() => setTimeout(() => setOpen(false), 200)}
                onFocus={() => { if (results.length > 0) setOpen(true); }}
                fullWidth
                InputProps={{
                    startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment>
                }}
            />
            {open && results.length > 0 && (
                <Paper elevation={4} sx={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10, mt: 0.5 }}>
                    <List dense disablePadding>
                        {results.map(user => (
                            <ListItem key={user.id} disablePadding>
                                <ListItemButton component={RouterLink} to={`/user/${user.id}`}>
                                    <Stack direction="row" gap={1} alignItems="center">
                                        <UserAvatar url={user.avatarURL} username={user.username} width={28} height={28} />
                                        <Typography variant="body2">{user.username}</Typography>
                                    </Stack>
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            )}
            {open && results.length === 0 && searchVal.trim().length >= 2 && (
                <Paper elevation={4} sx={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10, mt: 0.5, p: 1.5 }}>
                    <Typography variant="caption" color="text.secondary">{labels[windowLang]['no-users-found']}</Typography>
                </Paper>
            )}
        </Box>
    );
}
