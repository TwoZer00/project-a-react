import { ContentCopy, Delete, Edit, } from '@mui/icons-material';
import { Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack } from '@mui/material';
import { DataGrid, GridActionsCellItem, esES } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { useRef, useState } from 'react';
import { Outlet, useNavigate, useOutletContext } from 'react-router-dom';
import { deletePost } from '../../../firebase/utills';
import { labels, windowLang } from '../../../utils';

export default function PostListDashboard() {
    const [[user, setUser], postList,setTitle] = useOutletContext();
    const [posts, setPosts] = postList;
    const [dialogModal, setDialogModal] = useState(false);
    let idDelete = useRef()
    const navigate = useNavigate();
    setTitle(labels[windowLang]['posts']);
    const columns = [
        { field: 'title', headerName: labels[windowLang]['title'], flex: 1 },
        { field: 'desc', headerName: labels[windowLang]['description'], flex: 1 },
        { field: 'visibility', headerName: labels[windowLang]['visibility'], flex: 1 },
        { field: 'category', headerName: labels[windowLang]['category'], flex: 1, valueFormatter: (params) => { return params.value.id } },
        { field: 'tags', headerName: labels[windowLang]['tags'], flex: 1, sorteable: false, renderCell: (params) => <Stack direction={"row"} gap={1} py={1} sx={{ overflowX: "auto", }} >{params?.value?.map((item) => <Chip key={item.id} label={decodeURI(item.id)} />)}</Stack> },
        { field: 'creationTime', headerName: labels[windowLang]["date"], flex: 1, type: "date", valueFormatter: (params) => { return dayjs(params.value.seconds * 1000).locale(windowLang).format("DD/MM/YYYY") } },
        { field: 'plays', headerName: labels[windowLang]["plays"], flex: 1, align: "right", type: 'number', valueFormatter: (params) => { return (params.value).toLocaleString(window.navigator.language, { style: "decimal", roundingPriority: "morePrecision", notation: "compact" }) } },
        {
            field: "actions", getActions: (params) => [
                <GridActionsCellItem
                    key={params.id}
                    icon={<Delete />}
                    label={labels[windowLang]["delete"]}
                    showInMenu="true"
                    onClick={() => { handleDelete(params.id) }}
                />, <GridActionsCellItem
                    key={params.id}
                    icon={<Edit />}
                    label={labels[windowLang]["edit"]}
                    showInMenu="true"
                    onClick={() => { navigate(params.id) }}
                />,
                <GridActionsCellItem
                    key={params.id}
                    icon={<ContentCopy />}
                    label={labels[windowLang]["get-id"]}
                    showInMenu="true"
                    onClick={() => { window.navigator.clipboard.writeText(params.id) }}
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
                    Are you sure you want to delete this post?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        This action cannot be undone.
                        <br />
                        Are you sure you want to continue?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleModalDialogClose}>
                        Go back
                    </Button>
                    <Button variant='contained' onClick={async () => {
                        await deletePost(idDelete.current);
                        setPosts(posts.filter(post => post.id !== idDelete.current));
                        handleModalDialogClose();
                    }} autoFocus>
                        Continue
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}