$.getJSON("https://raw.githubusercontent.com/solanalibrary/solanalibrary/main/playlist.json", function(items) {
    //https://521dimensions.com/open-source/amplitudejs/docs
    Amplitude.init({
        songs: items,
        continue_next: false,
        callbacks: {
          timeupdate: function(){
              const active_index = Amplitude.getActiveIndex();
              const duration = Amplitude.getSongPlayedSeconds()
              if (duration > 30) {
                setCookie("ama", active_index, 7);
                setCookie("seconds", Math.floor(duration), 7);
              }
          },
          song_change: function(){
              eraseCookie("ama");
          }
        }
    });
    // https://stackoverflow.com/questions/51081488/continue-song-on-the-next-page-with-amplitude-js
    var playlist = document.getElementsByClassName("white-player-playlist")[0];

    for(var i = items.length - 1; i >= 0 ; i--) {
        var container = document.createElement("div");
        
        container.className = "white-player-playlist-song amplitude-song-container amplitude-play-pause";
        container.setAttribute('data-amplitude-song-index', i.toString());

        container.innerHTML = `
        <img src="${items[i].cover_art_url}"/>
        <div class="playlist-song-meta">
          <span class="playlist-song-name">${items[i].name}</span>
          <span class="playlist-artist-album">${items[i].album}</span>
        </div>
        `;
        playlist.appendChild(container);

    }

    recoverAMA(items.length - 1);
    Amplitude.bindNewElements();

});


/*
  Shows the playlist
*/
document.getElementsByClassName('show-playlist')[0].addEventListener('click', function(){
  document.getElementById('white-player-playlist-container').classList.remove('slide-out-top');
  document.getElementById('white-player-playlist-container').classList.add('slide-in-top');
  document.getElementById('white-player-playlist-container').style.display = "block";
});

/*
  Hides the playlist
*/
document.getElementsByClassName('close-playlist')[0].addEventListener('click', function(){
  document.getElementById('white-player-playlist-container').classList.remove('slide-in-top');
  document.getElementById('white-player-playlist-container').classList.add('slide-out-top');
  document.getElementById('white-player-playlist-container').style.display = "none";
});


/*
  Gets all of the add to playlist buttons so we can
  add some event listeners to actually add to playlist.
*/
var addToPlaylistButtons = document.getElementsByClassName('add-to-playlist-button');

for( var i = 0; i < addToPlaylistButtons.length; i++ ){
  /*
    Add an event listener to the add to playlist button.
  */
  addToPlaylistButtons[i].addEventListener('click', function(){
    var songToAddIndex = this.getAttribute('song-to-add');

    /*
      Adds the song to Amplitude, appends the song to the display,
      then rebinds all of the AmplitudeJS elements.
    */
    var newIndex = Amplitude.addSong( songsToAdd[ songToAddIndex ] );
    appendToSongDisplay( songsToAdd[ songToAddIndex ], newIndex );
    Amplitude.bindNewElements();

    /*
      Removes the container that contained the add to playlist button.
    */
    var songToAddRemove = document.querySelector('.song-to-add[song-to-add="'+songToAddIndex+'"]');
    songToAddRemove.parentNode.removeChild( songToAddRemove );
  });
}

/*
  Appends the song to the display.
*/
function appendToSongDisplay( song, index ){
  /*
    Grabs the playlist element we will be appending to.
  */
  var playlistElement = document.querySelector('.white-player-playlist');

  /*
    Creates the playlist song element
  */
  var playlistSong = document.createElement('div');
  playlistSong.setAttribute('class', 'white-player-playlist-song amplitude-song-container amplitude-play-pause');
  playlistSong.setAttribute('data-amplitude-song-index', index);

  /*
    Creates the playlist song image element
  */
  var playlistSongImg = document.createElement('img');
  playlistSongImg.setAttribute('src', song.cover_art_url);

  /*
    Creates the playlist song meta element
  */
  var playlistSongMeta = document.createElement('div');
  playlistSongMeta.setAttribute('class', 'playlist-song-meta');

  /*
    Creates the playlist song name element
  */
  var playlistSongName = document.createElement('span');
  playlistSongName.setAttribute('class', 'playlist-song-name');
  playlistSongName.innerHTML = song.name;

  /*
    Creates the playlist song artist album element
  */
  var playlistSongArtistAlbum = document.createElement('span');
  playlistSongArtistAlbum.setAttribute('class', 'playlist-song-artist');
  playlistSongArtistAlbum.innerHTML = song.artist+' &bull; '+song.album;

  /*
    Appends the name and artist album to the playlist song meta.
  */
  playlistSongMeta.appendChild( playlistSongName );
  playlistSongMeta.appendChild( playlistSongArtistAlbum );

  /*
    Appends the song image and meta to the song element
  */
  playlistSong.appendChild( playlistSongImg );
  playlistSong.appendChild( playlistSongMeta );

  /*
    Appends the song element to the playlist
  */
  playlistElement.appendChild( playlistSong );
}


function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}


function eraseCookie(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}


function recoverAMA(default_ama) {
  const ama_id = getCookie("ama");
  if (ama_id != "" & ama_id != null) {
    const seconds = getCookie("seconds");
    console.log(`You were listening to ${ama_id} at ${seconds}`);
    Amplitude.skipTo(seconds, ama_id);
  } else {
    setCookie("ama", default_ama, 7);
    setCookie("seconds", 0, 7);
    Amplitude.skipTo(0, default_ama);
  }
}