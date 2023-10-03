import { useState } from 'react';
import { Stack, FormControl, FormLabel, FormHelperText, TextField, Box, Typography, Button, Tabs, Tab } from '@mui/material';
import React, { useEffect } from 'react'
import { Outlet, matchPath, useLocation, useOutletContext } from 'react-router-dom'
import { InputField } from './Login';
import { CustomToggleButton, genderToNumber } from './Register';
import { genderToText } from '../utils';
import UserAvatar from '../components/UserAvatar';
import InputFileField from '../components/InputFileField';
import { postProfileImage, updateUser } from '../firebase/utills';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import TabsRouter from '../components/CustomTabs';

export default function Settings() {
    const [initData, setInitData] = useOutletContext();
    const [value, setValue] = useState(0);
    const routeMatch = useRouteMatch(['/settings', '/settings/profile', '/settings/preferences']);
    const currentTab = routeMatch?.pattern?.path;

    function useRouteMatch(patterns) {
        const { pathname } = useLocation();

        for (let i = 0; i < patterns.length; i += 1) {
            const pattern = patterns[i];
            const possibleMatch = matchPath(pattern, pathname);
            if (possibleMatch !== null) {
                return possibleMatch;
            }
        }

        return null;
    }

    const handleChange = (event, newValue) => {
        // event.type can be equal to focus with selectionFollowsFocus.
        if (
            event.type !== 'click' ||
            (event.type === 'click' && samePageLinkNavigation(event))
        ) {
            setValue(newValue);
        }
    };
    return (
        <>
            <TabsRouter context={[initData, setInitData]} />
            {/* <Tabs value={value} onChange={handleChange} aria-label="nav tabs example">
                <LinkTab label="Preferences" href="preferences" value="/settings/preferences" />
                <LinkTab label="Edit profile" href="profile" value="/settings/profile" />
            </Tabs>
            <Outlet /> */}
        </>
    )
}

function LinkTab(props) {
    return (
        <Tab
            component={RouterLink}
            to={props.href}
            {...props}
        />
    );
}