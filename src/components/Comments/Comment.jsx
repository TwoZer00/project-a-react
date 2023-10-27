import { Card, CardContent, Link, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { getComment, getUserData } from '../../firebase/utills';

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
                <CardContent>
                    <Stack direction={"column"}>
                        <Link component={RouterLink} underline='hover' to={`/user/${comment?.user.id}`}>{user?.username}</Link>
                        <Link variant="caption" component={RouterLink} to={`?comment=${id}`} underline='hover' color={"inherit"} >{moment.duration(moment(new Date(comment?.creationTime.seconds * 1000)).subtract(new Date())).humanize(true)}</Link>
                        <Typography variant="body">{comment?.content}</Typography>
                    </Stack>
                </CardContent>
            </Card>
        </>
    )
}
