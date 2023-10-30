import { Button } from '@mui/material';
import { getAuth } from 'firebase/auth';
import { doc, getFirestore } from 'firebase/firestore';
import React, { useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { deleteFollower, setFollower } from '../../firebase/utills';

export default function ButtonFollow({ userId, followerId, setFData }) {
    const [initData, setInitData] = useOutletContext();
    const buttonRef = useRef();
    const handleClick = async () => {
        setInitData(prev => ({ ...prev, loading: true }))
        console.log('follow')
        if (!getAuth().currentUser) throw new Error('You must be logged in to follow')
        handleFollow();
    }
    const handleFollow = async () => {
        try {
            const temp = { ...initData }
            if (getAuth().currentUser.uid === followerId) throw new Error('Cant follow yourself :C')
            if (alreadyFollowing()) {
                await deleteFollower(userId, followerId);
                temp.user.followings = temp.user.followings.filter(item => item.id !== followerId)
                temp.notification = { msg: "Unfollowed", type: "success" }
            }
            else {
                await setFollower(userId, followerId);
                temp.user.followings = temp.user.followings || []
                temp.user.followings.push(doc(getFirestore(), 'user', followerId))
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
        return initData?.user?.followings?.some(item => item.id === followerId)
    }
    return (
        <>
            <Button ref={buttonRef} variant='outlined' color='inherit' sx={{ width: "fit-content", ":first-letter": { textTransform: 'uppercase' } }} size='small' onClick={handleClick} disabled={(getAuth().currentUser === null) || initData?.loading} >
                {alreadyFollowing() ? "unfollow" : "follow"} {getAuth().currentUser?.uid == followerId ? 'self' : ''}
            </Button>
        </>
    )
}
