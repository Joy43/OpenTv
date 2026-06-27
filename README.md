# OpenTv Monorepo

Welcome to the **OpenTv** monorepo! This repository contains the complete ecosystem for the OpenTv platform, separated into three main workspaces.

## 📁 Repository Structure

### 1. `opentv-app` (Mobile & TV App)
A powerful React Native (Expo) application built for Android TV, Fire TV, and mobile devices. It features:
- High-performance IPTV streaming.
- Support for remote control interactions (`TVEventHandler`).
- Massive built-in channel lists (World Cup, FIFA, TV Networks).
- 👉 **[View the App Source Code & Details](./opentv-app)**
- 👉 **[View the IPTV Playlists](./opentv-app/worldcup/README.md)**

### 2. `opentv-server` (Backend API)
The core backend server built with Express and Prisma. It handles:
- User Authentication (JWT-based).
- API Routes and Swagger UI Documentation.
- Data management for categories, streams, and users.
- 👉 **[View the Server Source Code & Details](./opentv-server)**

### 3. `dashboard` (Admin Panel)
A modern, premium React/Vite dashboard for managing the platform. It features:
- Glassmorphism design and modern CSS.
- Fast, responsive interface.
- Easy management of content streams and users.
- 👉 **[View the Dashboard Source Code & Details](./dashboard)**

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) and [Yarn](https://yarnpkg.com/) installed on your machine. 

### Installation
Because this is a Monorepo using Yarn Workspaces, you can install the dependencies for all three projects at once by running the following command in the **root** folder:
```bash
yarn install
```

### Running the Projects

**To run the React Native TV App:**
```bash
cd opentv-app
yarn run android
```

**To run the Backend Server:**
```bash
cd opentv-server
npm run dev
```

**To run the Admin Dashboard:**
```bash
cd dashboard
npm run dev
```
