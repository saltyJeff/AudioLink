var peer = null;
var connectionList = document.getElementById("connectionList");

new Slip(connectionList);

function requestID(obj) {
  var id = document.getElementById("peerID").value;
  if(id == "") {
    return;
  }
  peer = new Peer(id, {key: 'wrabjwt5dpwrk9'});

  document.getElementById("peerID").hidden = true;
  obj.hidden = true;

  console.log("Peer Created with ID: "+id);
  console.log(peer);

  document.getElementById("yourID").textContent += id;
  document.getElementById("yourID").style.display = "block";

  peer.on('connection', function (conn) {
    conn.on('data', function(data) {
      if(data.msgType == "connected") {
        console.log(data.msg + " has connected!");
        connectionList.appendChild(connectionNode(data.msg));
        updateOrder();
      }
      
      if (data.msgType == "requestNew") {
        var songName = data.msg;
        console.log("Recieved request for: "+songName);
        for(var i = 0; i < songList.children.length; i++) {
          var currentNode = songList.children[i];
          if(Polymer.dom(currentNode).textContent == songName) {
            conn.send(
              {
                msgType: "requestReturn",
                msg: [songName,currentNode.getAttribute("size"), currentNode.getAttribute("URI")]
              }
            );
            
            console.log("Returning request for: "+songName);
            break;
          }
        }
      }
    });
  });
}

function connectionNode(name) {
  var obj = document.createElement("li");
  obj.textContent = name;
  obj.classList.add("connectionNode");

  return obj;
}

function updateOrder() {
  var songs = [];
  for(var i = 0; i < songList.children.length; i++) {
    var elem = songList.children[i];
    var songName = Polymer.dom(elem).textContent;
    songs[i] = songName;
  }
  console.log(songs);
  sendToAll(
    {
      msgType: "songOrder",
      msg: songs
    }
  );
}

function sendToAll(msg) {
  if(peer == null) {
    return;
  }
  for(var i in peer.connections) {
    var conn = peer.connections[i][0];
    conn.send(msg);
  }
}

function sendSongInfo() {
  console.log("Sending song Info");
  sendToAll(
    {
      msgType: "currentSongInfo",
      msg: [Polymer.dom(songList.children[0]).textContent, audio.currentTime, Date.now()]
    }
  );
}

function sendPause() {
  console.log("Paused");
  sendToAll(
    {
      msgType: "paused"  
    }
  );
}