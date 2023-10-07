import { Alert, Autocomplete, Backdrop, Box, Button, Chip, CssBaseline, FormControl, InputLabel, LinearProgress, Link, MenuItem, Select, Snackbar, Stack, TextField, ToggleButton, ToggleButtonGroup, Tooltip, createFilterOptions } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { theme } from './Init';
import { collection, doc, getDocs, getFirestore, serverTimestamp, setDoc, writeBatch } from 'firebase/firestore';
import { MuiFileInput } from 'mui-file-input';
import { useLocation, useNavigate, useOutletContext, Link as RouterLink } from 'react-router-dom';
import { getAuth } from 'firebase/auth';

import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Css, PlaylistRemove, Public, PublicOff } from '@mui/icons-material';

const filter = createFilterOptions();
export default function Upload() {
    const [initData, setInitData] = useOutletContext();
    const navigate = useNavigate();
    const location = useLocation();
    const [tags, setTags] = useState([]);
    const [genre, setGenre] = useState([]);
    const [category, setCategory] = useState([]);
    const [value, setValue] = useState(null);
    const [loading, setLoading] = useState(false);
    const formRef = useRef();
    useEffect(() => {
        const loadTags = async () => {
            const temp = await getTags();
            setTags(temp)
        }

        const loadGenre = async () => {
            const temp = await getGenre();
            setGenre(temp)
        }
        const loadCategory = async () => {
            const temp = await getCategory();
            setCategory(temp)
        }
        setInitData((val) => {
            const temp = { ...val };
            temp.main.title = "upload";
            return temp;
        })
        loadCategory();
        // loadGenre();
        loadTags();
    }, []);

    const [categoryVal, setCategoryVal] = useState('');

    const handleChange = (event) => {
        setAge(event.target.value);
    };

    const [valuea, setValuea] = useState(null)

    const handleChangeF = (newValue) => {
        setValuea(newValue)
    }

    const [tagInput, setTagInput] = useState([]);
    const [uploadState, setUploadState] = useState();
    const [postRef, setPostRef] = useState(doc(collection(getFirestore(), "post")));
    const handleSubmit = async () => {
        setUploadState("uploading")
        setInitData((val) => {
            return { ...val, loading: { state: "loading", progress: 0 } }
        })
        const form = formRef.current;
        const formData = new FormData(form);
        const post = {
            title: formData.get("title"),
            desc: formData.get("desc"),
            category: formData.get("category"),
            nsfw: form.nsfw.checked,
            creationTime: serverTimestamp(),
            user: doc(getFirestore(), "user", getAuth().currentUser.uid),
            visibility: formData.get('visibility')
        }
        try {
            await uploadFile(valuea, postRef, getAuth().currentUser.uid, setInitData, post, tagInput)
        }
        catch (error) {
            console.error(error);
        }
        finally {
            setUploadState('finished')
            const tempInitData = { ...initData };
            delete tempInitData.loading
            setInitData(tempInitData);
        }
    }
    return (
        <>
            {/* <LinearProgress value={uploadingProgress} sx={{}} /> */}
            <Backdrop open={!!initData?.loading} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} />
            <Stack gap={1} ref={formRef} component={"form"} sx={{ height: "100%" }}>
                <Stack direction={"row"} gap={2} >
                    <TextField label={"Title"} type='text' sx={{ flex: 1 }} name='title' />
                    <Visibility />
                    <NSFWToggleButton />
                </Stack>
                <Stack direction={"row"} gap={2}>
                    <Box flex={"1 1 auto"} >
                        <Autocomplete
                            fullWidth
                            multiple
                            id="tags"
                            options={tags.map((option) => option.title)}
                            freeSolo
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
                    </Box>
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
                            {category.length > 0 && category.map((item, index) => <MenuItem key={index + "a"} value={item.title}>{item.title}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Stack>
                <TextField label={"Description"} multiline rows={4} type='text' name='desc' />
                <MuiFileInput getSizeText={(value) => `${((value?.size) / Math.pow(1024, 2)).toFixed(2)} MB`} inputProps={{ accept: 'audio/*' }} value={valuea} onChange={handleChangeF} color='info' name='file' />
                <Box sx={{ mt: "auto", height: "100%", display: "flex", alignItems: "self-end", justifyContent: "flex-end" }} >
                    <Button variant='contained' onClick={handleSubmit} disabled={initData.loading} >
                        Upload
                    </Button>
                </Box>
            </Stack >
            <Snackbar open={uploadState === 'finished'} autoHideDuration={6000} onClose={() => { setUploadState() }}>
                <Alert severity="success" sx={{ width: '100%' }}>
                    This is a success message!
                    <Button component={RouterLink} to={`/${postRef.path}`} underline='hover' color="inherit" >View post</Button>
                </Alert>
            </Snackbar>
        </>
    )
}

function NSFWToggleButton() {
    const [selected, setSelected] = useState(false);
    return (
        <>
            <ToggleButton
                value="checked"
                selected={selected}
                onChange={() => {
                    setSelected(!selected);
                }}
                color='error'
            // sx={{ borderColor: "" }}
            >
                NSFW
            </ToggleButton>
            <input type="checkbox" name='nsfw' checked={selected} hidden readOnly />
        </>
    )
}

async function getTags() {
    const tags = []
    const db = getFirestore();
    const docs = await getDocs(collection(db, "tag"));
    docs.size > 0 && docs.forEach((doc) => {
        tags.push({ ...doc.data(), id: doc.id })
    });
    return tags;
}

async function getGenre() {
    const tags = []
    const db = getFirestore();
    const docs = await getDocs(collection(db, "genre"));
    docs.size > 0 && docs.forEach((doc) => {
        tags.push({ ...doc.data() })
    });
    return tags;
}
async function getCategory() {
    const tags = []
    const db = getFirestore();
    const docs = await getDocs(collection(db, "category"));
    docs.size > 0 && docs.forEach((doc) => {
        tags.push({ ...doc.data() })
    });
    return tags;
}

async function uploadFile(file, postRef, userId, uploadingProgress, post, tags) {

    // Upload file and metadata to the object 'images/mountains.jpg'
    const storageRef = ref(getStorage(), `audio/${userId}/${postRef.id}/` + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);
    // Listen for state changes, errors, and completion of the upload.
    //create a promise function with the uploadTask.on of firebase

    uploadTask.on('state_changed',
        (snapshot) => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            uploadingProgress((val) => {
                return { ...val, loading: { state: "loading", progress: progress } }
            })
            // console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
                case 'paused':
                    // console.log('Upload is paused');
                    break;
                case 'running':
                    // console.log('Upload is running');
                    break;
            }
        },
        (error) => {
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch (error.code) {
                case 'storage/unauthorized':
                    // User doesn't have permission to access the object
                    break;
                case 'storage/canceled':
                    // User canceled the upload
                    break;

                // ...

                case 'storage/unknown':
                    // Unknown error occurred, inspect error.serverResponse
                    break;
            }
        },
        async () => {
            uploadingProgress((val) => {
                return { ...val, loading: { state: "loading" } }
            })
            // Upload completed successfully, now we can get the download URL
            const url = (uploadTask.snapshot.ref).toString();
            const tagsRef = createTagsReference(tags);
            const categoryRef = getCategoryRef(post.category)
            post.category = categoryRef;
            await uploadPost(post, postRef, url, tagsRef);
            uploadingProgress((val) => {
                const temp = { ...val };
                delete temp.loading;
                return temp;
            })
        }
    );
}

function createTagsReference(tags) {
    const tagRefs = [];
    for (const tag of tags) {
        const tagRef = doc(getFirestore(), 'tag', encodeURIComponent(tag));
        tagRefs.push(tagRef);
    }
    return tagRefs
}

function getGenreRef(genre) {
    const genreRef = doc(getFirestore(), 'genre', genre)
    return genreRef;
}
function getCategoryRef(category) {
    const categoryRef = doc(getFirestore(), 'category', category)
    return categoryRef;
}

async function uploadPost(post, postRef, filePath, tags) {
    const tempPost = { ...post, tags: tags, filePath: filePath }
    const batch = writeBatch(getFirestore());
    batch.set(postRef, tempPost);
    tags.forEach((tag) => {
        batch.set(tag, { title: (tag.path).substring((tag.path).lastIndexOf("/") + 1), urlPath: encodeURIComponent((tag.path).substring((tag.path).lastIndexOf("/") + 1)) });
    });
    await batch.commit();
}

function Visibility() {
    const [visibility, setVisibility] = useState('public');

    const handleChange = (event, newVisibility) => {
        setVisibility(newVisibility);

    };
    return (
        <>
            <input type="text" value={visibility} hidden name='visibility' readOnly />
            <ToggleButtonGroup
                color="primary"
                value={visibility}
                exclusive
                onChange={handleChange}
                aria-label="Platform"
                name="visibility"
            >
                <ToggleButton value="public">
                    <Tooltip disableFocusListener title='Everyone can watch'>
                        <Public />
                    </Tooltip>
                </ToggleButton>
                <ToggleButton value="private">
                    <Tooltip disableFocusListener title="No one can watch">
                        <PublicOff />
                    </Tooltip>
                </ToggleButton>
                <ToggleButton value="unlisted">
                    <Tooltip disableFocusListener title="Just the one with link" >
                        <PlaylistRemove />
                    </Tooltip>
                </ToggleButton>
            </ToggleButtonGroup>
        </>
    )
}
