import { getAuth } from 'firebase/auth';
import { collection, getDoc, getFirestore } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function Profile() {
    const { id } = useParams();
    const [userData, setUserData] = useState();

    useEffect(() => {
        const loadUserData = async (userId) => {
            const temp = await fetchUserData(userId);
        }
        if (!id) {
            loadUserData(getAuth().currentUser.uid);
        }
        else {
            loadUserData(id);
        }
    }, [])
    return (
        <div>Profile</div>
    )
}

async function fetchUserData(userId) {
    let userData = undefined;
    const db = getFirestore();
    const userRef = collection(db, 'users');
    const doc = await getDoc(userRef, userId);
    if (doc.exists()) {
        console.log(doc.data());
        userData = { ...doc.data(), id: doc.id }
    }
    return userData;
}