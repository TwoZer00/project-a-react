import { Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import CustomNotification, { SlideTransition } from '../components/CustomNotification';
import PostCard from '../components/PostCard';
import { getPostFromCategory } from '../firebase/utills';

export default function Category() {
    const { category } = useParams();
    const [posts, setPosts] = useState();
    const [initialData, setInitialData] = useOutletContext();
    const [notification, setNotification] = useState({ Transition: SlideTransition })
    useEffect(() => {
        if (posts?.length === 0) {
            setNotification(val => {
                return { ...val, open: true }
            })
        }
    }
        , [posts])
    const handleCategory = async () => {
        setInitialData((val) => {
            const temp = { ...val };
            temp.main.title = category
            temp.main.loading = true;
            return temp;
        });
        const temp = await getPostFromCategory(category);
        setPosts(temp);
        setInitialData((val) => {
            const temp = { ...val };
            delete temp.main.loading;
            return temp;
        });
    }

    useEffect(() => {
        if (!posts) {
            handleCategory();
        }
    }, [])

    useEffect(() => {
        if (category) {
            handleCategory();
        } else {
            setPosts([]);
        }
    }, [category])

    return (
        <>
            <Stack direction={"row"} gap={2}>
                {posts?.length > 0 && posts?.map(post => { return <PostCard key={post.id} postData={post} /> })}
                {posts?.length === 0 && <Typography variant='body1' sx={{ mx: "auto" }} >No Posts</Typography>}
            </Stack>
            <CustomNotification val={notification} msg={"not post founded"} setFlag={setNotification} type={"warning"} />
        </>
    )
}
