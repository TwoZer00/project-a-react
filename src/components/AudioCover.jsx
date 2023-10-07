import React, { useEffect, useState } from 'react'
import { getAvatarImage } from '../firebase/utills'
import { Box } from '@mui/material';

export default function AudioCover({ url, username }) {
    const [image, setImage] = useState();
    useEffect(() => {
        const fetchImage = async () => {
            const temp = await getAvatarImage(url)
            setImage(temp);
        }
        if (url.includes('gs://')) {
            fetchImage()
        }
        else {
            setImage(url);
        }
    })
    return (
        <Box>
            <img src={image} alt={`${username} cover image`} width="100%" height={"100%"} style={{ aspectRatio: "1/1", objectFit: "cover" }} />
        </Box>
    )
}
