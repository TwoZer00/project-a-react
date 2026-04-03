import { Close, Send } from '@mui/icons-material'
import { Button, Chip, Stack, TextField, Tooltip } from '@mui/material'
import { getAuth } from 'firebase/auth'
import { arrayUnion, collection, doc, getFirestore, increment, writeBatch } from 'firebase/firestore'
import React, { useEffect, useRef, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { labels, windowLang } from '../../utils'
import { createNotification } from '../../firebase/notifications'

export default function InputComment({ post, setCommentList, replyTo, onCancelReply, onReplySent }) {
    const [initData, setInitData] = useOutletContext();
    const [commentContent, setComment] = useState("");
    const inputRef = useRef();

    useEffect(() => {
        if (replyTo) inputRef.current?.focus();
    }, [replyTo]);

    const handleChange = (e) => {
        setComment(e.target.value);
    }
    const handleSubmit = async () => {
        const sanitized = commentContent.trim().substring(0, 1000);
        if (!sanitized) return;
        setInitData((prev) => {
            return { ...prev, loading: true }
        })
        const db = getFirestore();
        const postRef = doc(db, "post", post.id);
        const batch = writeBatch(db);

        if (replyTo?.id) {
            // Reply goes into subcollection: comment/{parentId}/replies/{replyId}
            const replyRef = doc(collection(db, "comment", replyTo.id, "replies"));
            batch.set(replyRef, {
                content: sanitized,
                creationTime: new Date(),
                user: doc(db, "user", getAuth().currentUser.uid),
                post: postRef,
                postOwned: doc(db, "user", post.user.id)
            });
            batch.update(postRef, { commentCount: increment(1) });
        } else {
            // Top-level comment
            const commentRef = doc(collection(db, 'comment'));
            batch.update(postRef, { comment: arrayUnion(commentRef), commentCount: increment(1) });
            batch.set(commentRef, {
                content: sanitized,
                creationTime: new Date(),
                user: doc(db, "user", getAuth().currentUser.uid),
                post: postRef,
                postOwned: doc(db, "user", post.user.id)
            });
            setCommentList((prev) => [commentRef, ...prev]);
        }

        await batch.commit();
        // Notify post owner of new comment
        if (!replyTo?.id && post.user.id !== getAuth().currentUser.uid) {
            createNotification(post.user.id, { type: 'comment', fromUserId: getAuth().currentUser.uid, postId: post.id });
        }
        setComment("");
        if (replyTo?.id && onReplySent) onReplySent();
        // Notify original commenter of reply (we don't have the commenter's userId here, handled by the caller if needed)
        if (onCancelReply) onCancelReply();
        setInitData((prev) => {
            const temp = { ...prev }
            delete temp.loading;
            temp.notification = { type: 'success', msg: replyTo ? labels[windowLang]['reply-sent'] : labels[windowLang]['comment-sent'] };
            return temp;
        })
    }
    return (
        <Stack direction={"column"} gap={2}>
            {replyTo && (
                <Chip
                    label={`Replying to @${replyTo.username}`}
                    onDelete={onCancelReply}
                    deleteIcon={<Close />}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ alignSelf: 'flex-start' }}
                />
            )}
            <TextField
                value={commentContent}
                multiline
                minRows={2}
                maxRows={4}
                fullWidth
                onChange={handleChange}
                label={replyTo ? `Reply to @${replyTo.username}` : labels[windowLang]['leave-comment']}
                inputProps={{ maxLength: 1000 }}
                inputRef={inputRef}
            />
            <Tooltip title={`${getAuth().currentUser ? "" : "Please sign in first"}`} >
                <span style={{ width: "fit-content", marginLeft: "auto" }}>
                    <Button onClick={handleSubmit} disabled={!getAuth().currentUser || !commentContent.trim()} endIcon={<Send />} color="primary" size="small" variant='contained'>
                        {labels[windowLang]['send']}
                    </Button>
                </span>
            </Tooltip>
        </Stack>
    )
}
