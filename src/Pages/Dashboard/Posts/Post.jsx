import { Close } from '@mui/icons-material';
import { AppBar, Dialog, IconButton, Slide, Toolbar, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PostForm from '../../../components/PostForm';
import { getPostData } from '../../../firebase/utills';

export default function DashboardPost() {
    const { id } = useParams();
    const [post, setPost] = useState()
    const [newData, setNewData] = useState()
    const formRef = useRef();
    const navigate = useNavigate();
    const handleClose = () => {
        navigate(-1);
    }
    const Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide direction="up" ref={ref} {...props} />;
    });
    useEffect(() => {
        const fetchData = async () => {
            const temp = await getPostData(id);
            setPost(temp);
        }
        if (id) {
            fetchData();
        }
    }, [])
    return (
        <>
            <Dialog
                fullScreen
                open={!!id}
                onClose={handleClose}
                TransitionComponent={Transition}
                keepMounted
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
                <PostForm data={post} setData={setPost} formRefa={formRef} postList />
            </Dialog>
        </>
    )
}
