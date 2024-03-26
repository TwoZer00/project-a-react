import { Card, CardContent, CardHeader, Chip, Link, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import 'dayjs/locale/es';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { getComment, getUserData } from '../../firebase/utills';
import { windowLang } from '../../utils';
import UserAvatar from '../UserAvatar';
dayjs.extend(duration)
dayjs.extend(relativeTime)

export default function Comment({ id }) {
    const [comment, setComment] = useState()
    const [user, setUser] = useState();
    useEffect(() => {
        const fetchComment = async () => {
            const temp = await getComment(id);
            temp.creationTime = inTime(temp?.creationTime);
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
                    subheader={<Link variant="caption" component={RouterLink} to={`?comment=${id}`} underline='hover' color={"inherit"} >{comment?.creationTime}</Link>}

                />
                <CardContent>
                    <Typography variant="body">{comment?.content}</Typography>
                </CardContent>
            </Card>
        </>
    )
}

export const inTime = (date) => {
    const now = dayjs(new Date())
    const created = dayjs(new Date(date.seconds * 1000))
    const diff = dayjs.duration(created.diff(now)).locale(windowLang)
    // console.log(diff.humanize());
    return diff.humanize(true)
    // console.log(now.format("DD/MM/YYYY HH:MM:ss"), created.format("DD/MM/YYYY HH:MM:ss"), diff.humanize(true));
    //dayjs.duration(dayjs(new Date(comment?.creationTime.seconds * 1000)).subtract(new Date())).locale(windowLang).humanize(true)
}
