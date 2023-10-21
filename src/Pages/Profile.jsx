import { getDownloadURL, getStorage, ref } from '@firebase/storage';
import { Person, Person2, Person4 } from '@mui/icons-material';
import { Box, Grid, Stack, Tab, Tabs, Typography } from '@mui/material';
import { getAuth } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, getFirestore, query, where } from 'firebase/firestore';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useOutletContext, useParams } from 'react-router-dom';
import PostCard from '../components/PostCard';
import UserAvatar from '../components/UserAvatar';

export default function Profile() {
    const { id } = useParams();
    const [userData, setUserData] = useState();
    const [initData, setInitData] = useOutletContext();
    useEffect(() => {
        const temp = { ...initData }
        const loadUserData = async (userId) => {
            const data = await fetchUserData(userId);
            let profileURL = ""
            try {
                profileURL = await getProfileImgUrl(data.profileImg);
            }
            catch (e) {
                console.error(e);
            }
            // const temp = { ...data, photoURL: profileURL };
            setUserData(data);
            temp.main = { title: `${data.username}'s profile` };
            setInitData(temp);
        }
        if (id) {
            loadUserData(id)
        }
        else if (!id && getAuth().currentUser) {
            loadUserData(getAuth().currentUser.uid);
        }
    }, [])

    // useEffect(() => {
    //     const loadUserData = async (userId) => {
    //         const data = await fetchUserData(userId);
    //         let profileURL = ""
    //         try {
    //             profileURL = await getProfileImgUrl(data.profileImg);
    //         }
    //         catch (e) {
    //             if (e.code !== "storage/object-not-found") {
    //                 console.error(e.code);
    //             }
    //         }
    //         // const temp = { ...data, photoURL: profileURL };
    //         setUserData(data);
    //     }
    //     if (getAuth().currentUser?.uid) {
    //         loadUserData(getAuth().currentUser.uid);
    //     }
    // }, [getAuth().currentUser])

    const handleGender = (gender, fs) => {
        let genderIcon = <Person4 sx={{ fontSize: fs }} />
        switch (parseInt(gender)) {
            case 0:
                genderIcon = <Person2 sx={{ fontSize: fs }} />
                return genderIcon;
            case 1:
                genderIcon = <Person sx={{ fontSize: fs }} />
                return genderIcon;
            default:
                return genderIcon;
        }
    }
    return (
        <>
            <Box>
                <Box sx={{
                    width: "100%",
                    height: "250px",
                    borderRadius: 2,
                    backgroundColor: "primary.main",
                    position: "relative",
                    display: "flex",
                    justifyContent: "start",
                    alignItems: "flex-end",
                    padding: 1,
                    color: "white"
                }}>
                    <Stack direction="row" spacing={2} alignItems={"flex-end"}>
                        {<UserAvatar url={userData?.avatarURL} username={userData?.username} width={100} height={100} />}
                        <Stack direction={"column"}>
                            <Typography variant="h1" fontSize={24} fontWeight={400}>{userData?.username}</Typography>
                            <Stack direction={"row"} spacing={1} alignItems={"center"}>
                                <Typography variant="subtitle">{handleGender(userData?.gender, 14)}</Typography>
                                <Typography variant="subtitle" fontSize={12}>User since {moment(new Date(userData?.creationTime.seconds ? userData?.creationTime.seconds * 1000 : userData?.creationTime)).format("MMMM Do YYYY")}</Typography>
                            </Stack>
                            <Typography variant="subtitle" fontSize={12} sx={{ ":first-letter": { textTransform: "capitalize" } }} >{userData?.description}</Typography>
                        </Stack>
                    </Stack>
                </Box>
                <Typography variant="subtitle">{userData?.desc}</Typography>
                <Grid container py={2} spacing={2}>
                    {/* <CustomTabs /> */}
                    {/* <BasicTabs /> */}
                    <PostList userId={id || getAuth().currentUser?.uid} />
                </Grid>
            </Box>
        </>
    )
}

async function fetchUserData(userId) {
    let userData = undefined;
    const db = getFirestore();
    // const userRef = collection(db, 'users');
    const docSnap = await getDoc(doc(db, 'user', userId));
    if (docSnap.exists()) {
        userData = { ...docSnap.data(), id: docSnap.id }
    }
    // console.log(userData, userId);
    return userData;
}

async function getProfileImgUrl(id) {
    const storage = getStorage();
    const storageRef = ref(storage, `userPhotos/${id}/profileImage.jpg`);
    let profileImgUrl = ""
    try {
        if (id) {
            profileImgUrl = await getDownloadURL(storageRef);
        }
    } catch (error) {
        console.log(error.code);
    }
    return profileImgUrl;
}

function CustomTabs() {
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Tabs value={value} onChange={handleChange} aria-label="nav tabs example">
            <LinkTab label="Page One" href="post" />
            <LinkTab label="Page Two" href="/trash" />
            <LinkTab label="Page Three" href="/spam" />
        </Tabs>
    )
}

function LinkTab(props) {
    return (
        <Tab
            component={RouterLink}
            onClick={(event) => {
                // event.preventDefault();
            }}
            to={props.href}
            {...props}
        />
    );
}

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function BasicTabs() {
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Item One" {...a11yProps(0)} />
                    <Tab label="Item Two" {...a11yProps(1)} />
                    <Tab label="Item Three" {...a11yProps(2)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                Item One
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                Item Two
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                Item Three
            </CustomTabPanel>
        </Box>
    );
}

function PostList({ userId }) {
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        const loadPosts = async () => {
            const posts = await getPosts(userId);
            setPosts(posts);
        }
        loadPosts();
    }, [])
    return (
        <>
            {
                posts.map((post) => <PostCard key={post.id} postData={post} />)
            }
        </>
    )
}

async function getPosts(userId) {
    const posts = [];
    const db = getFirestore();
    const userRef = doc(db, 'user', userId);
    const postsRef = collection(db, 'post');
    let q = query(postsRef, where('user', '==', userRef));
    if (userId !== getAuth().currentUser?.uid) {
        q = query(postsRef, where('user', '==', userRef), where('visibility', '==', "public"));
    }
    const postsArr = await getDocs(q);
    postsArr.forEach((doc) => {
        posts.push({ ...doc.data(), id: doc.id });
    })
    return posts;
}