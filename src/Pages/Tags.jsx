import { useEffect, useState } from 'react';
import { useOutlet, useOutletContext, useParams, useSearchParams } from 'react-router-dom'
import { getPostFromTags } from '../firebase/utills';
import PostCard from '../components/PostCard';
import { Stack } from '@mui/material';

export default function Tags() {
    const { tags } = useParams();
    const [posts, setPosts] = useState();
    const [initialData, setInitialData] = useOutletContext();
    useEffect(() => {
        handleTags();
        setInitialData((val) => {
            const temp = { ...val };
            temp.main.title = tags
            temp.main.loading = true;
            return temp;
        })
    }, []);
    useEffect(() => {
        handleTags()
    }, [tags])

    const handleTags = async () => {
        const temp = tags.split(',');
        setPosts(await getPostFromTags(temp))
        setInitialData((val) => {
            const temp = { ...val };
            delete temp.main.loading
            return temp;
        })
    }

    return (
        <Stack direction={"row"} gap={2}>
            {posts?.map((post) => { return <PostCard key={post.id} postData={post} /> })}
        </Stack>
    )
}
