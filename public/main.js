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
    socket.on('TextMessage', (text) => createTextNode('Guest', text));

    document.querySelector('.back').addEventListener('click', () => {
      const chatPanel = document.querySelector('.chat');
      chatPanel.classList.remove('move-to-left');
    });

    document.querySelector('.toggle-chat').addEventListener('click', () => {
      const chatPanel = document.querySelector('.chat');
      chatPanel.classList.add('move-to-left');
    });

    document.querySelector('.chat-input').addEventListener('keydown', (ev) => {
      if(ev.keyCode === 13) {
        submitInput();  
      }
    })

    document.querySelector('.send').addEventListener('click', () => {
      submitInput();
    });

    function submitInput() {
      const chatInput = document.querySelector('.chat-input');
      const text = chatInput.value.trim();
      chatInput.value = '';
      if(text.length) {
        socket.emit('Text', text);
        createTextNode('You', text);
      }
    }

    function createTextNode(as, text) {
      const newTextNode = document.createElement('div');
      newTextNode.classList.add('chat-element');
      newTextNode.style.display = 'flex';
      newTextNode.style.flexDirection = 'column';
      newTextNode.style.paddingBlockEnd = '4px';

      const addressElement = document.createElement('span');
      addressElement.textContent = as;
      addressElement.style.fontWeight = 'bolder';
      addressElement.style.color =
      (as === 'You')? 'cyan': '#D50032';

      const textElement = document.createElement('span');
      textElement.textContent = text;
      textElement.style.color = 'white';
      textElement.style.maxWidth = '270px';
      textElement.style.fontWeight = 'bolder';
      textElement.style.wordWrap = 'break-word';

      newTextNode.appendChild(addressElement);
      newTextNode.appendChild(textElement);

      document.querySelector('.chat-list').appendChild(newTextNode);
      newTextNode.scrollIntoView();
    }
  })
  .catch(err => {
    document.write("This application requires webcam and audio permission to function!")
  });