import { Bookmark, BookmarkBorder } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { getAuth } from 'firebase/auth';
import { deleteDoc, doc, getDoc, getFirestore, serverTimestamp, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { labels, windowLang } from '../utils';

export default function BookmarkButton({ postId }) {
    const [saved, setSaved] = useState(false);
    const userId = getAuth().currentUser?.uid;

    useEffect(() => {
        if (!userId || !postId) return;
        getDoc(doc(getFirestore(), "user", userId, "bookmarks", postId))
            .then(snap => setSaved(snap.exists()));
    }, [userId, postId]);

    const handleToggle = async () => {
        if (!userId) return;
        const ref = doc(getFirestore(), "user", userId, "bookmarks", postId);
        if (saved) {
            await deleteDoc(ref);
        } else {
            await setDoc(ref, { createdAt: serverTimestamp() });
        }
        setSaved(v => !v);
    };

    return (
        <IconButton
            size="small"
            onClick={handleToggle}
            disabled={!userId}
            color={saved ? 'primary' : 'default'}
            title={!userId ? labels[windowLang]['sign-in-first'] : ''}
        >
            {saved ? <Bookmark fontSize="small" /> : <BookmarkBorder fontSize="small" />}
        </IconButton>
    );
}
