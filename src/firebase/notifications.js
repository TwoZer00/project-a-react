import { collection, doc, getDocs, getFirestore, limit, orderBy, query, serverTimestamp, setDoc, updateDoc, where, writeBatch } from 'firebase/firestore';

export async function createNotification(targetUserId, { type, fromUserId, postId, commentId }) {
    if (!targetUserId || targetUserId === fromUserId) return;
    const db = getFirestore();
    const ref = doc(collection(db, "user", targetUserId, "notifications"));
    await setDoc(ref, {
        type,
        fromUser: doc(db, "user", fromUserId),
        postId: postId || null,
        commentId: commentId || null,
        read: false,
        createdAt: serverTimestamp()
    });
}

export async function getNotifications(userId, count = 20) {
    const db = getFirestore();
    const ref = collection(db, "user", userId, "notifications");
    const q = query(ref, orderBy('createdAt', 'desc'), limit(count));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ ...d.data(), id: d.id }));
}

export async function getUnreadCount(userId) {
    const db = getFirestore();
    const ref = collection(db, "user", userId, "notifications");
    const q = query(ref, where('read', '==', false));
    const snap = await getDocs(q);
    return snap.size;
}

export async function markAllRead(userId) {
    const db = getFirestore();
    const ref = collection(db, "user", userId, "notifications");
    const q = query(ref, where('read', '==', false));
    const snap = await getDocs(q);
    if (snap.empty) return;
    const batch = writeBatch(db);
    snap.docs.forEach(d => batch.update(d.ref, { read: true }));
    await batch.commit();
}
