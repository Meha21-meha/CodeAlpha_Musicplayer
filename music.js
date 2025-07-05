const musicContainer = document.getElementById('music-container');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

const audio = document.getElementById('audio');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');
const title = document.getElementById('title');
const cover = document.getElementById('cover');
const artist = document.getElementById('artist');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const volumeControl = document.getElementById('volume');
const playlist = document.getElementById('playlist');


// Song titles
const songs = [
  { title: 'hey', artist: 'john Doe' },
  { title: 'summer', artist: 'Bob' },
  { title: 'ukulele', artist: 'smith' },
  { title: 'daydreamer', artist: 'karl' },
  { title: 'fallen', artist: 'Bob' },
  { title: 'memories', artist: 'smith' },
  { title: 'soaked', artist: 'freak' },
  { title: 'harmony', artist: 'Unknown Artist' }
];

// Keep track of song
let songIndex = 1;

// Initially load song details into DOM and playlist

loadSong(songs[songIndex]);
loadPlaylist();


// Update song details

function loadSong(song) {
  title.innerText = song.title;
  artist.innerText = song.artist;
  audio.src = `music/${song.title}.mp3`;

  const testImage = new Image();
  testImage.onload = function () {
    cover.src = `images/${song.title}.webp`;
  };
  testImage.onerror = function () {
    cover.src = `images/${song.title}.jpg`;
  };
  testImage.src = `images/${song.title}.webp`;

  updatePlaylistUI();
}
 //load playlist
function loadPlaylist() {
  playlist.innerHTML = '';
  songs.forEach((song, index) => {
    const li = document.createElement('li');
    li.innerText = `${song.title} - ${song.artist}`;
    li.dataset.index = index;
    if (index === songIndex) {
      li.classList.add('active');
    }
    li.addEventListener('click', () => {
      songIndex = index;
      loadSong(songs[songIndex]);
      playSong();
    });
    playlist.appendChild(li);
  });
}

function updatePlaylistUI() {
  const playlistItems = playlist.querySelectorAll('li');
  playlistItems.forEach((item, index) => {
    item.classList.toggle('active', index === songIndex);
  });
}

// Play song
function playSong() {
  musicContainer.classList.add('play');
  playBtn.querySelector('i.fas').classList.remove('fa-play');
  playBtn.querySelector('i.fas').classList.add('fa-pause');

  audio.play();
}

// Pause song
function pauseSong() {
  musicContainer.classList.remove('play');
  playBtn.querySelector('i.fas').classList.add('fa-play');
  playBtn.querySelector('i.fas').classList.remove('fa-pause');

  audio.pause();
}

// Previous song
function prevSong() {
  songIndex--;

  if (songIndex < 0) {
    songIndex = songs.length - 1;
  }

  loadSong(songs[songIndex]);

  playSong();
}

// Next song
function nextSong() {
  songIndex++;

  if (songIndex > songs.length - 1) {
    songIndex = 0;
  }

  loadSong(songs[songIndex]);

  playSong();
}

// Update progress bar

function updateProgress(e) {
  const { duration, currentTime } = e.srcElement;
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;

  const currentMinutes = Math.floor(currentTime / 60);
  let currentSeconds = Math.floor(currentTime % 60);
  if (currentSeconds < 10) {
    currentSeconds = `0${currentSeconds}`;
  }
  currentTimeEl.innerText = `${currentMinutes}:${currentSeconds}`;

  if (duration) {
    const durationMinutes = Math.floor(duration / 60);
    let durationSeconds = Math.floor(duration % 60);
    if (durationSeconds < 10) {
      durationSeconds = `0${durationSeconds}`;
    }
    durationEl.innerText = `${durationMinutes}:${durationSeconds}`;
  }
}
  //change volume
     function setVolume() {
  audio.volume = volumeControl.value;
}

audio.addEventListener('loadedmetadata', () => {
  const durationMinutes = Math.floor(audio.duration / 60);
  let durationSeconds = Math.floor(audio.duration % 60);
  if (durationSeconds < 10) {
    durationSeconds = `0${durationSeconds}`;
  }
  durationEl.innerText = `${durationMinutes}:${durationSeconds}`;
});

volumeControl.addEventListener('input', setVolume);
// Set progress bar
function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;

  audio.currentTime = (clickX / width) * duration;
}

// Event listeners
playBtn.addEventListener('click', () => {
  const isPlaying = musicContainer.classList.contains('play');

  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
});

// Change song
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

// Time/song update
audio.addEventListener('timeupdate', updateProgress);

// Click on progress bar
progressContainer.addEventListener('click', setProgress);

// Song ends
audio.addEventListener('ended', nextSong);



