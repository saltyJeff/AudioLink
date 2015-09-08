var songList = document.getElementById("songList");
var tabs = document.getElementById("tabs");
var pages = document.getElementById("pages");

tabs.addEventListener('iron-select',function(){
  pages.selected = tabs.selected;
});
//Slip.js Part
new Slip(songList);

songList.addEventListener('slip:reorder', function(e) {
    e.target.parentNode.insertBefore(e.target, e.detail.insertBefore);

  if(e.target == songList.children[0]) {
      prepSong();
      play();
    }
  
    updateOrder();
});
songList.addEventListener('slip:swipe', function(e) {
  var first = false;

  if(e.target == songList.children[0]) {
    first = true;
  }
  e.target.parentNode.removeChild(e.target);

  if(first) {
    prepSong();
  }
  
  updateOrder();
});

function loadSong(obj) {

  pages.selected = 1;
  tabs.selected = 1;

  for(var i = 0; i < obj.files.length; i++) {
    var currentFile = obj.files[i];

    if(currentFile.type != "audio/mp3") {
      console.error("Not a mp3 or a ogg, is a "+currentFile.type);
      continue;
    }

    var size = currentFile.size;
    var name = currentFile.name;
    var URI = "";

    var reader = new FileReader();

    reader.onload = function (result) {
      URI = reader.result;
      var newSong = Song(name, size, URI);

      console.log("Created a new Song named "+name+" that is "+size+" bits big");
      songList.appendChild(newSong);
      updateOrder();
      
      if(songList.children.length == 1) {
        prepSong();
        document.getElementById("playButton").click();
      }
    }

    reader.readAsDataURL(currentFile);
  }
  
}

function Song(name, size, URI) {
  var newObj = document.createElement("paper-button");
  Polymer.dom(newObj).textContent = name;
  newObj.setAttribute("size", size);
  newObj.setAttribute("URI", URI);
  newObj.setAttribute("raised","");
  newObj.classList.add("songButton");
  return newObj;
}
