import { ThemeProvider } from '@emotion/react'
import { Box, Button, CssBaseline, FormControl, FormHelperText, IconButton, Input, InputAdornment, InputLabel, LinearProgress, OutlinedInput, Paper, Stack, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { theme } from './Init'
import PropTypes from 'prop-types';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';

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
        // setError(tempE);
        if (Object.keys({ ...tempE.email, ...tempE.password }).length === 0) {
            try {
                await signInWithEmailAndPassword(getAuth(), data.email, data.password);
                // console.log(location.state?.from?.pathname);
                location.state?.from?.pathname ? navigate(location.state.from.pathname, { replace: true }) : navigate("/user");
            } catch (error) {
                console.error(error);
                tempE.signin = error.message;
            }
        }
        else {
            tempE.signin = "Please fill all the fields";
        }
        setError(tempE);
        setLoading(false)
    }
    return (
        <>
            <ThemeProvider theme={theme} >
                <Stack height={"100vh"} >
                    {loading && <LinearProgress />}
                    <CssBaseline />
                    <Box width={"100vw"} height={"100%"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                        <Stack component={Paper} variant='outlined' direction={"column"}>
                            <Stack component={"form"} variant='outlined' padding={2} gap={2} onSubmit={handleSubmit} noValidate >
                                <InputField id='email' error={error?.email} label='Email' variant='outlined' required name='email' type='email' />
                                <InputField id='password' error={error?.password} label='Password' variant='outlined' required type='password' name='password' />
                                {/* <TextField id='email' label='Email' variant='outlined' required name='email' error={!!error.email} helperText={error.email} FormHelperTextProps={{ "error": !!error.email }} type='email' /> */}
                                {/* <TextField id='password' label='Password' variant='outlined' required type='password' name='password' /> */}
                                <Stack gap={2} direction={"row"} justifyContent={"space-between"} >
                                    <Button variant='outlined' color='secondary' type='reset' component={RouterLink} to={"/register"} sx={{ flex: 1 }}>Register</Button>
                                    <Button variant='contained' color='primary' type='submit' sx={{ flex: 1 }} >Login</Button>
                                </Stack>
                                {/* <Typography variant="subtitle2" color="error" textAlign={"center"} >{error}</Typography> */}
                                <Typography variant="subtitle2" color="error" textAlign={"center"} >{error.signin}</Typography>
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
        return (<FormControl variant="outlined">
            <InputLabel htmlFor={props.id} error={!!props.error}>{props.label}</InputLabel>
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
                required name={props.name}
                error={!!props.error}
                label={props.label}
            />
            <FormHelperText error={!!props.error} sx={{ maxWidth: 200, textAlign: "justify" }}>{props.error}</FormHelperText>
        </FormControl>)
    }
    else {
        return (
            <FormControl variant='outlined' fullWidth>
                <InputLabel htmlFor={props.id} error={!!props.error}>{props.label}</InputLabel>
                <OutlinedInput id={props.id} label={props.label} required name={props.name} type={props.type} error={!!props.error} {...props} />
                <FormHelperText error={!!props.error} sx={{ textAlign: "justify" }}>{props.error}</FormHelperText>
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
