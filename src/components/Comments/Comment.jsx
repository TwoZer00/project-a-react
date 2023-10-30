import { Card, CardContent, CardHeader, Chip, Link, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { getComment, getUserData } from '../../firebase/utills';
import UserAvatar from '../UserAvatar';

export default function Comment({ id }) {
    const [comment, setComment] = useState()
    const [user, setUser] = useState();
    useEffect(() => {
        const fetchComment = async () => {
            const temp = await getComment(id);
            const user = await getUserData(temp.user.id)
            setUser(user)
            setComment(temp)
        }
        fetchComment()
    }, [id])
    return (
        <>
            <Card variant='outlined' id={id} >
                <CardHeader
                    avatar={
                        <UserAvatar url={user?.avatarURL} username={user?.username} />
                    }
                    title={<Stack direction={"row"} gap={1}><Link component={RouterLink} underline='hover' to={`/user/${comment?.user.id}`}>{user?.username}</Link>{comment?.postOwned?.id === comment?.user?.id && <Chip label={"Author"} size='small' />}</Stack>}
                    subheader={<Link variant="caption" component={RouterLink} to={`?comment=${id}`} underline='hover' color={"inherit"} >{moment.duration(moment(new Date(comment?.creationTime.seconds * 1000)).subtract(new Date())).humanize(true)}</Link>}

                />
                <CardContent>
                    <Typography variant="body">{comment?.content}</Typography>
                </CardContent>
            </Card>
        </>
    )
}
