# joiNUS — Setup Guide for Testing

This guide will get the joiNUS app running on your phone or simulator. The backend is already deployed, so you only need to set up the frontend.

## What you'll need

- [Node.js](https://nodejs.org) installed (any recent LTS version)
- The **Expo Go** app on your phone ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)) — *or* Xcode/Android Studio if you'd rather use a simulator
- The joiNUS frontend code (sent separately as a zip, or a GitHub link)
- **Connect your physical phone and laptop to the same Wifi**, unless using a simulator.

Note: THIS IS BUILT FOR IOS, AND NOT TESTED ON ANDROID DEVICES.

## Steps

### 1. Unzip / clone the frontend project

Open a terminal and navigate into the project folder.

### 2. Install dependencies

```bash
npm install
```

This may take a minute or two.

### 3. Create a `.env` file

In the project's root folder (same level as `package.json`), create a new file named exactly `.env` and paste this single line into it:

```
EXPO_PUBLIC_BACKEND_URL=https://joinus-backend-u7n3.onrender.com
```

Save the file. This tells the app where to find the backend — without it, the app won't be able to log in, load posts, or do anything that needs the server.

### 4. Start the app

```bash
npx expo start
```

A QR code will appear in your terminal.

### 5. Open it on your phone

- Open the **Expo Go** app
- Scan the QR code shown in your terminal
- The app should load on your phone after a short build step
- Ensure it is in Expo Go - !NOT development build. You can change it by pressing "s" on your keyboard!

*(Alternatively: press `i` in the terminal for an iOS simulator, or `a` for an Android emulator, if you have Xcode/Android Studio set up instead.)*

## Heads up — things to expect

- **First load may be slow (~30–50 seconds).** The backend is hosted on render free tier. The very first request wakes it back up — totally normal, not a bug.
- **If chat/messaging seems to disconnect** after the app has been idle for a while, that's the same spin-down issue. Reopening the chat screen should reconnect it.
- Everything (login, posts, profiles, chat, images) runs through the same backend URL in the `.env` file, so as long as that's correct, no other configuration is needed.

## If something doesn't work

Most likely culprits, in order of likelihood:
1. `.env` file wasn't created, or has a typo in the URL
2. Backend happened to be asleep — just wait ~40s and retry
3. The physical phone and laptop are not connected to the Wifi (Avoid using public Wifi)

If you hit an error, a screenshot of the terminal output is the fastest way for me to debug it.
Any questions, do feel free to reach out to me =)

Thanks so much for taking the time to test this out!
