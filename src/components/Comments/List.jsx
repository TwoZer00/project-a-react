import { Stack } from '@mui/material'
import React from 'react'
import Comment from './Comment'

export default function List({ commentsList }) {
    return (
        <Stack direction={"column"} gap={2}>
            {commentsList.length > 0 && commentsList.map(comment => <Comment key={comment.id} id={comment.id} />)}
        </Stack>
    )
}
