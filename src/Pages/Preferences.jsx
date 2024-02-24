import { Divider, FormControl, MenuItem, Select, Stack, Switch, Typography, createTheme } from '@mui/material'
import React, { useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { isDarkModeEnabled, paletteTemp } from '../Pages/Init'
import { labels, windowLang } from '../utils'

export default function Preferences() {
    const [initData, setInitData] = useOutletContext()
    useEffect(
        () => {
            const temp = { ...initData }
            const main = { title: labels[windowLang]['preferences'] }
            setInitData({ ...temp, main })
        }
        , []
    )
    return (
        <Stack direction={'column'} gap={2} >
            <Stack direction={'row'}>
                <Stack direction={'column'} sx={{ width: "100%" }} >
                    <Typography variant="body1">{labels[windowLang]['nsfw']}</Typography>
                    <Typography variant="caption">{labels[windowLang]['nsfw-sub']}</Typography>
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
                <Stack direction={'column'} sx={{ width: "100%" }} flex={"1 1 auto"} >
                    <Typography variant="body1">{labels[windowLang]['theme']}</Typography>
                    <Typography variant="caption">{labels[windowLang]['theme-sub']}</Typography>
                </Stack>
                <FormControl sx={{ flexGrow: 0, flex: "none" }}>
                    {/* <InputLabel id="demo-simple-select-label">Theme</InputLabel> */}
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={initData?.preferences?.selectedTheme || 'default'}
                        // label="Theme"
                        sx={{ width: 'fit-content', textTransform: 'capitalize' }}
                        onChange={(event) => {
                            const temp = { ...initData }
                            const preferences = { ...temp?.preferences }
                            preferences.selectedTheme = event.target.value === 'default' ? "default" : event.target.value;
                            // console.log({ ...paletteTemp.palette, mode });
                            preferences.theme = createTheme({ palette: { ...paletteTemp.palette, mode: preferences.selectedTheme === "default" ? isDarkModeEnabled() ? "dark" : "light" : preferences.selectedTheme } })
                            // console.log(preferences);
                            setInitData({ ...temp, preferences })
                        }}
                    >
                        <MenuItem value={labels[windowLang]['theme-selector-options']['automatic']['val']} sx={{ textTransform: 'capitalize' }}>{labels[windowLang]['theme-selector-options']['automatic']['label']}</MenuItem>
                        <MenuItem value={labels[windowLang]['theme-selector-options']['light']['val']} sx={{ textTransform: 'capitalize' }}>{labels[windowLang]['theme-selector-options']['light']['label']}</MenuItem>
                        <MenuItem value={labels[windowLang]['theme-selector-options']['dark']['val']} sx={{ textTransform: 'capitalize' }}>{labels[windowLang]['theme-selector-options']['dark']['label']}</MenuItem>
                    </Select>
                </FormControl>
            </Stack>
        </Stack >
    )
}
