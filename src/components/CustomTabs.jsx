import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import {
    MemoryRouter,
    Route,
    Routes,
    Link,
    matchPath,
    useLocation,
    Outlet,
    useNavigate,
} from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';
import { Stack } from '@mui/material';
import { getAuth } from 'firebase/auth';
import { useEffect } from 'react';

function Router(props) {
    const { children } = props;
    if (typeof window === 'undefined') {
        return <StaticRouter location="/drafts">{children}</StaticRouter>;
    }

    return (
        <MemoryRouter initialEntries={['/drafts']} initialIndex={0}>
            {children}
        </MemoryRouter>
    );
}

Router.propTypes = {
    children: PropTypes.node,
};

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

function MyTabs() {
    // You need to provide the routes in descendant order.
    // This means that if you have nested routes like:
    // users, users/new, users/edit.
    // Then the order should be ['users/add', 'users/edit', 'users'].
    const routeMatch = useRouteMatch(['settings/preferences', 'settings/profile', 'settings']);
    const currentTab = routeMatch?.pattern?.path === 'settings' ? 'settings/preferences' : routeMatch?.pattern?.path;
    const navigate = useNavigate();
    useEffect(() => {
        if (!getAuth().currentUser && currentTab !== "settings/preferences") {
            navigate("..")
        }
    }, [getAuth().currentUser])
    return (
        <Tabs value={currentTab} centered>
            <Tab label="Preferences" value="settings/preferences" to="preferences" component={Link} />
            {/* <Tab label="Profile" value="settings/profile" to="profile" component={Link} /> */}
            {/* {getAuth().currentUser && <Tab label="Profile" value="settings/profile" to="profile" component={Link} />} */}
        </Tabs>
    );
}

export default function TabsRouter({ context }) {
    return (
        <Stack direction={'column'} sx={{ width: '100%', height: '100%' }}>
            {/* <MyTabs /> */}
            <Outlet context={context} />
        </Stack>
    );
}