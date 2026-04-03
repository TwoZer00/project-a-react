import { Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import { collection, doc, getDocs, getFirestore, limit, orderBy, query, startAfter, where } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import PostCard from '../components/PostCard';
import PostCardSkeleton from '../components/PostCardSkeleton';
import { labels, windowLang } from '../utils';
import { getRecentPlays, getTopTags } from '../utils/recentPlays';

const PAGE_SIZE = 10;

export default function Home() {
    const [initData, setInitData] = useOutletContext();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [random, setRandom] = useState([]);
    const [recommended, setRecommended] = useState([]);
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        setInitData((val) => ({ ...val, main: { ...val?.main, title: "A project" } }));
    }, []);
    useEffect(() => {
        document.title = `${initData?.postInPlay
            ? initData?.main.title + ' - ' + initData?.postInPlay?.title
            : initData?.main?.title}`;
    }, [initData?.main, initData?.postInPlay]);

    const loadMore = async () => {
        setLoading(true);
        const { posts, last } = await fetchPosts(!!initData?.preferences?.nsfw, lastDoc.current);
        lastDoc.current = last;
        const unique = posts.filter(p => !shownIds.current.has(p.id));
        unique.forEach(p => shownIds.current.add(p.id));
        setData((prev) => [...prev, ...unique]);
        if (posts.length < PAGE_SIZE) setHasMore(false);
        setLoading(false);
    };

    const lastDoc = useRef(null);
    const shownIds = useRef(new Set());

    useEffect(() => {
        const init = async () => {
            const randomData = await fetchRandom();
            setRandom(randomData);
            randomData.forEach(p => shownIds.current.add(p.id));

            const topTags = getTopTags(10);
            if (topTags.length > 0) {
                const recData = await fetchRecommended(topTags);
                setRecommended(recData);
                recData.forEach(p => shownIds.current.add(p.id));
            }
            await loadMore();
            setInitialLoading(false);
        };
        init();
    }, []);

    return (
        <Stack direction={"column"} gap={2}>
            {random.length > 0 && (
                <>
                    <Typography variant="h6" sx={{ ':first-letter': { textTransform: 'uppercase' } }}>
                        🎲 Discover
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1, scrollbarWidth: 'thin' }}>
                        {random.map(item => (
                            <Box key={item.id + 'random'} sx={{ minWidth: 300, flexShrink: 0 }}>
                                <PostCard postData={item} />
                            </Box>
                        ))}
                    </Box>
                </>
            )}
            {recommended.length > 0 && (
                <>
                    <Typography variant="h6" sx={{ ':first-letter': { textTransform: 'uppercase' } }}>
                        🎧 Based on your listening
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1, scrollbarWidth: 'thin' }}>
                        {recommended.map(item => (
                            <Box key={item.id + 'rec'} sx={{ minWidth: 300, flexShrink: 0 }}>
                                <PostCard postData={item} />
                            </Box>
                        ))}
                    </Box>
                </>
            )}
            <Box sx={{ columnCount: "auto", columnWidth: { xs: "100%", sm: "300px" } }}>
                {initialLoading
                    ? Array.from({ length: 6 }).map((_, i) => <PostCardSkeleton key={`skel-${i}`} />)
                    : data?.map(item => <PostCard key={item.id + "postCard"} postData={item} />)
                }
            </Box>
            {hasMore && (
                <Button onClick={loadMore} disabled={loading} variant="outlined" sx={{ alignSelf: "center" }}>
                    {loading ? <CircularProgress size={24} /> : labels[windowLang]['load-more'] || 'Load more'}
                </Button>
            )}
        </Stack>
    )
}

async function fetchRandom() {
    const db = getFirestore();
    const postsRef = collection(db, 'post');
    const q = query(
        postsRef,
        where('visibility', '==', 'public'),
        where('indexed', '==', true),
        orderBy('creationTime', 'desc'),
        limit(30)
    );
    const snapshot = await getDocs(q);
    const all = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    // Shuffle and pick 5
    for (let i = all.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [all[i], all[j]] = [all[j], all[i]];
    }
    return all.slice(0, 5);
}

async function fetchRecommended(tagPaths) {
    const db = getFirestore();
    const postsRef = collection(db, 'post');
    const tagRefs = tagPaths.map(t => doc(db, t));
    const recentIds = getRecentPlays().map(p => p.id);
    const q = query(
        postsRef,
        where('visibility', '==', 'public'),
        where('indexed', '==', true),
        where('tags', 'array-contains-any', tagRefs),
        orderBy('creationTime', 'desc'),
        limit(15)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs
        .map(doc => ({ ...doc.data(), id: doc.id }))
        .filter(p => !recentIds.includes(p.id))
        .slice(0, 6);
}
async function fetchPosts(nsfw = false, lastVisible = null) {
    const db = getFirestore();
    const postsRef = collection(db, 'post');
    const constraints = [
        where('visibility', '==', 'public'),
        where('indexed', '==', true),
        orderBy('creationTime', 'desc'),
        limit(PAGE_SIZE)
    ];
    if (!nsfw) constraints.splice(1, 0, where('nsfw', '==', false));
    if (lastVisible) constraints.push(startAfter(lastVisible));

    const snapshot = await getDocs(query(postsRef, ...constraints));
    const posts = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    const last = snapshot.docs[snapshot.docs.length - 1] || null;
    return { posts, last };
}