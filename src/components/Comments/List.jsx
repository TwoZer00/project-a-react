import { Box, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Comment from './Comment';

export default function List({ commentsList, comment }) {
    const [listC, setListC] = useState();
    useEffect(() => {
        if (comment) {
            const temp = commentsList.filter(item => { return item.id !== comment })
            setListC(temp);
        }
    }, [comment])
    if (comment === null) {
        return (
            <Stack direction={"column"} gap={2}>
                {commentsList?.length > 0 && commentsList?.map(comment => <Comment key={comment.id} id={comment.id} />)}
            </Stack>
        )
    }
    else {
        return (
            <Stack direction={"column"} gap={2}>
                <Box paddingY={2}>
                    <Comment id={comment} />
                </Box>
                {listC?.length > 0 && listC.map(comment => <Comment key={comment.id} id={comment.id} />)}
            </Stack>
        )
    }
}
