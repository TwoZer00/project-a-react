import "./App.css";
import { Menu } from "./components/navigation/Menu.jsx";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useRef, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Home } from "./components/Home";
import { Login } from "./components/Login";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { Profile } from "./components/Profile";
import { Post } from "./components/Post";
import { Player } from "./components/Player";
import { Upload } from "./components/Upload";
import {
  getAudioUrl,
  getProfileImageURL,
  getUser,
  logout,
} from "./utils/utils";
import { Settings } from "./components/Settings";
import { ProfileSettings } from "./components/ProfileSettings";
import { MenuSettings } from "./components/navigation/MenuSettings";
import { Feed } from "./components/Feed";

export function App() {
  const auth = getAuth();
  const [audioUrl, setAudioUrl] = useState();
  const handleObj = async (obj) => {
    setAudioUrl(obj);
    console.log(audioUrl);
  };
  const isMounted = useRef(true);
  const [isLoading, setIsLoading] = useState(true);
  const [profileImage, setProfileImage] = useState("");
  const [userId, setUserId] = useState("");
  const [cursorState, setCursorState] = useState();
  const [user, setUser] = useState();
  const [dark, setDark] = useState(
    localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "ligth")
  );
  useEffect(() => {
    if (isMounted.current) {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          setProfileImage();
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          setUserId(user.uid);
          setUser(await getUser(user.uid));
          //gs://af-project-3d9e5.appspot.com/userPhotos/I0gxG4T5w2QjQYOLiLJbkKJ7dH82
          // ...
          //console.log("a", uid);
          // const gsReference = ref(
          //   storage,
          //   `userPhotos/${userId}/profileImage.jpg`
          // );
          try {
            setProfileImage(await getProfileImageURL(user.uid));
          } catch (error) {
            console.error(error.message);
          }
        } else {
          setProfileImage();
          setUser();
        }
      });
    }
  }, [auth, userId]);
  return (
    <div className={`${dark ? dark : ""} ${cursorState} `}>
      <div className={`bg-white dark:bg-neutral-900`}>
        <header className="border-b fixed top-0 w-screen">
          <Menu
            profileImage={profileImage}
            user={user}
            logoutFunction={logout}
            setDark={setDark}
          ></Menu>
        </header>
        <main className={`h-screen w-screen`}>
          <div className="h-full pt-[60px]">
            <div className="h-full w-screen flex flex-col">
              <div className="flex-auto h-5/6 overflow-auto mt-2 mb-2">
                <Routes>
                  <Route exact path="/" element={<Home player={handleObj} />} />
                  <Route
                    path="/login"
                    user={user}
                    element={<Login cursorState={setCursorState} />}
                  />
                  <Route
                    path="/user/:userId"
                    element={
                      <Profile
                        img={profileImage}
                        player={handleObj}
                        user={user}
                      />
                    }
                  />
                  <Route
                    path="/post/:postId"
                    element={<Post handleAudioURL={handleObj} />}
                  />
                  <Route path="/upload" element={<Upload user={user} />} />
                  <Route
                    path="/settings"
                    element={<MenuSettings user={user} />}
                  >
                    <Route
                      path="user"
                      element={
                        <ProfileSettings
                          user={user}
                          img={profileImage}
                          setProfileImage={setProfileImage}
                          setUser={setUser}
                        />
                      }
                    />
                    <Route path="" element={<Settings />} />
                  </Route>
                  <Route
                    path="/feed"
                    element={<Feed user={user} player={handleObj} />}
                  />
                </Routes>
              </div>
              <div className="flex-auto h-24">
                <Player post={audioUrl || ""} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
