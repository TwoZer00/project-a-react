import { Box, Stack } from '@mui/material';
import { collection, getDocs, getFirestore, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import PostCard from '../components/PostCard';

export default function Home() {
    const [initData, setInitData] = useOutletContext();
    const [data, setData] = useState();

    useEffect(() => {
        const temp = { ...initData }
        temp.title = "A project";
        setInitData((val) => {
            return { ...val, main: temp }
        });
    }, []);
    useEffect(() => {
        document.title = `${initData?.postInPlay ?
            initData?.main.title + ' - ' + initData?.postInPlay?.title
            :
            initData?.main?.title
            }`
    }, [initData?.main, initData?.postInPlay])
    useEffect(() => {
        const loadPost = async () => {
            const posts = await fetchPosts(!!initData?.preferences?.nsfw);
            setData(posts);
        }
        loadPost();
    }, []);
    return (
        <Stack direction={"column"} gap={2} >
            <Box sx={{ columnCount: "auto", columnWidth: { xs: "100%", sm: "300px" } }}  >
                {
                    data?.map(item => <PostCard key={item.id + "postCard"} postData={item} />)
                }
            </Box>
        </Stack>
    )
}

async function fetchPosts(nsfw = false) {
    let posts = [];
    const db = getFirestore();
    const postsRef = collection(db, 'post');
    let q = query(postsRef, where('visibility', '==', 'public'), where('nsfw', '==', false), where('indexed', '==', true), orderBy('creationTime', 'desc'));
    if (nsfw) {
        q = query(postsRef, where('visibility', '==', 'public'), where('indexed', '==', true), orderBy('creationTime', 'desc'));
    }
    const post = await getDocs(q)
    post.forEach((doc) => {
        posts.push({ ...doc.data(), id: doc.id })
    });
    return posts;
}
