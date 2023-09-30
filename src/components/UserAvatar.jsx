import { Avatar } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { stringAvatar } from './PostCard'
import { getAvatarImage } from '../firebase/utills'

export default function UserAvatar({ username, url, ...props }) {
    const [avatarURL, setAvatarURL] = useState();
    useEffect(() => {
        const fetchAvatar = async () => {
            const temp = await getAvatarImage(url)
            setAvatarURL(temp)
        }
        if (url) {
            fetchAvatar()
        }
    }, [url])
    return (
        <Avatar src={avatarURL} {...stringAvatar(username, { width: props.width || 40, height: props.height || 40 })} />
    )
}
