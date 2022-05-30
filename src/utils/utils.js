import { async } from "@firebase/util";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  uploadString,
} from "firebase/storage";
import { useRef } from "react";
import { Link, useMatch, useResolvedPath } from "react-router-dom";
import firebase from "./firebase";
const storage = getStorage();
const auth = getAuth();
const db = getFirestore(firebase);
const nsfw = localStorage.getItem("nsfw") || false;

export function stringToDate(string) {
  //console.log(new Date(string));
  let date = new Date(1616258233000);

  if (string && !string === "") {
    date = new Date(string);
  }

  // console.log(new Date("1616258233000"));
  return `${date.toDateString()}`;
}
String.prototype.toHHMMSS = function () {
  var sec_num = parseInt(this, 10); // don't forget the second param
  var hours = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - hours * 3600) / 60);
  var seconds = sec_num - hours * 3600 - minutes * 60;

  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  if (hours > 0) {
    return hours + ":" + minutes + ":" + seconds;
  } else {
    return minutes + ":" + seconds;
  }
};

export function secToPorcentage(time, totalTime) {
  if (time > 0) {
    return (time * 100) / totalTime;
  }
  return 0;
}

export async function getUsername(id) {
  const db = getFirestore(firebase);
  const docRef = doc(db, "user", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    //console.log(docSnap.data().username);
    return docSnap.data().username;
  }
  //console.warn("No user found");
  return undefined;
}

//Gives the difference in seconds, minutes, hours and days between the current date and the given date, if the difference is more than a month just show the date.
export function daysAgo(date) {
  var difference = Date.now() - date?.seconds * 1000;
  var daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
  difference -= daysDifference * 1000 * 60 * 60 * 24;

  var hoursDifference = Math.floor(difference / 1000 / 60 / 60);
  difference -= hoursDifference * 1000 * 60 * 60;

  var minutesDifference = Math.floor(difference / 1000 / 60);
  difference -= minutesDifference * 1000 * 60;

  var secondsDifference = Math.floor(difference / 1000);

  if (daysDifference > 30) {
    return new Date(date).toDateString();
  } else if (daysDifference > 0) {
    return daysDifference + " day/s ago";
  } else if (hoursDifference > 0) {
    return hoursDifference + " hour/s ago";
  } else if (minutesDifference > 0) {
    return minutesDifference + " minute/s ago";
  } else if (secondsDifference > 0) {
    return secondsDifference + " second/s ago";
  }
}
export function porcentageToSecs(porcentage, totalSecs) {
  return (porcentage * totalSecs) / 100;
}
export function pixToPorcentage(pixels, totalPixels) {
  return (pixels * 100) / totalPixels;
}

export async function uploadPost(post, file, setProgress) {
  post.date = new Date();
  //let complete = false;
  //console.log(post);
  const storage = getStorage(firebase);
  const db = getFirestore(firebase);
  const newCityRef = doc(collection(db, "post"));
  const storageRef = ref(
    storage,
    `audio/${post.userId}/${newCityRef.id}/${file.name}`
  );

  // 'file' comes from the Blob or File API
  let downloadURL = await uploadBytes(storageRef, file);
  //console.log(downloadURL, downloadURL.ref, downloadURL.downloadURL);
  //post.fileURL = downloadURL;
  let filePath = downloadURL.ref.fullPath;
  console.log(encodeURIComponent(filePath));
  post.filePath = filePath;
  await setDoc(newCityRef, post);

  // const uploadTask = uploadBytesResumable(storageRef, file);
  // return uploadTask;
  // uploadTask.on(
  //   "state_changed",
  //   (snapshot) => {
  //     // Observe state change events such as progress, pause, and resume
  //     // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
  //     const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //     setProgress(progress);
  //     console.log("Upload is " + progress + "% done");
  //     switch (snapshot.state) {
  //       case "paused":
  //         console.log("Upload is paused");
  //         break;
  //       case "running":
  //         console.log("Upload is running");
  //         break;
  //       default:
  //         break;
  //     }
  //   },
  //   (error) => {
  //     // Handle unsuccessful uploads
  //   },
  //   async () => {
  //     // Handle successful uploads on complete
  //     // For instance, get the download URL: https://firebasestorage.googleapis.com/...
  //     let downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
  //     console.log("File available at", downloadURL);
  //     post.fileURL = downloadURL;
  //     await setDoc(newCityRef, post);
  //     complete = true;
  //     return complete;
  //   }
  // );
  // This code is equivalent to the above.

  //var handle = uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED);
  // var unsubscribe = handle(function (snapshot) {
  //   var percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //   console.log(percent + "% done");
  //   // Stop after receiving one update.
  //   unsubscribe();
  // });
}

export async function getUser(id) {
  const db = getFirestore(firebase);
  const docRef = doc(db, "user", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    let obj = docSnap.data();
    obj.userId = id;
    return obj;
  }
  console.warn("No user found");
  return undefined;
}

export async function setUserFollow(userfollowing, userfollowid, followers) {
  // console.log(userfollowing);
  // try {
  //   userfollowing.followers = await getUserFollowers(userfollowing.userId);
  // } catch (error) {
  //   console.error(error.message);
  // }
  // console.log(userfollowing);
  if (followers.length <= 0) {
    try {
      await setDoc(doc(db, "follow", userfollowing.userId), {
        followers: [],
      });
    } catch (error) {
      console.error(error.message);
    }
  }
  const updateRef = doc(db, "follow", userfollowing.userId);
  if (followers.includes(userfollowid)) {
    try {
      console.warn("remove");
      await updateDoc(updateRef, {
        followers: arrayRemove(userfollowid),
      });
      return await getUserFollowers(userfollowing.userId);
    } catch (error) {
      console.error(error.message);
    }
  } else {
    try {
      console.warn("add");
      await updateDoc(updateRef, {
        followers: arrayUnion(userfollowid),
      });
      return await getUserFollowers(userfollowing.userId);
    } catch (error) {
      console.error(error.message);
    }
  }

  // console.log(userfollowing);
  // const db = getFirestore(firebase);
  // const updateRef = doc(db, "user", userfollowing.userId);
  // if (userfollowing.following) {
  //   console.log("follow");
  //   if (userfollowing.following.includes(userfollowid)) {
  //     return await updateDoc(updateRef, {
  //       following: arrayRemove(userfollowid),
  //     });
  //   } else {
  //     try {
  //       await updateDoc(updateRef, {
  //         following: arrayUnion(userfollowid),
  //       });
  //     } catch (error) {
  //       console.error(error.message);
  //     }
  //     console.log("followed");
  //   }
  // } else {
  //   if (userfollowing.following.includes(userfollowid)) {
  //     await updateDoc(updateRef, {
  //       following: [],
  //     });
  //     await updateDoc(updateRef, {
  //       following: arrayRemove(userfollowid),
  //     });
  //   } else {
  //     await updateDoc(updateRef, {
  //       following: [],
  //     });
  //     await updateDoc(updateRef, {
  //       following: arrayUnion(userfollowid),
  //     });
  //   }
  // }
}
export function logout() {
  const auth = getAuth();
  signOut(auth)
    .then(() => {
      // Sign-out successful.
    })
    .catch((error) => {
      // An error happened.
    });
}

export async function loginUsernamePassword(email, password) {
  return await signInWithEmailAndPassword(auth, email, password);
}
export function CustomLink({ children, to, className, ...props }) {
  let resolved = useResolvedPath(to);
  let match = useMatch({ path: resolved.pathname, end: true });

  return (
    <>
      <Link
        //style={{ textDecoration: match ? "underline" : "none" }}
        className={`${
          match
            ? "dark:bg-white/20 bg-white"
            : "group:bg-gray-200 hover:bg-gray-100/20"
        } ${className}`}
        to={to}
        {...props}
      >
        {children}
      </Link>
    </>
  );
}

export async function getProfileImageURL(userId) {
  const gsReference = ref(storage, `userPhotos/${userId}/profileImage.jpg`);
  try {
    return await getDownloadURL(gsReference);
  } catch (error) {
    console.error(error);
  }
}

export async function uploadProfileImage(file, userId) {
  //const data = await resize(file, 200,img);
  //console.log(data);
  // Create a root reference
  const storage = getStorage();

  // Create a reference to 'mountains.jpg'
  const mountainsRef = ref(storage, `/userPhotos/${userId}/profileImage.jpg`);
  return await uploadString(mountainsRef, file, "data_url");
}

export async function resize(file, element) {
  let data;
  //define the width to resize e.g 600px
  var resize_width = 200; //without px

  //get the image selected
  var item = file;

  //create a FileReader
  var reader = new FileReader();

  //image turned to base64-encoded Data URI.
  reader.readAsDataURL(item);
  reader.name = item.name; //get the image's name
  reader.size = item.size; //get the image's size

  reader.addEventListener("load", async (e) => {
    var img = new Image(); //create a image
    img.src = e.target.result; //result is base64-encoded Data URI
    //img.name = e.target.name; //set name (optional)
    img.size = e.target.size; //set size (optional)
    img.addEventListener("load", async (el) => {
      var elem = document.createElement("canvas"); //create a canvas

      //scale the image to 600 (width) and keep aspect ratio
      var scaleFactor = resize_width / el.target.width;
      elem.width = resize_width;
      elem.height = el.target.height * scaleFactor;

      //draw in canvas
      var ctx = elem.getContext("2d");
      ctx.drawImage(el.target, 0, 0, elem.width, elem.height);

      //get the base64-encoded Data URI from the resize image
      data = ctx.canvas.toDataURL("image/jpeg", 1);
      //console.log(element.current.src);
      element.current.src = data;
      return data;
    });
  });
}

export async function updateProf(obj, userid) {
  const docRef = doc(db, "user", userid);

  // Update the timestamp field with the value from the server
  return await updateDoc(docRef, obj);
}

export async function getUserInfo(id) {
  const userRef = doc(db, "user", id);
  const userDoc = await getDoc(userRef);
  if (userDoc.exists()) {
    let user = userDoc.data();
    user.userId = userDoc.id;
    return user;
  }
}

export async function getUserPosts(id, user) {
  //let q;
  console.log(id);
  // if (nsfw) {
  //   q = query(
  //     collection(db, "post"),
  //     orderBy("date", "desc"),
  //     where("userId", "==", id)
  //   );
  // } else {

  // }
  const postRef = collection(db, "post");
  let q;
  if (nsfw === true || user) {
    q = query(postRef, where("userId", "==", id), orderBy("date", "desc"));
  } else {
    q = query(
      postRef,
      orderBy("nsfw", "asc"),
      where("nsfw", "!=", true),
      where("userId", "==", id),
      orderBy("date", "desc")
    );
  }
  const userPosts = await getDocs(q);
  console.log(userPosts.docs);
  return userPosts.docs;
}

export async function getUserFollowers(id) {
  const followersRef = doc(db, "follow", id);
  const followersDoc = await getDoc(followersRef);
  if (followersDoc.exists()) {
    return followersDoc.data().followers;
    // let obj = {...userInfo,...docSnap.data()};
    // console.log(obj);
    // //commets
    // setUserInfo(obj);
  }
}

export async function getUserFeed(id) {
  const citiesRef = collection(db, "follow");
  let q = query(citiesRef, where("followers", "array-contains", id));
  let result = await getDocs(q);
  let feed = [];
  result.forEach((doc) => {
    feed.push(doc.id);
  });
  //console.log(feed);
  const followRef = collection(db, "post");

  if (nsfw === true) {
    console.info(nsfw);
    q = query(followRef, where("userId", "in", feed), orderBy("date", "desc"));
  } else {
    console.log(nsfw);
    q = query(
      followRef,
      orderBy("nsfw", "asc"),
      where("nsfw", "!=", true),
      where("userId", "in", feed),
      orderBy("date", "desc")
    );
  }
  result = await getDocs(q);
  console.info(result.docs);
  return result.docs;
  //console.log();
  //return feed;
  //console.log(result.docs);
  ///return await getDocs(q);
  // querySnapshot.forEach((doc) => {
  //   // doc.data() is never undefined for query doc snapshots
  //   console.log(doc.id, " => ", doc.data());
  // });
}

export async function getUserFollowing(id) {
  const followRef = collection(db, "follow");
  let q = query(followRef, where("followers", "array-contains", id));
  let result = await getDocs(q);
  let feed = [];
  result.forEach((doc) => {
    feed.push(doc.id);
  });
  return feed;
}

export async function getAudioUrl(path) {
  const gsReference = ref(storage, path);
  try {
    return await getDownloadURL(gsReference);
  } catch (error) {
    console.error(error);
  }
}
