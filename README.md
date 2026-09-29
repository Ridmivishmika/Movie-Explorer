# 🎬 Movie Explorer

A  web application built with **React**, **Material-UI (MUI)**, **Axios**, and **The Movie Database (TMDb) API**. 



## Features Implemented

### 1. User Authentication & Profile
- **Sign In System:** Clean login page supporting any username and password (4+ characters).
- **Per-User Session Persistence:** User session and profile state stored securely in `localStorage`.
- **Conditional Navigation:** 
  - The **Explore** button appears only after user login.
  - Favorites and user profile options are protected for authenticated users.
- **Auto-Generated Avatars:** Dynamic avatar generation for each user based on their username.

### 2. Search & Latest Search Persistence
- **Live Search with Debounce:** Instant search queries with automatic debounce to reduce unnecessary API requests.
- **User's Latest Searched Movie:** Automatically saves the user's latest search term and displays it in the header/navbar chip across all pages (Home, Movie Details, and Favorites).

### 3. Multi-Criteria Movie Filters
- **Genre Selector:** Filter movies by official TMDb genres (Action, Comedy, Drama, Sci-Fi, etc.).
- **Release Year:** Filter by primary release year from 2000 to the current year.
- **Minimum Rating Slider:** Filter by minimum rating (e.g. 7.0+, 8.0+).
- **Clear Filters:** Single-click button to reset all active filters back to defaults.

### 4. Trending Movies & Pagination
- **Trending Switcher:** Toggle between **Trending Today** and **Trending This Week**.
- **Hero Spotlight Banner:** Showcases the #1 trending movie with backdrop, overview, quick trailer preview, and favorites button.
- **Load More Pagination:** "Load More Movies" button at the bottom of the grid fetches and appends subsequent pages seamlessly without page reloads.
- **End-of-Results Status:** Displays *"No more movies to load"* when all results have been fetched.

### 5. Interactive Favorites System
- **Guest Protection & Auto-Add on Login:** If a guest clicks the favorite heart on any movie, a modal prompts them to log in. Upon signing in, the selected movie is automatically added to their favorites and they are redirected to their Favorites list.
- **Per-Account Storage:** Saved favorites are isolated per username (`movie_explorer_favorites_{username}`) in `localStorage`.
- **Dedicated Favorites Page (`/favorites`):** View all favorited movies, view count, individual movie removal, or clear all favorites with a confirmation dialog.
- **Interactive Feedback:** Toast notifications confirm when a movie is added or removed.

### 6. Comprehensive Movie Details Page (`/movie/:id`)
- **Cinematic Presentation:** High-definition backdrop banner with poster and movie metadata.
- **Key Metrics:** Rating, release year, runtime (hours & minutes), language, budget, and box office revenue (formatted in USD).
- **Cast List:** Horizontal scrolling carousel of top cast members with photos and character names.
- **Similar Movies:** Curated recommendations based on the active movie.
- **Trailer Playback:** Embedded 16:9 responsive YouTube trailer dialog.

### 7. Light & Dark Theme
- Built-in theme switch in the navigation bar.
- Custom Material-UI theme with harmonious color palette and glassmorphism styling.
- Remembers user's theme preference in `localStorage`.


## Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **React 19** | Core UI library |
| **Vite 8** | High-performance build tool and dev server |
| **Material-UI (MUI v9)** | Modern component library, layout system, and icons |
| **Emotion** | CSS-in-JS styling |
| **Axios** | HTTP client with interceptors for TMDb API communication |
| **React Router v7** | Client-side routing and page transitions |

---



## 📡 TMDb API Usage

The application connects to **The Movie Database (TMDb) API v3** via [`src/api/tmdb.js`](src/api/tmdb.js).



## 🚀 Project Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.0.0 or higher recommended)
- `npm` or `yarn`

### 1. Clone the Repository
```bash
git clone https://github.com/Ridmivishmika/Movie-Explorer.git
cd Movie-Explorer
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root folder (or duplicate `.env.example`):
```bash
cp .env.example .env
```

Add your TMDb API key inside `.env`:
```env
VITE_TMDB_API_KEY=your_tmdb_api_key_here
```
*(A default backup key is pre-configured so the application functions out of the box).*

### 4. Run the Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### 5. Build for Production
To create an optimized production bundle:
```bash
npm run build
```

To preview the production build locally:
```bash
npm run preview
```
