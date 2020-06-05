const socket = io();
const userVideo = document.querySelector('.client-video');
const callerVideo = document.querySelector('.caller-video');
const client = {};

navigator.mediaDevices.getUserMedia({video: true, audio: true})
  .then(stream => {
    socket.emit('NewClient');
    userVideo.srcObject = stream;
    userVideo.play();

    function initPeer(type) {
      const peer = new SimplePeer({
        initiator: (type === 'init')? true: false,
        stream: stream,
        trickle: false,
      });

      peer.on('stream', function(stream) {
        callerVideo.srcObject = stream;
        callerVideo.play();
      });

      peer.on('close', function() {
        callerVideo.pause();
        callerVideo.load();
        peer.destroy();
      });

      return peer;
    }

    function stopCallerVideo() {
      callerVideo.pause();
      callerVideo.load();
    }

    function makePeer() {
      client.gotAnswer = false;
      const peer = initPeer('init');
      peer.on('signal', function(data) {
        if(!client.gotAnswer) {
          socket.emit('Offer', data);
        }
      });
      client.peer = peer;
    }

    function frontAnswer(offer) {
      const peer = initPeer('answer');
      peer.on('signal', function(data) {
        socket.emit('Answer', data);
      });
      peer.signal(offer);
    }

    function signalAnswer(answer) {
      client.gotAnswer = true;
      const peer = client.peer;
      peer.signal(answer);
    }

    function sessionActive() {
      document.write('Session Active! Please come back later.');
    }

    socket.on('BackOffer', frontAnswer);
    socket.on('BackAnswer', signalAnswer);
    socket.on('SessionActive', sessionActive);
    socket.on('StopStream', stopCallerVideo);
    socket.on('CreatePeer', makePeer);
  })
  .catch(err => {
    document.write("This application requires webcam and audio permission to function!")
  });