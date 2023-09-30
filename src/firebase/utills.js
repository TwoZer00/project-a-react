import { doc, getFirestore, getDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { getDownloadURL } from 'firebase/storage';
import { updateDoc } from 'firebase/firestore';
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
    const db = getFirestore();
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
    console.log(storageRef);
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
    // await userRef.update(user);
    try {
        await updateDoc(userRef, user);
        return user;
    } catch (error) {
        console.log(error);
        return undefined;
    }
}
export async function getAvatarImage(refpath) {
    const storage = getStorage();
    const storageRef = ref(storage, refpath);
    const url = await getDownloadURL(storageRef);
    return url;
}

