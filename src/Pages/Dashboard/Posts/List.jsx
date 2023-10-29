import { Delete, Edit, MoreVert } from '@mui/icons-material';
import { Chip, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Stack } from '@mui/material';
import { DataGrid, esES } from '@mui/x-data-grid';
import moment from 'moment';
import React, { useState } from 'react';
import { Outlet, useNavigate, useOutletContext } from 'react-router-dom';
import { labels, windowLang } from '../../../utils';

export default function PostListDashboard() {
    const [user, postList] = useOutletContext();
    const [posts, setPosts] = postList;
    const columns = [
        { field: 'id', headerName: labels[windowLang]['id'], flex: 1, maxWidth: 100 },
        { field: 'title', headerName: labels[windowLang]['title'], flex: 1 },
        { field: 'desc', headerName: labels[windowLang]['description'], flex: 1 },
        { field: 'visibility', headerName: labels[windowLang]['visibility'], flex: 1 },
        { field: 'category', headerName: labels[windowLang]['category'], valueFormatter: (params) => { return params.value.id } },
        { field: 'tags', headerName: labels[windowLang]['tags'], sorteable: false, renderCell: (params) => <Stack direction={"row"} gap={1} py={1} sx={{ overflowX: "scroll", }} >{params.value.map((item) => <Chip label={decodeURI(item.id)} />)}</Stack>, flex: 1 },
        { field: 'creationTime', headerName: labels[windowLang]["date"], flex: 1, valueFormatter: (params) => { return moment(params.value.seconds * 1000).format("DD/MM/YYYY") } }, ,
        { field: 'plays', headerName: labels[windowLang]["plays"], flex: 1, align: "right", type: 'number' },
        { field: "", headerName: null, flex: 1, renderCell: (params) => <MoreIconButton id={params.row.id} />, type: 'actions' },
    ]
    return (
        <>
            <DataGrid rows={posts || []} columns={columns} sx={{ border: "none" }} autoHeight={true} style={{ height: "100%", width: "100%" }} localeText={windowLang === "es" ? esES.components.MuiDataGrid.defaultProps.localeText : undefined} />
            <Outlet context={[...postList]} />
        </>
    )
}

function MoreIconButton({ id }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleEdit = () => {
        navigate(`/dashboard/post/${id}`);
    }
    return (
        <>
            <IconButton
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                disableRipple>
                <MoreVert />
            </IconButton>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <MenuItem onClick={handleEdit}>
                    <ListItemIcon>
                        <Edit />
                    </ListItemIcon>
                    <ListItemText>Edit</ListItemText>
                </MenuItem>
                <MenuItem>
                    <ListItemIcon>
                        <Delete />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                </MenuItem>
            </Menu>
        </>
    )
}
