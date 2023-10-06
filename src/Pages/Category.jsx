import React, { useEffect, useState } from 'react'
import { useOutletContext, useParams } from 'react-router-dom';
import { getPostFromCategory } from '../firebase/utills';
import { Stack } from '@mui/material';
import PostCard from '../components/PostCard';

export default function Category() {
    const { category } = useParams();
    const [posts, setPosts] = useState();
    const [initialData, setInitialData] = useOutletContext();
    const handleCategory = async () => {
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
            setInitialData((val) => {
                const temp = { ...val };
                temp.main.title = category
                temp.main.loading = true;
                return temp;
            });
            handleCategory();
        }
    }, [])

    return (
        <>
            {/* <Typography variant="h1">{genre} audios</Typography> */}
            <Stack direction={"row"} gap={2}>
                {posts?.map(post => { return <PostCard key={post.id} postData={post} /> })}
            </Stack>
        </>
    )
}
