import { Delete, Edit, MoreVert } from '@mui/icons-material';
import { Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Stack } from '@mui/material';
import { DataGrid, GridActionsCellItem, esES } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import React, { useRef, useState } from 'react';
import { Outlet, useNavigate, useOutletContext } from 'react-router-dom';
import { deletePost } from '../../../firebase/utills';
import { labels, windowLang } from '../../../utils';

export default function PostListDashboard() {
    const [[user, setUser], postList] = useOutletContext();
    const [posts, setPosts] = postList;
    const [dialogModal, setDialogModal] = useState(false);
    let idDelete = useRef()
    const navigate = useNavigate();
    const columns = [
        // { field: 'id', headerName: labels[windowLang]['id'] },
        { field: 'title', headerName: labels[windowLang]['title'], flex: 1 },
        { field: 'desc', headerName: labels[windowLang]['description'], flex: 1 },
        { field: 'visibility', headerName: labels[windowLang]['visibility'], flex: 1 },
        { field: 'category', headerName: labels[windowLang]['category'], flex: 1, valueFormatter: (params) => { return params.value.id } },
        { field: 'tags', headerName: labels[windowLang]['tags'], flex: 1, sorteable: false, renderCell: (params) => <Stack direction={"row"} gap={1} py={1} sx={{ overflowX: "hide", }} >{params?.value?.map((item) => <Chip key={item.id} label={decodeURI(item.id)} />)}</Stack> },
        { field: 'creationTime', headerName: labels[windowLang]["date"], flex: 1, type: "date", valueFormatter: (params) => { return dayjs(params.value.seconds * 1000).format("DD/MM/YYYY") } },
        { field: 'plays', headerName: labels[windowLang]["plays"], flex: 1, align: "right", type: 'number', valueFormatter: (params) => { return (params.value).toLocaleString(window.navigator.language, { style: "decimal", roundingPriority: "morePrecision", notation: "compact" }) } },
        {
            field: "actions", getActions: (params) => [
                <GridActionsCellItem
                    icon={<Delete />}
                    label="Delete"
                    showInMenu="true"
                    onClick={() => { handleDelete(params.id) }}
                />, <GridActionsCellItem
                    icon={<Edit />}
                    label="Edit"
                    showInMenu="true"
                    onClick={() => { navigate(params.id) }}
                />],
            type: 'actions',
            flex: .1
        },
    ]
    const handleDelete = (id) => {
        idDelete.current = id;
        setDialogModal(true);

    }
    const handleModalDialogClose = () => {
        setDialogModal(false);
    }
    return (
        <>
            <DataGrid rows={posts || []} columns={columns} sx={{ border: "none" }} autoHeight={true} style={{ height: "100%", width: "100%" }} localeText={windowLang === "es" ? esES.components.MuiDataGrid.defaultProps.localeText : undefined} />
            <Outlet context={[...postList]} />
            <Dialog
                open={dialogModal}
                onClose={handleModalDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Use Google's location service?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Let Google help apps determine location. This means sending anonymous
                        location data to Google, even when no apps are running.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleModalDialogClose}>Disagree</Button>
                    <Button onClick={async () => {
                        await deletePost(idDelete.current);
                        setPosts(posts.filter(post => post.id !== idDelete.current));
                        handleModalDialogClose();
                    }} autoFocus>
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

function MoreIconButton({ id }) {
    const [user, postList] = useOutletContext();
    const [posts, setPosts] = postList;
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [dialog, setDialog] = useState(false);
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
    const handleDelete = () => {
        console.log(dialog);
        setDialog(prev => !prev)
    }
    const handleDeleteClose = () => {
        setDialog(prev => !prev)
    }
    const handleDeleteAction = async () => {
        await deletePost(id);
        setPosts(posts.filter(post => post.id !== id));
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
                <MenuItem onClick={handleDelete} >
                    <ListItemIcon>
                        <Delete />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                </MenuItem>
            </Menu>
            {/* <Dialog
                open={dialog}
                onClose={handleDeleteClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Use Google's location service?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Let Google help apps determine location. This means sending anonymous
                        location data to Google, even when no apps are running.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteClose}>Disagree</Button>
                    <Button onClick={handleDeleteAction} autoFocus>
                        Agree
                    </Button>
                </DialogActions>
            </Dialog> */}
        </>
    )
}
