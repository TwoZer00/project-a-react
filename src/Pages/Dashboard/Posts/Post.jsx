import { Close } from '@mui/icons-material';
import { AppBar, Dialog, IconButton, Slide, Toolbar, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PostForm from '../../../components/PostForm';
import { getPostData } from '../../../firebase/utills';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function DashboardPost() {
    const { id } = useParams();
    const [post, setPost] = useState()
    const [newData, setNewData] = useState()
    const [open, setOpen] = useState(true);
    const formRef = useRef();
    const navigate = useNavigate();
    const handleClose = () => {
        setOpen(false);
    };
    const handleExited = () => {
        navigate("../", { replace: true });
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getPostData(id);
                setPost(data);
            } catch (error) {}
        }
        if (id) {
            fetchData();
        }
    }, [])
    return (
        <>
            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
                TransitionProps={{ onExited: handleExited }}
            >
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <Close />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Edit Post
                        </Typography>
                    </Toolbar>
                </AppBar>
                {/* {post ? <EditPostForm data={post} /> : (<Typography variant="h2" >No post founded</Typography>) } */}
                <PostForm data={post} setData={setPost} formRefa={formRef} postList onClose={handleClose} />
            </Dialog>
        </>
    )
}