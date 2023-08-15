import { Chip } from '@mui/material';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';

export default function TagList() {
    const [tags, setTags] = useState();
    useEffect(() => {
        const loadTags = async () => {
            const tagsTemp = await getTags();
            setTags(tagsTemp);
        }
        loadTags();
    }, [])
    return (
        <>
            {tags?.map((tag) => <Chip label={tag.title} key={tag.title} variant='outlined' color='primary' onClick={() => { }} />)}
        </>
    )
}

async function getTags() {
    const tagsArray = [];
    const db = getFirestore();
    const tagsRef = collection(db, 'tag');
    const tags = await getDocs(tagsRef);
    tags.docs.forEach(doc => {
        tagsArray.push(doc.data());
    })
    return tagsArray;
}