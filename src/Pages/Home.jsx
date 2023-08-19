import { Grid, Stack } from '@mui/material';
import { collection, getDocs, getFirestore, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import PostCard from '../components/PostCard';
import TagList from '../components/TagList';

export default function Home() {
    const [initData, setInitData] = useOutletContext();
    const [data, setData] = useState();

    useEffect(() => {
        // console.log(initData);
        const temp = { title: 'A PROJECT' }
        // const main = { ...initData }
        // tempData.main = { ...temp }
        // document.title = temp.title
        // console.log(tempData);
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
            const posts = await fetchPosts();
            // console.log(posts);
            setData(posts);
        }
        loadPost();
    }, []);
    return (
        <Stack direction={"column"} gap={2} >
            <div>
                <TagList />
            </div>
            <Grid container gap={2} direction={{ sm: "column", md: "row" }} >
                {
                    data?.map(item => <PostCard key={item.id + "postCard"} postData={item} />)
                }
            </Grid>
        </Stack>
    )
}

async function fetchPosts() {
    let posts = [];
    const db = getFirestore();
    const postsRef = collection(db, 'post');
    const q = query(postsRef, orderBy('creationTime', 'desc'));
    const post = await getDocs(q)
    post.forEach((doc) => {
        posts.push({ ...doc.data(), id: doc.id })
    });
    return posts;
}
