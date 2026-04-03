import { Close, Edit } from '@mui/icons-material';
import { AppBar, Autocomplete, Dialog, FormControl, IconButton, InputLabel, Select, Slide, Stack, Toolbar, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PostForm from '../../../components/PostForm';
import { getPostData } from '../../../firebase/utills';
import PropTypes from 'prop-types';
import { InputField } from '../../Login';
import { NSFWToggleButton, Visibility } from '../../Upload';
import { labels, windowLang } from '../../../utils';

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
            } catch (error) {
                console.log(error);
            }
        }
        if (id) {
            fetchData();
            // try {
            // } catch (error) {
            //     console.log(error);
            // }
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

function EditPostForm({data}) {
    const [newData,setNewData] = useState(data);
    const formRef = useRef();
    const [error,setError] = useState({});
    const [tags, setTags] = useState([]);
    const [category, setCategory] = useState([]);
    const [categoryVal, setCategoryVal] = useState(data?.category?.id);
    const [tagInput, setTagInput] = useState(data?.tags ? (data?.tags).map(item => decodeURI(item.id)) : []);
    const handleChange = (event) => {
        setCategoryVal(event.target.value)
    }
    return <>
        <Stack direction={"column"} gap={2} marginY={4} px={4} component={"form"} ref={formRef} height={"100%"}>
            <Stack direction={"row"} gap={2}>
                <InputField type="text" name="title" label="title" autoFocus value={newData?.title} required error={!!error?.title} onChange={(e) => {
                    const value = (e.target.value);
                    setNewData(val => {
                        const temp = { ...val };
                        temp.title = value;
                        return temp;
                    })
                }} />
                <Visibility val={data?.visibility} />
                <NSFWToggleButton val={data?.nsfw} />
            </Stack>
             {/*<Stack direction={"row"} gap={2}>
                <Autocomplete
                    fullWidth
                    multiple
                    id="tags"
                    value={[...tagInput]}
                    freeSolo
                    options={tags.map((option) => decodeURI(option.title))}
                    renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                            <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                        ))
                    }
                    onChange={(event, value, reason) => {
                        setTagInput([...value])
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="outlined"
                            label="Tags"
                            placeholder="Tag"
                        />
                    )}
                />
                <FormControl sx={{ flex: "none", width: '15ch' }}>
                    <InputLabel id="demo-simple-select-label">Category</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Category"
                        value={categoryVal}
                        name='category'
                        onChange={handleChange}
                    >
                        {category.length > 0 && category.map((item, index) => <MenuItem key={item.title} value={item.title}>{capitalizeFirstLetter(item.title)}</MenuItem>)}
                    </Select>
                </FormControl>
            </Stack>
            
            <TextField label={"Description"} multiline rows={4} type='text' name='desc' value={newData?.desc}
                onChange={
                    (event) => {
                        setNewData((val) => {
                            const temp = { ...val }
                            temp.desc = event.target.value;
                            return temp;
                        })
                    }
                } />
            <Box flex={1} sx={{
                display: "flex", justifyContent: "end", alignItems: "flex-end"
            }}>
                <Button variant="contained" children={"save"} onClick={handleSubmit} sx={{ height: "fit-content" }} />
            </Box> */}
        </Stack >
    </>
}
EditPostForm.propTypes = {
    data: PropTypes.object.isRequired
}