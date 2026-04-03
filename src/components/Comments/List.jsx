import { Box, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Comment from './Comment';

export default function List({ commentsList, comment, postAuthorId, onReply, refreshReplies }) {
    const [listC, setListC] = useState();

    useEffect(() => {
        if (comment) {
            const temp = commentsList.filter(item => item.id !== comment);
            setListC(temp);
        }
    }, [comment]);

    if (comment === null) {
        return (
            <Stack direction="column" gap={2}>
                {commentsList?.length > 0 && commentsList.map(c => (
                    <Comment key={c.id} id={c.id} postAuthorId={postAuthorId} onReply={onReply} refreshReplies={refreshReplies} />
                ))}
            </Stack>
        );
    }

    return (
        <Stack direction="column" gap={2}>
            <Box paddingY={2}>
                <Comment id={comment} postAuthorId={postAuthorId} onReply={onReply} refreshReplies={refreshReplies} />
            </Box>
            {listC?.length > 0 && listC.map(c => (
                <Comment key={c.id} id={c.id} postAuthorId={postAuthorId} onReply={onReply} refreshReplies={refreshReplies} />
            ))}
        </Stack>
    );
}
