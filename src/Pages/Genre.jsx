import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import { getPostFromGenre } from '../firebase/utills';
import PostCard from '../components/PostCard';
import { Stack } from '@mui/material';

export default function Genre() {
    const { genre } = useParams();
    const [posts, setPosts] = useState();
    const handleGenre = async () => {
        const temp = await getPostFromGenre(genre);
        setPosts(temp);
        console.log(temp);
    }

    useEffect(() => {
        if (!posts) {
            handleGenre();
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
