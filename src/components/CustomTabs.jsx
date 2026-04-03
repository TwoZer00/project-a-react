import * as React from 'react';
import Box from '@mui/material/Box';
import {
    Outlet,
} from 'react-router-dom';
import { Stack } from '@mui/material';

export default function TabsRouter({ context }) {
    return (
        <Stack direction={'column'} sx={{ width: '100%', height: '100%' }}>
            {/* <MyTabs /> */}
            <Outlet context={context} />
        </Stack>
    );
}