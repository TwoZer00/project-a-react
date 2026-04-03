import { Box, Button, CircularProgress, Skeleton, Stack, Tab, Tabs, Typography } from '@mui/material';
import { collection, doc, getDocs, getFirestore, limit, orderBy, query, startAfter, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import React, { useEffect, useRef, useState } from 'react';
import { Link as RouterLink, useOutletContext } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import PostListItem from '../components/PostListItem';
import PostListItemSkeleton from '../components/PostListItemSkeleton';
import StationCard from '../components/StationCard';
import { getPostData, getUserStations } from '../firebase/utills';
import { labels, windowLang } from '../utils';
import { getRecentPlays, getTopTags } from '../utils/recentPlays';

const PAGE_SIZE = 10;

export default function Home() {
    const [initData, setInitData] = useOutletContext();
    const [tab, setTab] = useState(0);

    // Stations
    const [stationUsers, setStationUsers] = useState([]);
    const [myStations, setMyStations] = useState([]);
    const [stationsLoading, setStationsLoading] = useState(true);

    // For You
    const [forYou, setForYou] = useState([]);
    const [forYouLoading, setForYouLoading] = useState(true);

    // New feed
    const [feed, setFeed] = useState([]);
    const [feedLoading, setFeedLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const lastDoc = useRef(null);
    const feedIds = useRef(new Set());

    // Bookmarks
    const [bookmarks, setBookmarks] = useState([]);
    const [bookmarksLoading, setBookmarksLoading] = useState(false);
    const [bookmarksLoaded, setBookmarksLoaded] = useState(false);

    useEffect(() => {
        setInitData(val => ({ ...val, main: { ...val?.main, title: "A project" } }));
    }, []);

    useEffect(() => {
        document.title = `${initData?.postInPlay
            ? initData?.main.title + ' - ' + initData?.postInPlay?.title
            : initData?.main?.title}`;
    }, [initData?.main, initData?.postInPlay]);

    // Load stations + for you on mount
    useEffect(() => {
        const init = async () => {
            // Stations
            const authors = await fetchActiveAuthors();
            setStationUsers(authors);
            const currentUser = getAuth().currentUser;
            if (currentUser) {
                const own = await getUserStations(currentUser.uid);
                setMyStations(own);
            }
            setStationsLoading(false);

            // For You — try recommendations first, fall back to random
            let forYouData = [];
            const topTags = getTopTags(10);
            if (topTags.length > 0) {
                try {
                    forYouData = await fetchRecommended(topTags);
                } catch (e) { console.error(e); }
            }
            if (forYouData.length === 0) {
                forYouData = await fetchRandom();
            }
            setForYou(forYouData);
            setForYouLoading(false);

            // New feed (first page)
            await loadMoreFeed();
        };
        init();
    }, []);

    // Lazy load bookmarks when tab is selected
    useEffect(() => {
        if (tab === 2 && !bookmarksLoaded) {
            loadBookmarks();
        }
    }, [tab]);

    const loadMoreFeed = async () => {
        setFeedLoading(true);
        const { posts, last } = await fetchPosts(!!initData?.preferences?.nsfw, lastDoc.current);
        lastDoc.current = last;
        const unique = posts.filter(p => !feedIds.current.has(p.id));
        unique.forEach(p => feedIds.current.add(p.id));
        setFeed(prev => [...prev, ...unique]);
        if (posts.length < PAGE_SIZE) setHasMore(false);
        setFeedLoading(false);
    };

    const loadBookmarks = async () => {
        const userId = getAuth().currentUser?.uid;
        if (!userId) { setBookmarksLoaded(true); return; }
        setBookmarksLoading(true);
        const db = getFirestore();
        const q = query(collection(db, "user", userId, "bookmarks"), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        const results = await Promise.all(snap.docs.map(d => getPostData(d.id).catch(() => null)));
        setBookmarks(results.filter(Boolean));
        setBookmarksLoading(false);
        setBookmarksLoaded(true);
    };

    return (
        <Stack direction="column" gap={2}>
            {/* Stations */}
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
                        {myStations.map(s => (
                            <StationCard key={s.id} userId={getAuth().currentUser.uid} station={s} />
                        ))}
                        {stationUsers
                            .filter(uid => uid !== getAuth().currentUser?.uid)
                            .map(uid => <StationCard key={uid} userId={uid} />)
                        }
                    </Box>
                )}
            </Box>

            {/* Tabs */}
            <Tabs
                value={tab}
                onChange={(_, v) => setTab(v)}
                variant="fullWidth"
                sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
                <Tab label={`🎧 ${labels[windowLang]['discover']}`} />
                <Tab label={`🆕 ${labels[windowLang]['recent-posts']}`} />
                {getAuth().currentUser && <Tab label={`🔖 ${labels[windowLang]['bookmarks']}`} />}
            </Tabs>

            {/* Tab content */}
            <Box>
                {tab === 0 && (
                    <ForYouTab items={forYou} loading={forYouLoading} />
                )}
                {tab === 1 && (
                    <NewTab items={feed} loading={feedLoading} hasMore={hasMore} onLoadMore={loadMoreFeed} />
                )}
                {tab === 2 && (
                    <BookmarksTab items={bookmarks} loading={bookmarksLoading} />
                )}
            </Box>
        </Stack>
    );
}

function ForYouTab({ items, loading }) {
    if (loading) return Array.from({ length: 6 }).map((_, i) => <PostListItemSkeleton key={i} />);
    if (items.length === 0) return <EmptyState icon="🎵" message={labels[windowLang]['no-posts']} />;
    return items.map(item => <PostListItem key={item.id} postData={item} />);
}

function NewTab({ items, loading, hasMore, onLoadMore }) {
    return (
        <>
            {items.length === 0 && !loading && (
                <EmptyState icon="🎵" message={labels[windowLang]['no-posts']} actionLabel={labels[windowLang]['upload']} actionTo="/upload" />
            )}
            {items.map(item => <PostListItem key={item.id} postData={item} />)}
            {loading && Array.from({ length: 4 }).map((_, i) => <PostListItemSkeleton key={`skel-${i}`} />)}
            {hasMore && !loading && items.length > 0 && (
                <Button onClick={onLoadMore} variant="outlined" fullWidth sx={{ mt: 1 }}>
                    {labels[windowLang]['load-more']}
                </Button>
            )}
        </>
    );
}

function BookmarksTab({ items, loading }) {
    if (loading) return Array.from({ length: 4 }).map((_, i) => <PostListItemSkeleton key={i} />);
    if (!getAuth().currentUser) return <EmptyState icon="🔒" message={labels[windowLang]['sign-in-first']} />;
    if (items.length === 0) return <EmptyState icon="🔖" message={labels[windowLang]['no-bookmarks']} />;
    return items.map(item => <PostListItem key={item.id} postData={item} />);
}

async function fetchActiveAuthors() {
    const db = getFirestore();
    const q = query(
        collection(db, 'post'),
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
        if (userId && !seen.has(userId)) { seen.add(userId); authors.push(userId); }
    });
    return authors.slice(0, 10);
}

async function fetchRandom() {
    const db = getFirestore();
    const q = query(
        collection(db, 'post'),
        where('visibility', '==', 'public'),
        where('indexed', '==', true),
        orderBy('creationTime', 'desc'),
        limit(30)
    );
    const snapshot = await getDocs(q);
    const all = snapshot.docs.map(d => ({ ...d.data(), id: d.id }));
    for (let i = all.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [all[i], all[j]] = [all[j], all[i]];
    }
    return all.slice(0, 8);
}

async function fetchRecommended(tagPaths) {
    const db = getFirestore();
    const tagRefs = tagPaths.map(t => doc(db, t));
    const recentIds = getRecentPlays().map(p => p.id);
    const q = query(
        collection(db, 'post'),
        where('visibility', '==', 'public'),
        where('indexed', '==', true),
        where('tags', 'array-contains-any', tagRefs),
        orderBy('creationTime', 'desc'),
        limit(15)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs
        .map(d => ({ ...d.data(), id: d.id }))
        .filter(p => !recentIds.includes(p.id))
        .slice(0, 8);
}

async function fetchPosts(nsfw = false, lastVisible = null) {
    const db = getFirestore();
    const constraints = [
        where('visibility', '==', 'public'),
        where('indexed', '==', true),
        orderBy('creationTime', 'desc'),
        limit(PAGE_SIZE)
    ];
    if (!nsfw) constraints.splice(1, 0, where('nsfw', '==', false));
    if (lastVisible) constraints.push(startAfter(lastVisible));
    const snapshot = await getDocs(query(collection(db, 'post'), ...constraints));
    return {
        posts: snapshot.docs.map(d => ({ ...d.data(), id: d.id })),
        last: snapshot.docs[snapshot.docs.length - 1] || null
    };
}
