var songList = document.getElementById("songList");
var audio = document.getElementById("sound");
var songTitle = document.getElementById("songTitle");

audio.addEventListener("ended", function(e) {
  nextSong();
});

function prepSong() {
  var currentSong = songList.children[0];
  audio.src = currentSong.getAttribute("uri");
  songTitle.textContent = "Now Playing: "+Polymer.dom(currentSong).textContent;
  sendSongInfo();
}

var playButton = document.getElementById("playButton");
function playButtonClick() {
  if(audio.src == "") {
    return;
  }
  if(audio.paused) {
    play();
    Polymer.dom(playButton).textContent = "Pause ||";
    sendSongInfo();
  }
  else {
    audio.pause();
    sendPause();
    Polymer.dom(playButton).textContent = "Play >>";
  }
}

function play() {
  if(audio.paused) {
    audio.play();
    Polymer.dom(playButton).textContent = "Pause ||";
    sendSongInfo();
  }
}

function nextSong() {
  console.log("Next Song");
  var currentSong = songList.children[0];
  songList.insertBefore(currentSong, null);
  prepSong();
  play();
  sendSongInfo();
}

function lastSong() {
  console.log("Last Song");
  var lastSong = songList.children[songList.children.length - 1];
  var currentSong = songList.children[0];
  songList.insertBefore(lastSong, currentSong);
  prepSong();
  play();
  sendSongInfo();
}