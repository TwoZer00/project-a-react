import { Alert, Autocomplete, Backdrop, Box, Button, Chip, FormControl, InputLabel, MenuItem, Select, Snackbar, Stack, TextField, ToggleButton, ToggleButtonGroup, Tooltip, Typography, createFilterOptions } from '@mui/material';
import { collection, doc, getDocs, getFirestore, serverTimestamp, writeBatch } from 'firebase/firestore';
import { MuiFileInput } from 'mui-file-input';
import React, { useEffect, useRef, useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate, useOutletContext } from 'react-router-dom';

import { PlaylistRemove, Public, PublicOff } from '@mui/icons-material';
import { getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { CustomError } from '../Errors/CustomError';
import { getLoggedUserRef } from '../firebase/utills';
import { InputField } from './Login';

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
        loadTags();
    }, []);

    const [categoryVal, setCategoryVal] = useState('');

    const handleChange = (event) => {
        setCategoryVal(event.target.value);
    };

    const [valuea, setValuea] = useState(null)

    const handleChangeF = (newValue) => {
        setValuea(newValue)
    }

    useEffect(() => {
        if (!initData?.user) {
            navigate('/login', { state: { from: location } })
        }
    }, [initData?.user])

    const [tagInput, setTagInput] = useState([]);
    const [uploadState, setUploadState] = useState([]);
    const [error, setError] = useState({})
    const [postRef, setPostRef] = useState(doc(collection(getFirestore(), "post")));
    const handleSubmit = async () => {
        setUploadState("uploading")
        setInitData((val) => {
            return { ...val, loading: { state: "loading", progress: 0 } }
        })
        const form = formRef.current;
        const formData = new FormData(form);
        try {
            if (!valuea) {
                form.file.setCustomValidity("no file");
            }
            else {
                form.file.setCustomValidity("");
            }
            if (!form.checkValidity()) {
                let errors = { ...error }
                Array.from(form.querySelectorAll("input")).forEach((item) => {
                    const err = {};
                    err[item.name] = { message: `${item.validationMessage}` }
                    if (!item.checkValidity()) {
                        errors = { ...errors, ...err }
                    }
                    else {
                        delete errors[item.name];
                    }
                })
                setError(errors)
                throw new CustomError("input fields required are empty")
            }
            else {
                setError({})
            }
            const post = {
                title: formData.get("title"),
                desc: formData.get("desc"),
                category: formData.get("category"),
                nsfw: form.nsfw.checked,
                creationTime: serverTimestamp(),
                user: getLoggedUserRef(),
                visibility: formData.get('visibility'),
                indexed: true,
                plays: 0
            }
            await uploadFile(valuea, postRef, getLoggedUserRef().id, setInitData, post, tagInput)
            setPostRef(doc(collection(getFirestore(), "post")))
        }
        catch (error) {
            setUploadState(['finished', 'error', error.message])
            setInitData(prev => {
                const temp = { ...prev }
                temp.notification = { type: "error", msg: error.message }
                return temp;
            })
        }
        finally {
            const tempInitData = { ...initData };
            delete tempInitData.loading
            setInitData(tempInitData);
        }
    }
    return (
        <>
            <Backdrop open={!!initData?.loading} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} />
            <Stack gap={1} ref={formRef} component={"form"} sx={{ height: "100%" }}>
                <Stack direction={"row"} gap={2} >
                    <InputField label={"title"} type={"text"} name={"title"} error={!!error.title} required />
                    <Visibility />
                    <NSFWToggleButton />
                </Stack>
                <Stack direction={"row"} gap={2}>
                    <Box flex={"1 1 auto"} >
                        <Autocomplete
                            fullWidth
                            multiple
                            id="tags"
                            options={tags.map((option) => decodeURI(option.title))}
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
                        <InputLabel id="demo-simple-select-label" error={!!error.category}>Category</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Category"
                            value={categoryVal}
                            name='category'
                            required
                            error={!!error.category}
                            onChange={handleChange}
                        >
                            {category.length > 0 && category.map((item, index) => <MenuItem key={index + "a"} value={item.title}>{item.title}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Stack>
                <TextField label={"Description"} multiline rows={4} type='text' name='desc' />
                <MuiFileInput error={!!error.file} getSizeText={(value) => `${((value?.size) / Math.pow(1024, 2)).toFixed(2)} MB`} inputProps={{ accept: 'audio/*' }} value={valuea} onChange={handleChangeF} color='info' name='file' />
                <Box sx={{ mt: "auto", height: "100%", display: "flex", alignItems: "self-end", justifyContent: "flex-end" }} >
                    <Button variant='contained' onClick={handleSubmit} disabled={initData.loading} >
                        Upload
                    </Button>
                </Box>
            </Stack >
            <Snackbar open={uploadState[0] === 'finished'} autoHideDuration={6000} onClose={() => { setUploadState([]) }}>
                <Alert severity={uploadState[1]} sx={{ width: '100%' }}>
                    <Stack direction={"row"} alignItems={"center"}>
                        <Typography variant="subtitle1" sx={{ ":first-letter": { textTransform: "uppercase" } }}>{uploadState[2]}</Typography>
                        {uploadState[1] === 'success' && <Button component={RouterLink} to={`/${postRef.path}`} underline='hover' color="inherit" >View post</Button>}
                    </Stack>
                </Alert>
            </Snackbar>
        </>
    )
}


export function NSFWToggleButton({ val }) {
    const [selected, setSelected] = useState(val || false);
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
    if (!userId) throw new CustomError("No user found")
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
                return { ...val, loading: true }
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
                temp.notification = { type: "success", msg: "Post uploaded!" }
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
        const temp = {
            title: decodeURI(tag.id),
            urlPath: tag.path
        }
        batch.set(tag, temp);
    });
    await batch.commit();
}

export function Visibility({ val }) {
    const [visibility, setVisibility] = useState(val || 'public');

    const handleChange = (event, newVisibility) => {
        if (newVisibility !== null) {
            setVisibility(newVisibility);
        }

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
