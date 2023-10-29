import { Avatar } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { getAvatarImage } from '../firebase/utills';
import { stringAvatar } from './PostCard';

export default function UserAvatar({ username, url, ...props }) {
    const [avatarURL, setAvatarURL] = useState();
    useEffect(() => {
        const fetchAvatar = async () => {
            const temp = await getAvatarImage(url)
            setAvatarURL(temp)
        }
        if (url && url.includes("gs://")) {
            fetchAvatar()
        }
    }, [url])
    return (
        <Avatar src={avatarURL || (url?.includes("gs://") ? "" : url)} {...stringAvatar(username, { width: props.width || 40, height: props.height || 40 })} />
    )
}
