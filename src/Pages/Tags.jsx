import { Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import PostCard from '../components/PostCard';
import EmptyState from '../components/EmptyState';
import { getPostFromTags } from '../firebase/utills';

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
        const temp = tags.split(',').map((tag) => (tag));
        setPosts(await getPostFromTags(temp))
        setInitialData((val) => {
            const temp = { ...val };
            delete temp.main.loading
            return temp;
        })
    }

    return (
        <Stack direction="column" gap={2}>
            <Typography variant="h5" fontWeight={600}>#{decodeURIComponent(tags)}</Typography>
            <Stack direction={"row"} gap={2} flexWrap={"wrap"}>
            {posts?.length > 0
                ? posts.map((post) => <PostCard key={post.id} postData={post} />)
                : posts && <EmptyState icon="🏷️" message={`No posts found for "${tags}"`} />
            }
            </Stack>
        </Stack>
    )
}
