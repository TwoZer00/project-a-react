import { Button, Tooltip } from '@mui/material';
import { getAuth } from 'firebase/auth';
import { doc, getFirestore } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { deleteFollower, setFollower } from '../../firebase/utills';

export default function ButtonFollow({ userId, followerId, setFData, ...props }) {
    const [initData, setInitData] = useOutletContext();
    const buttonRef = useRef();
    const navigate = useNavigate();
    const handleClick = async () => {
        if (!getAuth().currentUser) {
            navigate('/login')
        }
        handleFollow();
    }
    const handleFollow = async () => {
        try {
            const temp = { ...initData }
            if (getAuth().currentUser.uid === followerId) throw new Error('Cant follow yourself :C')
            if (alreadyFollowing()) {
                const ref = initData.user.followings.find(item => item.user.id === followerId)
                await deleteFollower(userId, followerId, ref.date);
                temp.user.followings = temp.user.followings.filter(item => item.user.id !== followerId)
                temp.notification = { msg: "Unfollowed", type: "success" }
            }
            else {
                const date = new Date();
                await setFollower(userId, followerId, date);
                temp.user.followings = temp.user.followings || []
                temp.user.followings.push({ user: doc(getFirestore(), 'user', followerId), date })
                temp.notification = { msg: "Followed", type: "success" }
            }
            setInitData(temp)
        } catch (error) {
            setInitData({ ...initData, notification: { msg: error.message, type: "error" } });
        }
        finally {
            setInitData(prev => {
                const temp = { ...prev }
                delete temp.loading
                return temp;
            })
        }
    }
    const alreadyFollowing = () => {
        return initData?.user?.followings?.some(item => item?.user?.id === followerId)
    }

    if (props.type === "text") {
        return (
            <>
                <Tooltip title={getAuth().currentUser?.uid ? "You have to log in" : ""}>
                    {getAuth().currentUser?.uid !== followerId &&
                        <Button ref={buttonRef} variant='outlined' color='inherit' sx={{ width: "fit-content", ":first-letter": { textTransform: 'uppercase' } }} size='small' onClick={handleClick} disabled={initData?.loading} >
                            {alreadyFollowing() ? "unfollow" : "follow"} {getAuth().currentUser?.uid == followerId ? 'self' : ''}
                        </Button>}
                </Tooltip>
            </>
        )
    }
    else {
        return (
            <>
                {getAuth().currentUser?.uid !== followerId &&
                    <Button ref={buttonRef} variant='text' color='inherit' disableElevation sx={{ width: "fit-content", fontSize: 8, padding: 0, ":first-letter": { textTransform: 'uppercase' } }} size='small' onClick={handleClick} disabled={initData?.loading} >
                        {alreadyFollowing() ? "unfollow" : "follow"} {getAuth().currentUser?.uid == followerId ? 'self' : ''}
                    </Button>}
            </>
        )
    }
}
