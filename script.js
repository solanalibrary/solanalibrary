$.getJSON("https://raw.githubusercontent.com/solanalibrary/solanalibrary/main/playlist.json", function(items) {
    //console.log(json); // this will show the info it in firebug console
    Amplitude.init({
        songs: items,
    });
    var playlist = document.getElementsByClassName("white-player-playlist")[0];

    for(var i = 0; i < items.length; i++) {
        //var h5 = document.createElement("h5");
        //h5.innerHTML = items[i].title;
        //news.appendChild(h5);
        //var p = document.createElement("p");
        //p.innerHTML = items[i].author;
        //news.appendChild(p);
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

    Amplitude.bindNewElements();
});

/*
<div class="white-player-playlist-song amplitude-song-container amplitude-play-pause" data-amplitude-song-index="0">
  <img src="https://521dimensions.com/img/open-source/amplitudejs/album-art/we-are-to-answer.jpg"/>

  <div class="playlist-song-meta">
    <span class="playlist-song-name">Risin' High (feat Raashan Ahmad)</span>
    <span class="playlist-artist-album">Ancient Astronauts &bull; We Are to Answer</span>
  </div>
</div>
*/


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
