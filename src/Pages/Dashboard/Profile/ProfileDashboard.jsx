import { Box, Button, Stack, TextField } from '@mui/material';
import { getAuth } from 'firebase/auth';
import { setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import CustomNotification, { SlideTransition } from '../../../components/CustomNotification';
import InputFileField from '../../../components/InputFileField';
import UserAvatar from '../../../components/UserAvatar';
import { getUserData, postProfileImage, updateUser } from '../../../firebase/utills';
import { genderToText } from '../../../utils';
import { CustomToggleButton } from '../../Register';

export default function ProfileDashboard() {
    const [[user, setUser], postList] = useOutletContext();
    const [userData, setUserData] = useState({});
    const [image, setImage] = useState();
    const [imageUrl, setImageUrl] = useState(user?.avatarURL || undefined);
    const [notFlag, setNotFlag] = useState();



    useEffect(() => {
        const fetchUserData = async () => {
            const data = await getUserData(user.id);
            // const image = await getAvatarImage(user.avatar)
            setUserData(data);
        }
        fetchUserData();
    }, [])

    const fileToUrl = (file, targetElement) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            targetElement(e.target.result)
        };
        reader.readAsDataURL(file);
    }

    useEffect(() => {
        if (image) {
            fileToUrl(image, setImageUrl);
        }
        else {
            setImageUrl()
        }
    }, [image])

    const handleSubmit = async (e) => {
        e.preventDefault();
        delete user.id;
        delete user.creationTime;
        let tempImageUrl;
        const temp = { ...user };
        if (image && getAuth().currentUser.uid) {
            tempImageUrl = await postProfileImage(getAuth()?.currentUser?.uid, image);
        }
        if (tempImageUrl) {
            temp.avatarURL = tempImageUrl;
        }
        try {
            if (!user) {
                await setDoc(getUserDoc(getAuth().currentUser.uid), temp);
            }
            else {
                await updateUser(getAuth().currentUser.uid, temp);
            }
            setUser(temp);
            setNotFlag({ open: true, Transition: SlideTransition });
        } catch (error) {
            console.log(error);
        }

    }

    return (
        <>
            <Stack p={2} width={"100%"} height={"100%"}>
                <Stack direction={"column"} gap={2} alignItems={"center"} mt={2} component={"form"} onSubmit={handleSubmit} height={"100%"}>
                    <Stack maxWidth={"lg"} mx={"auto"} direction={"row"} justifyContent={"center"} alignItems={"center"} width={"100%"} gap={2} >
                        <UserAvatar url={imageUrl || userData?.avatarURL} username={user?.username || getAuth()?.currentUser?.email} width={80} height={80} />
                        <InputFileField file={image} label={"Change Profile Picture"} setFile={setImage} accept={"image/*"} filesize={.50} />
                    </Stack>
                    <Stack maxWidth={"lg"} mx={"auto"} direction={"row"} gap={1} width={"100%"}>
                        <TextField
                            fullWidth
                            id="username"
                            label="Username"
                            value={user?.username}
                            onChange={(event) => {
                                setUser((value) => {
                                    const temp = { ...value };
                                    temp.username = event.target.value;
                                    return temp
                                });
                            }}
                        />
                        <CustomToggleButton value={genderToText(parseInt(user?.gender))} />
                    </Stack>
                    <Box width={"100%"} maxWidth={"lg"} mx={"auto"}>
                        <TextField
                            fullWidth
                            id="outlined-multiline-static"
                            label="Description"
                            multiline
                            rows={4}
                            value={user?.description}
                            onChange={(event) => {
                                setUser((value) => {
                                    const temp = { ...value };
                                    temp.description = event.target.value;
                                    return temp
                                })
                            }}
                        />
                    </Box>
                    <Button variant="contained" sx={{ placeSelf: "flex-end", mt: "auto" }} type='submit' >
                        Save changes
                    </Button>
                </Stack>
            </Stack>
            <CustomNotification msg={"Profile updated"} val={notFlag} setFlag={setNotFlag} />
        </>
    )
}
