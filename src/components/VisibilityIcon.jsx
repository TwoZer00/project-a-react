import { PlaylistRemove, Public, PublicOff } from '@mui/icons-material'
import React from 'react'

export default function VisibilityIcon(props) {
    switch (props.visibility) {
        case "private":
            return <PublicOff fontSize={props.fontSize} />
        case "unlisted":
            return <PlaylistRemove fontSize={props.fontSize} />
        default:
            return <Public fontSize={props.fontSize} />
    }
}
