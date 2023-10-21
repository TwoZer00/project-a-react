import { Send } from '@mui/icons-material'
import { Button, Stack, TextField, Tooltip } from '@mui/material'
import { getAuth } from 'firebase/auth'
import { arrayUnion, collection, doc, getFirestore, writeBatch } from 'firebase/firestore'
import React, { useState } from 'react'
import { useOutletContext } from 'react-router-dom'

export default function InputComment({ post, setCommentList }) {
    const [initData, setInitData] = useOutletContext();
    const [commentContent, setComment] = useState("");
    const handleChange = (e) => {
        setComment(e.target.value);
    }
    const handleSubmit = async () => {
        setInitData((prev) => {
            return { ...prev, loading: true }
        })
        const db = getFirestore();
        const commentRef = doc(collection(db, 'comment'));
        const postRef = doc(db, "post", post.id);
        const comment = {
            content: commentContent,
            creationTime: new Date(),
            user: doc(db, "user", getAuth().currentUser.uid),
            post: doc(db, "post", post.id)
        }
        const batch = writeBatch(db);
        batch.update(postRef, { comment: arrayUnion(commentRef) })
        batch.set(commentRef, comment);
        await batch.commit();
        setCommentList((prev) => [commentRef, ...prev]);
        setComment("");
        setInitData((prev) => {
            const temp = { ...prev }
            delete temp.loading;
            return temp;
        })
    }
    return (
        <Stack direction={"column"} gap={2}>
            <TextField
                value={commentContent}
                multiline
                minRows={2}
                maxRows={4}
                fullWidth
                onChange={handleChange}
                label="Leave a comment"
            />
            <Tooltip title={`${getAuth().currentUser ? "" : "Please sign in first"}`} >
                <span style={{ width: "fit-content", marginLeft: "auto" }}>
                    <Button onClick={handleSubmit} disabled={!getAuth().currentUser} endIcon={<Send />} color="primary" size="small" variant='contained'>
                        Send
                    </Button>
                </span>
            </Tooltip>
        </Stack>
    )
}
