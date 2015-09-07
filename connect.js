var peer = new Peer({key: 'wrabjwt5dpwrk9'});
var conn;

var audio = document.getElementById("audio");
var info = document.getElementById("info");
var pausedTxt = document.getElementById("pausedTxt");
var songs = [];

function initConnection(id) {
  conn = peer.connect(id);
  conn.on('open', function () {
    peer.disconnect();
    
    var userName = document.getElementById("userName").value
    document.getElementById("peerInfo").textContent = "User Name: "+userName;
    document.getElementById("peerInfo").style.display = "block";

    document.getElementById("userName").style.display = "none";
    document.getElementById("submitButton").style.display = "none";
    document.getElementById("peerID").style.display = "none";
    
    conn.send(
      {
        msgType: "connected",
        msg: userName
      }
    );

    console.log("Connection Established");
  });
  
  conn.on('data', function(data) {
    if(data.msgType == "songOrder") {
      var newArray = [];
      
      var newTitles = data.msg;
      console.log(newTitles);
      
      for(var i = 0; i < newTitles.length; i++) {
        var currentSong = newTitles[i];
        var found = false;
        for(var j = 0; j < songs.length; j++) {
          if(currentSong == songs[j].name) {
            newArray[i] = songs[j];
            found = true;
            break;
          }
        }
        
        if(!found) {
          var newSong = new songObj(currentSong, -1, "");
          newArray[i] = newSong;
        }
      }
      console.log(newArray);
      
      songs = newArray;
      
      requestNew();
    }
    
    if(data.msgType == "requestReturn") {
      var songInfo = data.msg;
      for(var i = 0; i < songs.length; i++) {
        var currentSong = songs[i];
        if(songInfo[0] == currentSong.name) {
          currentSong.size = Number.parseInt(songInfo[1]);
          currentSong.uri = songInfo[2];
          
          console.log("Request satisfied for: "+songInfo[0]);
          break;
        }
      }
      requestNew();
    }
    
    if(data.msgType == "currentSongInfo") {
      
      console.log("Recieved next song info");
      
      var currentSongTitle = data.msg[0];
      
      for(var i = 0; i < songs.length; i++) {
        var currentSong = songs[i];
        if(currentSong.name == currentSongTitle) {
          info.textContent = currentSong.name;
          pausedTxt.style.display = "none";

          audio.src = currentSong.uri;
          
          var timeDifference = Number.parseInt((Date.now() - data.msg[2]))/1000;
          
          audio.currentTime = data.msg[1] + timeDifference;
          audio.play();
          
          break;
        }
      }
    }
    
    if(data.msgType == "paused") {
      audio.pause();
      pausedTxt.style.display = "block";
    }
  });
  
  function requestNew() {
    for(var i = 0; i < songs.length; i++) {
      var currentSong = songs[i];
      if(currentSong.size == -1) {
        conn.send(
          {
            msgType: "requestNew",
            msg: currentSong.name
          }
        );
        
        console.log("Requesting: "+currentSong.name);
        break;
      }
    }
  }
}

function songObj (name, size, uri) {
  this.name = name;
  this.size = size;
  this.uri = uri;
}