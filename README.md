# Chatty

Chatty is a video chat application that uses [WebRTC](https://webrtc.org/) to stream audio and video between two users.  
This application is live on glitch at chatty-chatty-now-now.glitch.me if you want to take it for a spin.

### Purpose

This was an application built to have an hands-on experience with WebRTC and how media streaming works with WebRTC on a high level overview. This is a good started code for a basic two client web chat application that can be built upon.

### Dependencies

The application requires following packages to function as intended:
* [Node.js](https://nodejs.org/en/)
* [Express](https://expressjs.com/)
* [Socket.io](https://socket.io/)
* [Simple Peer](https://github.com/feross/simple-peer/)

### Building the application

In order to build the application run the following commands:

```bash
git clone https://github.com/Kriyszig/chatty.git
cd chatty
npm install
npm run-script start
```
You can then visit `http://localhost:3000/` or the port set by the `PORT` environment variable.

### The User Interface

![Imgur](https://i.imgur.com/GZ0To9N.png)

This is minimal application focusing on WebRTC and Media Streaming and hence the UI looks the part.

When only a single user is present, only the left side view is on with your video preview and when another user joins, they'll pop up on the right side. When the guest disconnects, the right view goes dark and only left view remains.

