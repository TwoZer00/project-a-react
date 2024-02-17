import { ThemeProvider } from '@emotion/react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Button, CssBaseline, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, LinearProgress, OutlinedInput, Paper, Stack, Typography } from '@mui/material';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { capitalizeFirstLetter, firebaseErrorsMessages, labels, windowLang } from '../utils';
import { theme } from './Init';

export default function Login() {
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const handleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault()
        const formElement = e.currentTarget;
        const formData = new FormData(formElement);
        const data = Object.fromEntries(formData);
        const tempE = { ...error }
        if (!formElement.email.checkValidity()) {
            const temp = { email: formElement.email.validationMessage };
            tempE.email = temp.email;
        }
        else {
            delete tempE.email;
        }
        if (!formElement.password.checkValidity()) {
            const temp = { password: formElement.password.validationMessage };
            tempE.password = temp.password;
        }
        else {
            delete tempE.password;
        }
        if (Object.keys({ ...tempE.email, ...tempE.password }).length === 0) {
            try {
                await signInWithEmailAndPassword(getAuth(), data.email, data.password);
                // console.log(location.state?.from?.pathname);
                location.state?.from?.pathname ? navigate(location.state.from.pathname, { replace: true }) : navigate("/user", { replace: true });
            } catch (error) {
                console.error(error);
                tempE.signin = error.code;
                setError(tempE);
            }
            finally {
                setLoading(false)
                // console.log(location.state);
            }
        }
        else {
            tempE.signin = "Please fill all the fields";
        }
    }
    return (
        <>
            <ThemeProvider theme={theme} >
                <Stack height={"100vh"} >
                    {loading && <LinearProgress />}
                    <CssBaseline />
                    <Box width={"100vw"} height={"100%"} display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"}>
                        <Stack component={Paper} variant='outlined' direction={"column"} width={"100%"} maxWidth={400} >
                            <Box display={"flex"} flexDirection={"column"} alignItems={"center"} paddingBottom={2}>
                                <Box display={"flex"} flexDirection={"column"} alignItems={"center"} marginY={1}>
                                    <img src="./aproject.svg" alt="aproject logo" width={70} />
                                    {/* <Typography variant="h2" color="inherit" fontSize={22} marginTop={1} fontWeight={400}>A.M.É</Typography> */}
                                </Box>
                                <Typography variant="h1" color="inherit" fontSize={32} fontWeight={500} >{labels[windowLang]["login"]}</Typography>
                                <Typography variant="body1" color="inherit">{labels[windowLang]["welcome-login"]}</Typography>
                                <Typography variant="body1" color="inherit">{labels[windowLang]["welcome-login1"]}</Typography>
                            </Box>
                            <Stack component={"form"} variant='outlined' paddingX={2} gap={2} onSubmit={handleSubmit} noValidate width={"100%"} >
                                <InputField id='email' required error={error?.email} label={labels[windowLang]['email']} variant='outlined' name='email' type='email' />
                                <InputField id='password' required error={error?.password} label={labels[windowLang]['password']} variant='outlined' type='password' name='password' />
                                {/* <TextField id='email' label='Email' variant='outlined' required name='email' error={!!error.email} helperText={error.email} FormHelperTextProps={{ "error": !!error.email }} type='email' /> */}
                                {/* <TextField id='password' label='Password' variant='outlined' required type='password' name='password' /> */}
                                <Stack gap={2} direction={"row"} justifyContent={"space-between"} >
                                    <Button variant='outlined' color='secondary' type='reset' component={RouterLink} to={"/register"} sx={{ flex: 1 }}>{labels[windowLang]['register']}</Button>
                                    <Button variant='contained' color='primary' type='submit' sx={{ flex: 1 }}>{labels[windowLang]['login']}</Button>
                                </Stack>
                                {/* <Typography variant="subtitle2" color="error" textAlign={"center"} >{error}</Typography> */}
                                <Typography variant="subtitle2" color="error" textAlign={"center"} >{firebaseErrorsMessages[windowLang][error.signin]}</Typography>
                            </Stack>
                        </Stack>
                    </Box>
                </Stack >
            </ThemeProvider >
        </>
    )
}

export function InputField(props) {
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    if (props.type === "password") {
        return (<FormControl variant="outlined" >
            <InputLabel htmlFor={props.id} error={!!props.error}>{capitalizeFirstLetter(props.label)}</InputLabel>
            <OutlinedInput
                id={props.id}
                type={showPassword ? 'text' : 'password'}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                }
                required={props.required}
                name={props.name}
                error={!!props.error}
                label={capitalizeFirstLetter(props.label)}
            />
            {!!props.error && <FormHelperText error={!!props.error} sx={{ maxWidth: 200, textAlign: "justify" }}>{props.error}</FormHelperText>}
        </FormControl>)
    }
    else {
        return (
            <FormControl variant='outlined' fullWidth>
                <InputLabel htmlFor={props.id} error={!!props.error}>{capitalizeFirstLetter(props.label)}</InputLabel>
                <OutlinedInput id={props.id} label={capitalizeFirstLetter(props.label)} required={props.required} name={props.name} type={props.type} error={!!props.error} {...props} />
                {!!props.error?.message && <FormHelperText error={!!props.error} sx={{ textAlign: "justify" }}>{props.error.message || props.error}</FormHelperText>}
            </FormControl>
        )
    }
}
InputField.propTypes = {
    id: PropTypes.string,
    label: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
    error: PropTypes.string
}
