# LAN Web Server
A simple web server for local area network (LAN) development and testing.
Made for the purpose of being able to create and run web applications, mainly for experiementation, accessible from other devices on the same LAN.

Client server is on port 5173 by default.
Server is on port 3000 by default.

# ! This is not secure. Do not use this in production or expose it to the internet.
Importantly, the admin control currently does not have any authentication, so anyone with the link can access it.

## Features
- [x] Serve static files over HTTP
- [ ] POST request??
- [ ] Make it look cool!!
- [ ] Quiz app
- [ ] Leaderboard
- [ ] Mini puzzles or something
- [ ] Easter eggs!

## Setup Instructions
```bash
git clone ...
cd client
npm install
npm run priv
```

```bash
cd server
npm install
npm run dev
```

## Accessing from Other Devices
`192.168.x.x:5173`