# A Project

[![Netlify Status](https://api.netlify.com/api/v1/badges/3f3ae7a4-3b98-47eb-9e51-7fa99ffda8f4/deploy-status)](https://app.netlify.com/sites/dapper-tanuki-bfa3a1/deploys)

An audio-sharing social platform with a station-first experience. Create your profile, upload audio, build radio stations, and share with the world.

## Features

### Stations
- **Author stations** — Every user with content becomes a playable station
- **Custom stations** — Create themed stations from selected posts with shuffle toggle
- **Interludes** — Record intro, between-track, outro, and credit clips for a real radio feel
- **Auto-advance** — Tracks play continuously with skip next/prev controls
- **Queue view** — See upcoming tracks in the mini player

### Audio
- **Upload** — Share audio files with title, description, tags, category, visibility, and NSFW flag
- **Waveform visualization** — Real audio waveform on post pages with seek support
- **Mini player** — Fixed bottom bar with playback controls, progress, and station info
- **Play tracking** — Play counts tracked per post

### Social
- **Profiles** — Avatar, description, gender, follower count, creation date
- **Follow/unfollow** — Follow users and see their content
- **Comments & replies** — Threaded comments with collapsible reply threads
- **Author badge** — Visual indicator when the post author comments
- **Likes** — Heart button with count on posts
- **Bookmarks** — Save posts to a personal collection
- **Notifications** — Bell icon with unread badge for follows, comments, likes
- **User search** — Find users by username from the app bar
- **Share** — Copy post links to clipboard

### Discovery
- **Discover tab** — Personalized recommendations based on listening history, or random picks
- **Recent tab** — Chronological feed with pagination
- **Bookmarks tab** — Quick access to saved posts from home
- **Categories & tags** — Browse and filter content
- **Listening history** — View recently played posts

### UI/UX
- **Responsive layout** — Full-width content with top app bar and bottom mini player
- **Dark/light theme** — Auto-detects system preference, manual override in settings
- **i18n** — English and Spanish based on browser language
- **Skeleton loaders** — Placeholder cards while content loads
- **Empty states** — Friendly messages with action buttons when no content
- **Scroll to top** — Auto-scrolls on navigation

## Tech Stack

- **Frontend** — React 18, Vite, Material UI 5
- **Backend** — Firebase (Auth, Firestore, Storage)
- **Routing** — React Router 6 with loader-based data fetching
- **Audio** — Web Audio API for waveform visualization
- **Hosting** — Netlify
- **Date** — dayjs

## Getting Started

```bash
npm install
npm run dev
```

### Environment Variables

Create a `.env` file:

```
VITE_FIREBASE_API_KEY=<your-api-key>
VITE_LOCAL_FIREBASE=localhost
```

### Firebase Emulators

The app connects to Firebase emulators on localhost automatically. Run:

```bash
firebase emulators:start
```

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── Comments/     # Comment, Reply, InputComment
│   ├── Dashboard/    # Dashboard drawer
│   ├── Follow/       # Follow button
│   ├── BookmarkButton, LikeButton, PlayButton
│   ├── MiniPlayer    # Fixed bottom audio player
│   ├── NotificationBell
│   ├── PostCard, PostListItem
│   ├── SearchUsers
│   ├── StationCard
│   ├── Waveform      # Audio waveform visualization
│   └── ...
├── context/          # React context providers
├── firebase/         # Firebase init, utilities, notifications
├── Pages/            # Route pages
│   ├── Dashboard/    # Dashboard pages
│   ├── Home, Post, Profile, Upload
│   ├── Bookmarks, ListeningHistory
│   ├── Stations, Interludes
│   └── ...
├── Routes/           # Router configuration
├── utils/            # Helpers, i18n labels, recentPlays
└── main.jsx          # App entry point
```

## Firestore Collections

| Collection | Description |
|---|---|
| `user/{id}` | User profiles |
| `user/{id}/interludes` | Station interludes |
| `user/{id}/stations` | Custom stations |
| `user/{id}/bookmarks` | Saved posts |
| `user/{id}/notifications` | User notifications |
| `post/{id}` | Audio posts |
| `comment/{id}` | Comments |
| `comment/{id}/replies` | Comment replies |
| `like/{userId}/posts/{postId}` | Post likes |
| `tag/{id}` | Tags |
| `category/{id}` | Categories |
| `genre/{id}` | Genres |
