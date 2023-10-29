import { Box, Button, Stack, TextField } from '@mui/material';
import { getAuth } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import CustomNotification, { SlideTransition } from '../components/CustomNotification';
import InputFileField from '../components/InputFileField';
import UserAvatar from '../components/UserAvatar';
import { postProfileImage, setUser as setUserDoc, updateUser } from '../firebase/utills';
import { genderToText } from '../utils';
import { CustomToggleButton } from './Register';

export default function EditProfile() {
    const [initData, setInitData] = useOutletContext();
    const [user, setUser] = useState(initData.user);
    const [image, setImage] = useState();
    const [imageUrl, setImageUrl] = useState(initData?.user?.avatarURL || undefined);
    const navigate = useNavigate();
    const location = useLocation();
    const [notFlag, setNotFlag] = useState();
    useEffect(() => {
        const temp = { ...initData };
        temp.main = { title: "Edit profile" }
        setInitData(temp);
    }, []);
    useEffect(() => {
        if (image) {
            fileToUrl(image, setImageUrl);
        }
        else {
            setImageUrl();
        }
    }, [image])

    useEffect(() => {
        if (!initData?.user) {
            navigate('/login', { state: { from: location } })
        }
    }, [!initData?.user])
    const fileToUrl = (file, targetElement) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            targetElement(e.target.result)
        };
        reader.readAsDataURL(file);
    }

    const handleChanges = async (event) => {
        event.preventDefault();
        setInitData((val) => {
            const temp = { ...val };
            temp.main.loading = true;
            return temp;
        })
        let tempImageUrl;
        if (image && getAuth().currentUser.uid) {
            tempImageUrl = await postProfileImage(getAuth().currentUser.uid, image);
        }
        const tempUser = { ...user };
        delete tempUser.id;
        tempUser.gender = event.target.gender.value;
        tempUser.avatarURL = "";
        if (tempImageUrl) {
            tempUser.avatarURL = tempImageUrl;
        }
        if (initData.user) {
            console.log(tempUser, "aaa");
            await updateUser(getAuth().currentUser.uid, tempUser);
        }
        else {
            console.log(tempUser, "aaab");
            try {
                await setUserDoc(getAuth().currentUser.uid, tempUser);
            } catch (error) {
                console.log(error);
            }
        }
        const temp = { ...initData };
        temp.user = tempUser;
        setInitData(temp);
        setUser(tempUser);
        setInitData((val) => {
            const temp = { ...val };
            delete temp.main.loading;
            return temp;
        })
        setNotFlag({ open: true, Transition: SlideTransition });
    }
    return (
        <>
            <Stack direction={"column"} component={"form"} height={"100%"} onSubmit={handleChanges} >
                <Stack direction={"column"} gap={2}>
                    <Stack direction={"row"} gap={2} alignItems={"center"}>
                        <UserAvatar url={imageUrl || user?.avatarURL} username={user?.username || getAuth().currentUser.email} width={150} height={150} />
                        <InputFileField file={image} label={"Change Profile Picture"} setFile={setImage} accept={"image/*"} filesize={.50} />
                    </Stack>
                    <Stack direction={"column"} gap={2} sx={{ width: "100%" }}>
                        <Stack direction={"row"} gap={2}>
                            <TextField
                                fullWidth
                                id="outlined-controlled"
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
                        <TextField
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
                    </Stack>
                </Stack>
                <Box sx={{ display: "flex", justifyContent: "flex-end", height: "100%" }}>
                    <Button type='submit' variant='contained' sx={{ height: "fit-content", mt: "auto" }}  >
                        Save Changes
                    </Button>
                </Box>
            </Stack>
            <CustomNotification msg={"Profile updated"} val={notFlag} setFlag={setNotFlag} />
        </>
    )
}
