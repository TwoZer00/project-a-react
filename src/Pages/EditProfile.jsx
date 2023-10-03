import { useState } from 'react';
import { Stack, FormControl, FormLabel, FormHelperText, TextField, Box, Typography, Button } from '@mui/material';
import React, { useEffect } from 'react'
import { Navigate, useNavigate, useOutletContext } from 'react-router-dom'
import { InputField } from './Login';
import { CustomToggleButton, genderToNumber } from './Register';
import { genderToText } from '../utils';
import UserAvatar from '../components/UserAvatar';
import InputFileField from '../components/InputFileField';
import { postProfileImage, updateUser } from '../firebase/utills';

export default function EditProfile() {
    const [initData, setInitData] = useOutletContext();
    const [user, setUser] = useState(initData.user);
    const [image, setImage] = useState();
    const [imageUrl, setImageUrl] = useState(initData?.user?.avatarURL || undefined);
    const navigate = useNavigate();
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

    const fileToUrl = (file, targetElement) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            targetElement(e.target.result)
        };
        reader.readAsDataURL(file);
    }

    const handleChanges = async (event) => {
        event.preventDefault();
        console.log(event.target.gender.value);
        let tempImageUrl;
        if (image) {
            tempImageUrl = await postProfileImage(user.id, image);
            console.log(tempImageUrl);
        }
        const tempUser = { ...user };
        tempUser.gender = event.target.gender.value;
        if (tempImageUrl) {
            tempUser.avatarURL = tempImageUrl;
        }
        const updatedUser = await updateUser(user.id, tempUser);
        if (updatedUser) {
            const temp = { ...initData };
            temp.user = updatedUser;
            setInitData(temp);
            setUser(updatedUser);
        }

    }
    if (initData?.user) {
        return (
            <>
                <Stack direction={"column"} component={"form"} height={"100%"} onSubmit={handleChanges} >
                    <Stack direction={"column"} gap={2}>
                        <Stack direction={"row"} gap={2} alignItems={"center"}>
                            <UserAvatar url={user.avatarURL || imageUrl} username={user.username} width={150} height={150} />
                            <InputFileField file={image} label={"Change Profile Picture"} setFile={setImage} accept={"image/*"} filesize={1.5} />
                        </Stack>
                        <Stack direction={"column"} gap={2} sx={{ width: "100%" }}>
                            <Stack direction={"row"} gap={2}>
                                <TextField
                                    fullWidth
                                    id="outlined-controlled"
                                    label="Username"
                                    value={user.username}
                                    onChange={(event) => {
                                        setUser((value) => {
                                            const temp = { ...value };
                                            temp.username = event.target.value;
                                            return temp
                                        });
                                    }}
                                />
                                <CustomToggleButton value={genderToText(parseInt(user.gender))} />
                            </Stack>
                            <TextField
                                id="outlined-multiline-static"
                                label="Description"
                                multiline
                                fullWidth
                                rows={4}
                                value={user.description}
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
            </>
        )
    }
}
