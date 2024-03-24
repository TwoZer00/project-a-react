import { ThemeProvider } from '@emotion/react'
import styled from '@emotion/styled'
import { FireExtinguisher, Man, Park, PedalBike, SportsRugby, Woman } from '@mui/icons-material'
import { Box, Button, CssBaseline, Divider, Paper, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth'
import { doc, getDoc, getFirestore, serverTimestamp, setDoc } from 'firebase/firestore'
import React, { useRef, useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { labels, windowLang } from '../utils'
import { theme } from './Init'
import { InputField } from './Login'

export default function Register() {
    const [error, setError] = useState({});
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formElements = e.target.elements;
        const formData = new FormData(e.target);
        const tempE = {};
        validateForm(formElements, tempE);
        validatePassword([formElements.password, formElements.confirmPassword], tempE);
        validateUsername(formElements.username, tempE);
        // const userData = {
        //     username: formElements.username.value,
        //     description: formElements.description.value,
        //     gender: formElements.gender.value,
        //     // creationTime: getAuth().currentUser.metadata.creationTime,
        // }
        // console.log(userData);
        // console.log(Array.from(e.target.querySelector("#gender").children).find(item => console.log(item)));
        if (Object.keys(tempE).length === 0) {
            try {
                await createUserWithEmailAndPassword(getAuth(), formData.get("email"), formData.get("password"));
                const db = getFirestore();
                const userRef = doc(db, "user", getAuth().currentUser.uid);
                const userObj = {
                    username: formElements.username.value,
                    description: formElements.description.value,
                    gender: formElements.gender.value,
                    creationTime: serverTimestamp(),
                }
                const user = await setDoc(userRef, userObj);
                navigate("/user");
            }
            catch (err) {
                console.log(err);
            }
        }
        setError(tempE)
    }
    return (
        <>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Box sx={{ display: 'flex', height: "100vh", width: "100vw", justifyContent: "center", alignItems: "center" }}>
                    <Box component={Paper} variant='outlined' sx={{ maxWidth: 500, width: { md: "100%" } }} >
                        <Box display={"flex"} flexDirection={"column"} alignItems={"center"} paddingBottom={2}>
                            <Box display={"flex"} flexDirection={"column"} alignItems={"center"} marginY={1}>
                                <img src="./aproject.svg" alt="aproject logo" width={70} />
                                {/* <Typography variant="h2" color="inherit" fontSize={22} marginTop={1} fontWeight={400}>A.M.É</Typography> */}
                            </Box>
                            <Typography variant="h1" color="inherit" fontSize={32} fontWeight={500} >{labels[windowLang]["register"]}</Typography>
                            <Typography variant="body1" color="inherit">{labels[windowLang]["welcome-register"]}</Typography>
                            <Typography variant="body1" color="inherit">{labels[windowLang]["welcome-register1"]}</Typography>
                        </Box>
                        <Stack component={"form"} padding={2} gap={1} onSubmit={handleSubmit} noValidate>
                            <Stack direction={"row"} justifyContent={"space-between"} alignItems={"stretch"} gap={1} >
                                <InputField label={labels[windowLang]['username']} required name={"username"} id={"username"} type={"text"} error={error.username} />
                                <CustomToggleButton />
                            </Stack>
                            <InputField label={labels[windowLang]['email']} name={"email"} required id={"email"} type={"email"} autoCorrect={"false"} error={error.email} />
                            <InputField label={labels[windowLang]['description']} name={"description"} id={"description"} type={"text"} error={error.description} multiline rows={5} />
                            <InputField label={labels[windowLang]['password']} name={"password"} required id={"password"} type={"password"} error={error.password} />
                            <InputField label={labels[windowLang]['cpassword']} required name={"confirmPassword"} id={"confirmPassword"} type={"password"} error={error.confirmPassword} />
                            <Stack direction={"row"} gap={2} >
                                <Button variant='outlined' component={RouterLink} to={"/login"} >{labels[windowLang]['login']}</Button>
                                <Button type={"submit"} variant='contained' sx={{ flex: 1 }} >{labels[windowLang]['register']}</Button>
                            </Stack>
                        </Stack>
                    </Box>
                </Box>
            </ThemeProvider>
        </>
    )
}

function validateForm(formElements, error) {
    for (const formElment of formElements) {
        // console.log(formElment);
        if (!formElment.checkValidity()) {
            error[formElment.name] = formElment.validationMessage;
        }
        else {
            delete error[formElment.name];
        }
    }
}

function validatePassword(passwords, error) {
    if (passwords[0].value !== passwords[1].value) {
        passwords[1].setCustomValidity(labels[windowLang]["valid-password-match"]);
        error.confirmPassword = passwords[1].validationMessage;
    }
    else {
        delete error.confirmPassword;
        passwords[1].setCustomValidity("");
    }
}

export function CustomToggleButton(props) {
    const [gender, setGender] = useState(props.value || 'male');
    const otherGender = Math.random() < 0.5 ? 'male' : 'female';
    //a variable that contains a random rumber between 0 and 5
    const randomNumber = useRef(Math.floor(Math.random() * 3));

    const gend = [<FireExtinguisher />, <Park />, <SportsRugby />, <PedalBike />];

    const handleGender = (event, newGender) => {
        setGender(newGender);
    }
    return (
        <>
            <StyledToggleButtonGroup
                value={gender}
                exclusive
                onChange={handleGender}
                aria-label="Gender"
                sx={{ flexGrow: 0 }}
            >
                <ToggleButton value="male" aria-label="male">
                    <Man />
                </ToggleButton>
                <ToggleButton value="female" aria-label="female">
                    <Woman />
                </ToggleButton>
                <Divider flexItem orientation="vertical" sx={{ fontSize: "12px", mx: 1 }}>or</Divider>
                <ToggleButton value="other" aria-label="other">
                    {gend[randomNumber.current]}
                </ToggleButton>
                <input type="number" hidden name='gender' value={genderToNumber(gender)} id='gender' />
            </StyledToggleButtonGroup>
        </>
    );
}

export function genderToNumber(gender) {
    switch (gender) {
        case 'male':
            return 1;
        case 'female':
            return 0;
        case 'other':
            return 2;
    }
}

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
    '& .MuiToggleButtonGroup-grouped': {
        '&.Mui-disabled': {
            border: 0,
        },
        '&.MuiToggleButton-root': {
            borderColor: theme.palette.divider
        },
        '&:last-of-type': {
            borderRadius: theme.shape.borderRadius,
        },
        '&:nth-of-type(2)': {
            borderRadius: theme.shape.borderRadius,
            borderTopLeftRadius: 0,
            borderLeftWidth: 0,
            borderBottomLeftRadius: 0,
        },
    },
}));

async function validateUsername(username, error) {
    if (username.value.length < 3) {
        username.setCustomValidity(labels[windowLang]["valid-user-length"]);
        error.username = username.validationMessage;
    }
    else {
        delete error.username;
        username.setCustomValidity("");
    }

    const db = getFirestore();
    const user = await getDoc(doc(db, "user", username.value))
    if (user.exists()) {
        username.setCustomValidity(labels[windowLang]["valid-user-exist"]);
        error.username = username.validationMessage;
    }
    else {
        delete error.username;
        username.setCustomValidity("");
    }
}
