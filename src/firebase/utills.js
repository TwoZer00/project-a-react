import { getAuth } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, getFirestore, increment, orderBy, query, setDoc, updateDoc, where, writeBatch } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { CustomError } from '../Errors/CustomError';
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
export async function getUserData(userId) {
    const db = getFirestore();
    const userRef = doc(db, "user", userId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
        return { ...userDoc.data(), id: userDoc.id };
    }
    else {
        throw new CustomError("user not found");
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
export async function setUser(userId, user) {
    const db = getFirestore();
    const userRef = doc(db, "user", userId);
    return setDoc(userRef, { ...user, creationTime: (new Date(getAuth().currentUser.metadata.creationTime)) });
}

export async function getCategories() {
    const db = getFirestore();
    const categoriesRef = collection(db, "category");
    const categoriesSnapshot = await getDocs(categoriesRef);
    const categories = categoriesSnapshot.docs.map(doc => { return { ...doc.data(), id: doc.id } });
    console.log(categories);
    return categories;
}

export async function getComment(id) {
    const db = getFirestore();
    const commentRef = doc(db, "comment", id);
    const commentDoc = await getDoc(commentRef);
    if (commentDoc.exists()) {
        return { ...commentDoc.data(), id: commentDoc.id };
    }
    else {
        return;
    }
}

export async function getUsername(id) {
    const temp = await getUserData(id);
    return temp?.username;
}

export async function getPostsUser(id, size) {
    const db = getFirestore();
    const postsRef = collection(db, "post");
    const q = query(postsRef, where('user', '==', doc(db, "user", id)));
    const postsSnapshot = await getDocs(q);
    const posts = postsSnapshot.docs.map(doc => { return { ...doc.data(), id: doc.id } });
    return posts;
}

export async function getTags() {
    const db = getFirestore();
    const tagsRef = collection(db, "tag");
    const tagsSnapshot = await getDocs(tagsRef);
    const tags = tagsSnapshot.docs.map(doc => { return { ...doc.data(), id: doc.id } });
    console.log(tags);
    return tags;
}
export async function getPostsUserCount(id) {
    const posts = await getPostsUser(id);
    return posts.length;
}

export async function updatePost(id, post, tags) {
    const db = getFirestore();
    const postRef = doc(db, "post", id);
    const tagsRefs = createTagsRefs(tags);
    const batch = writeBatch(db);
    for (let tagRef of tagsRefs) {
        const temp = {
            title: decodeURI(tagRef.id),
            urlPath: tagRef.path
        }
        batch.set(tagRef, temp);
    }
    const tempPost = { ...post, tags: tagsRefs };
    batch.update(postRef, tempPost);
    batch.commit();
    return { ...tempPost, id: postRef.id };
}

export function createTagsRefs(tags) {
    const tagsRefs = tags.map(tag => { return doc(getFirestore(), "tag", encodeURI(tag.trim())) });
    return tagsRefs;
}

export async function getComments(id) {
    const db = getFirestore();
    const commentsRef = collection(db, "comment");
    const q = query(commentsRef, where('postOwned', '==', doc(db, "user", id)));
    const commentsSnapshot = await getDocs(q);
    console.log(commentsSnapshot.docs);
    const comments = commentsSnapshot.docs.map(doc => { return { ...doc.data(), id: doc.id } });
    return comments;
}



