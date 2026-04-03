import React, { useEffect, useState } from 'react'
import { useOutletContext, useParams } from 'react-router-dom'
import { getPostFromGenre } from '../firebase/utills';
import PostCard from '../components/PostCard';
import Typography from '@mui/material/Typography'
import { Stack } from '@mui/material';

export default function Genre() {
    const { genre } = useParams();
    const [posts, setPosts] = useState();
    const [initData, setInitData] = useOutletContext();
    const handleGenre = async () => {
        const temp = await getPostFromGenre(genre);
        setPosts(temp);
    }

    useEffect(() => {
        setInitData((val) => ({ ...val, main: { ...val?.main, title: genre } }));
        if (!posts) {
            handleGenre();
        }
    }, [])

    return (
        <>
            <Typography variant="h5" fontWeight={600} sx={{ ':first-letter': { textTransform: 'uppercase' }, mb: 1 }}>{genre}</Typography>
            <Stack direction={"row"} gap={2} flexWrap={"wrap"}>
                {posts?.map(post => { return <PostCard key={post.id} postData={post} /> })}
            </Stack>
        </>
    )
}
