import { Autocomplete, Box, Button, Chip, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material";
import { doc, getFirestore } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { NSFWToggleButton, Visibility } from "../Pages/Upload";
import { getCategories, getTags, updatePost } from "../firebase/utills";
import { capitalizeFirstLetter } from "../utils";

export default function PostForm({ data, setData, formRefa }) {
    const [newData, setNewData] = useState(data)
    const [postList, setPostList] = useOutletContext();
    const [tags, setTags] = useState([]);
    const [category, setCategory] = useState([]);
    const formRef = useRef();
    const [categoryVal, setCategoryVal] = useState(data?.category?.id);
    const [tagInput, setTagInput] = useState(data?.tags ? (data?.tags).map(item => decodeURI(item.id)) : []);
    const navigate = useNavigate();
    const handleChange = (event) => {
        setCategoryVal(event.target.value)
    }
    useEffect(() => {
        const fetchCategory = async () => {
            const temp = await getCategories();
            setCategory(temp)
        }
        const fetchTags = async () => {
            const temp = await getTags();
            setTags(temp)
        }
        fetchTags();
        fetchCategory();
    }, [])

    const handleSubmit = async () => {
        const formData = new FormData(formRef.current);
        const form = formRef.current;
        const post = {
            ...newData,
            visibility: formData.get('visibility'),
            category: doc(getFirestore(), "category", formData.get("category")),
            nsfw: form.nsfw.checked,
        }
        delete post.id
        const updatedPost = await updatePost(data.id, post, tagInput);
        setPostList((prev) => {
            const temp = [...prev];
            temp[postList.findIndex((item) => { return item.id === updatedPost.id })] = updatedPost;
            return temp;
        })
        navigate(-1);
    }

    return (
        <Stack direction={"column"} gap={2} marginY={4} px={4} component={"form"} ref={formRef} height={"100%"}>
            <Stack direction={"row"} gap={2}>
                <TextField autoFocus id="outlined-basic" label="Title" variant="outlined" fullWidth value={newData?.title} onChange={(e) => {
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
            <Stack direction={"row"} gap={2}>
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
            </Box>
        </Stack >
    )
}
