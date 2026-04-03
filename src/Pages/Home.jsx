import { Box, Button, CircularProgress, Skeleton, Stack, Typography } from '@mui/material';
import { collection, collectionGroup, doc, getDocs, getFirestore, limit, orderBy, query, startAfter, where } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { Link as RouterLink, useOutletContext } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import PostCard from '../components/PostCard';
import PostCardSkeleton from '../components/PostCardSkeleton';
import StationCard from '../components/StationCard';
import { labels, windowLang } from '../utils';
import { getRecentPlays, getTopTags } from '../utils/recentPlays';
import { getAuth } from 'firebase/auth';
import { getUserStations } from '../firebase/utills';

const PAGE_SIZE = 10;

export default function Home() {
    const [initData, setInitData] = useOutletContext();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [recommended, setRecommended] = useState([]);
    const [initialLoading, setInitialLoading] = useState(true);
    const [stationUsers, setStationUsers] = useState([]);
    const [myStations, setMyStations] = useState([]);
    const [stationsLoading, setStationsLoading] = useState(true);

    const lastDoc = useRef(null);
    const shownIds = useRef(new Set());

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

    useEffect(() => {
        const init = async () => {
            // Load stations (users who have posts)
            const authors = await fetchActiveAuthors();
            setStationUsers(authors);

            // Load user's own custom stations
            const currentUser = getAuth().currentUser;
            if (currentUser) {
                const own = await getUserStations(currentUser.uid);
                setMyStations(own);
            }
            setStationsLoading(false);

            // Load recommendations
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
        <Stack direction="column" gap={3}>
            {/* Stations section */}
            <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="h6">📻 {labels[windowLang]['stations']}</Typography>
                    {getAuth().currentUser && (
                        <Button component={RouterLink} to="/stations" size="small" variant="text">
                            {labels[windowLang]['my-stations']}
                        </Button>
                    )}
                </Stack>

                {stationsLoading ? (
                    <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1 }}>
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Skeleton key={i} variant="rounded" width={220} height={80} sx={{ flexShrink: 0 }} />
                        ))}
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1, scrollbarWidth: 'thin' }}>
                        {/* User's own custom stations first */}
                        {myStations.map(s => (
                            <StationCard key={s.id} userId={getAuth().currentUser.uid} station={s} />
                        ))}
                        {/* Then other authors' stations */}
                        {stationUsers
                            .filter(uid => uid !== getAuth().currentUser?.uid)
                            .map(uid => (
                                <StationCard key={uid} userId={uid} />
                            ))
                        }
                    </Box>
                )}
            </Box>

            {/* Recommendations */}
            {recommended.length > 0 && (
                <Box>
                    <Typography variant="h6" mb={1}>🎧 {labels[windowLang]['based-on-listening']}</Typography>
                    <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1, scrollbarWidth: 'thin' }}>
                        {recommended.map(item => (
                            <Box key={item.id + 'rec'} sx={{ minWidth: 300, flexShrink: 0 }}>
                                <PostCard postData={item} />
                            </Box>
                        ))}
                    </Box>
                </Box>
            )}

            {/* Post feed */}
            {!initialLoading && data.length === 0 && (
                <EmptyState icon="🎵" message={labels[windowLang]['no-posts'] || 'No posts yet'} actionLabel={labels[windowLang]['upload'] || 'Upload'} actionTo="/upload" />
            )}
            <Box sx={{ columnCount: "auto", columnWidth: { xs: "100%", sm: "300px" } }}>
                {initialLoading
                    ? Array.from({ length: 6 }).map((_, i) => <PostCardSkeleton key={`skel-${i}`} />)
                    : data.map(item => <PostCard key={item.id + "postCard"} postData={item} />)
                }
            </Box>
            {hasMore && !initialLoading && (
                <Button onClick={loadMore} disabled={loading} variant="outlined" sx={{ alignSelf: "center" }}>
                    {loading ? <CircularProgress size={24} /> : labels[windowLang]['load-more'] || 'Load more'}
                </Button>
            )}
        </Stack>
    );
}

// Fetch unique authors who have public posts (for station cards)
async function fetchActiveAuthors() {
    const db = getFirestore();
    const postsRef = collection(db, 'post');
    const q = query(
        postsRef,
        where('visibility', '==', 'public'),
        where('indexed', '==', true),
        orderBy('creationTime', 'desc'),
        limit(50)
    );
    const snapshot = await getDocs(q);
    const seen = new Set();
    const authors = [];
    snapshot.docs.forEach(d => {
        const userId = d.data().user?.id;
        if (userId && !seen.has(userId)) {
            seen.add(userId);
            authors.push(userId);
        }
    });
    return authors.slice(0, 10);
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
