import { Divider, FormControl, InputLabel, MenuItem, Select, Stack, Switch, Typography, createTheme } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { isDarkModeEnabled, paletteTemp } from '../Pages/Init'

export default function Preferences() {
    const [initData, setInitData] = useOutletContext()
    useEffect(
        () => {
            const temp = { ...initData }
            const main = { title: 'Preferences' }
            setInitData({ ...temp, main })
        }
        , []
    )
    return (
        <Stack direction={'column'} gap={2} >
            <Stack direction={'row'} >
                <Stack direction={'column'} sx={{ width: "100%" }} >
                    <Typography variant="body1">NSFW</Typography>
                    <Typography variant="caption">Show NSFW post(must be considered of legal age in your place of residence)</Typography>
                </Stack>
                <Switch
                    checked={!!initData?.preferences?.nsfw}
                    onChange={(event) => {
                        const nsfw = event.target.checked;
                        const temp = { ...initData }
                        const preferences = { ...temp.preferences, nsfw }
                        setInitData({ ...temp, preferences })
                    }}
                    inputProps={{ 'aria-label': 'controlled' }}
                />
            </Stack >
            <Divider />
            <Stack direction={'row'}>
                <Stack direction={'column'} sx={{ width: "100%" }} >
                    <Typography variant="body1">Theme</Typography>
                    <Typography variant="caption">Set theme of app(setted as navigator by default)</Typography>
                </Stack>
                <FormControl sx={{ flexGrow: 0 }} >
                    {/* <InputLabel id="demo-simple-select-label">Theme</InputLabel> */}
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={initData?.preferences?.selectedTheme || 'default'}
                        // label="Theme"
                        sx={{ width: 'fit-content' }}
                        onChange={(event) => {
                            const temp = { ...initData }
                            const preferences = { ...temp?.preferences }
                            preferences.selectedTheme = event.target.value === 'default' ? "default" : event.target.value;
                            // console.log({ ...paletteTemp.palette, mode });
                            preferences.theme = createTheme({ palette: { ...paletteTemp.palette, mode: preferences.selectedTheme === "default" ? isDarkModeEnabled() ? "dark" : "light" : preferences.selectedTheme } })
                            console.log(preferences);
                            setInitData({ ...temp, preferences })
                        }}
                    >
                        <MenuItem value={"default"}>Automatic</MenuItem>
                        <MenuItem value={"light"}>Light</MenuItem>
                        <MenuItem value={"dark"}>Dark</MenuItem>
                    </Select>
                </FormControl>
            </Stack>

        </Stack >
    )
}
