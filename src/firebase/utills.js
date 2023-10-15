import { doc, getFirestore, getDoc, query, where, orderBy, increment } from 'firebase/firestore';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { getDownloadURL } from 'firebase/storage';
import { updateDoc } from 'firebase/firestore';
import { getDocs } from 'firebase/firestore';
import { collection } from 'firebase/firestore';
export async function getPostData(id) {
    const db = getFirestore();
    const userRef = doc(db, "post", id);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
        return { ...userDoc.data(), id: userDoc.id };
    }
    else {
        return null;
    }
}
export async function getUserData(userRef) {
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
        return { ...userDoc.data(), id: userDoc.id };
    }
    else {
        return null;
    }
}
export async function getAudioUrl(path) {
    const storage = getStorage();
    const storageRef = ref(storage, path);
    // console.log(storageRef);
    const url = await getDownloadURL(storageRef);
    return url;
}
export async function postProfileImage(id, file) {
    const storage = getStorage();
    const storageRef = ref(storage, `images/${id}/avatarImage`);
    const url = (await uploadBytes(storageRef, file)).ref.toString();
    return url;
}
export async function updateUser(id, user) {
    const db = getFirestore();
    const userRef = doc(db, "user", id);
    try {
        await updateDoc(userRef, user);
        return user;
    } catch (error) {
        // console.log(error);
        return undefined;
    }
}
/**
 * 
 * @param {string} refpath bucket path of image "gs://*\.appspot.com/*\/avatarImage.jpg"
 * @returns {Promise<string>} Promise<string> url of the avatar image
 */
export async function getAvatarImage(refpath) {
    // console.log("Getting avatar image");
    const storage = getStorage();
    const storageRef = ref(storage, refpath);
    let url;
    try {
        url = await getDownloadURL(storageRef);
    } catch (error) {
        console.log(error);
    }
    // console.log("Avatar image fetched");
    return url;
}
export async function getPostFromTags(tags) {
    const db = getFirestore();
    const postsRef = collection(db, "post");
    const temp = tags.map(tag => { return doc(db, "tag", encodeURI(tag)) });
    const q = query(postsRef, where('visibility', '==', 'public'), where('tags', 'array-contains-any', temp), orderBy('creationTime', 'desc'));
    const postsSnapshot = await getDocs(q);
    const posts = postsSnapshot.docs.map(doc => { return { ...doc.data(), id: doc.id } });
    return posts;
}
export async function getPostFromGenre(genre) {
    const db = getFirestore();
    const postsRef = collection(db, "post");
    const genreRef = doc(db, "genre", genre);
    const q = query(postsRef, where('visibility', '==', 'public'), where('genre', '==', genreRef), orderBy('creationTime', 'desc'));
    const postsSnapshot = await getDocs(q);
    const posts = postsSnapshot.docs.map(doc => { return { ...doc.data(), id: doc.id } });
    return posts;
}
export async function getPostFromCategory(category) {
    const db = getFirestore();
    const postsRef = collection(db, "post");
    const categoryRef = doc(db, "category", category);
    const q = query(postsRef, where('visibility', '==', 'public'), where('category', '==', categoryRef), orderBy('creationTime', 'desc'));
    const postsSnapshot = await getDocs(q);
    const posts = postsSnapshot.docs.map(doc => { return { ...doc.data(), id: doc.id } });
    return posts;
}

export async function setPlay(postId) {
    const db = getFirestore();
    const postRef = doc(db, "post", postId);
    const docSnap = await updateDoc(postRef, { plays: increment(1) });
}


