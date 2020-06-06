# Chatty

Chatty is a video and text chat application that uses [WebRTC](https://webrtc.org/) and [WebSocket](https://html.spec.whatwg.org/multipage/web-sockets.html) to stream audio, video and text between two users.  
This application is live on glitch at https://chatty-chatty-now-now.glitch.me if you want to take it for a spin.  
**Note:** This application might not work on Chrome or other Chrome derived desktop browsers because of insecure WebSocket connection. Due to enhancd security, Chrome doesn't allow insecure WebScokets but that isn't the case with Firefox where insecure connections via a WebSocket is currently allowed.

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

![Chatty](https://i.imgur.com/nnNI939.png)

This is minimal application focusing on WebRTC and Media Streaming and hence the UI looks the part.

When only a single user is present, only the top view is on with your video preview and when another user joins, they'll pop up in the bottom view. When the guest disconnects, the bottom view goes dark and only your video remains.  
The chat pane on the right can be used to send text messages between the clients. The window is hidden on smaller viewports and can be toggled using a button

