import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { IconButton, Stack, Typography } from '@mui/material';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, getFirestore, increment, updateDoc, setDoc, deleteDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';

export default function LikeButton({ postId, initialCount }) {
    const [liked, setLiked] = useState(false);
    const [count, setCount] = useState(initialCount || 0);
    const userId = getAuth().currentUser?.uid;

    useEffect(() => {
        if (!userId || !postId) return;
        const check = async () => {
            const ref = doc(getFirestore(), "like", userId, "posts", postId);
            const snap = await getDoc(ref);
            setLiked(snap.exists());
        };
        check();
    }, [userId, postId]);

    const handleToggle = async () => {
        if (!userId) return;
        const db = getFirestore();
        const likeRef = doc(db, "like", userId, "posts", postId);
        const postRef = doc(db, "post", postId);

        if (liked) {
            await deleteDoc(likeRef);
            await updateDoc(postRef, { likes: increment(-1) });
            setCount(c => c - 1);
        } else {
            await setDoc(likeRef, { createdAt: new Date() });
            await updateDoc(postRef, { likes: increment(1) });
            setCount(c => c + 1);
        }
        setLiked(v => !v);
    };

    return (
        <Stack direction="row" gap={0.5} alignItems="center">
            <IconButton size="small" onClick={handleToggle} disabled={!userId} color={liked ? 'error' : 'default'}>
                {liked ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}
            </IconButton>
            <Typography variant="body2">{count.toLocaleString(window.navigator.language, { notation: 'compact' })}</Typography>
        </Stack>
    );
}
