const image = document.getElementById('cover'),
    title = document.getElementById('music-title'),
    artist = document.getElementById('music-artist'),
    currentTimeEl = document.getElementById('current-time'),
    durationEl = document.getElementById('duration'),
    progress = document.getElementById('progress'),
    playerProgress = document.getElementById('player-progress'),
    prevBtn = document.getElementById('prev'),
    nextBtn = document.getElementById('next'),
    playBtn = document.getElementById('play'),
    background = document.getElementById('bg-img');

const music = new Audio();

const songs = [
    {
        path: 'song/1.mp3',
        displayName: 'Bambholle-Laxmii',
        cover: 'img/1.jpg',
        artist: 'ViruSs',
    },
    {
        path: 'song/2.mp3',
        displayName: 'Humnava Mere',
        cover: 'img/2.jpg',
        artist: ' Jubin Nautiyal',
    },
    {
        path: 'song/3.mp3',
        displayName: 'Yalgaar',
        cover: 'img/3.jpg',
        artist: ' Ajey Nagar',
    },
    {
        path: 'song/4.mp3',
        displayName: 'Made in India',
        cover: 'img/4.jpg',
        artist: 'Guru Randhawa',
    },
    {
        path: 'song/5.mp3',
        displayName: 'Fallin for You',
        cover: 'img/5.jpg',
        artist: ' Shrey Singhal',
    },
    {
        path: 'song/6.mp3',
        displayName: 'Ram Siya Ram',
        cover: 'img/6.jpg',
        artist: 'Sachet Tandon',
    },
    {
        path: 'song/7.mp3',
        displayName: 'Deva Shree Ganesha',
        cover: 'img/7.jpg',
        artist: 'Ajay Gogavale',
    },
    {
        path: 'song/8.mp3',
        displayName: 'Senorita',
        cover: 'img/8.jpg',
        artist: 'Shawn Mendes',
    },
    {
        path: 'song/9.mp3',
        displayName: 'Alone',
        cover: 'img/9.jpg',
        artist: 'Alan Walker',
    },
    {
        path: 'song/10.mp3',
        displayName: 'Stay',
        cover: 'img/10.jpg',
        artist: 'Kid LAROI, Justin Bieber',
    },
    {
        path: 'song/11.mp3',
        displayName: 'Lovely',
        cover: 'img/11.jpg',
        artist: ' Billie Eilish, Khalid ',
    },
    {
        path: 'song/12.mp3',
        displayName: 'Shiv Tandav Stotram',
        cover: 'img/12.jpg',
        artist: ' Shankar Mahadevan  ',
    },
    {
        path: 'song/13.mp3',
        displayName: 'Shree Hanuman Chalisa',
        cover: 'img/13.jpg',
        artist: 'Shankar Mahadevan, Ajay Gogavale  ',
    }
];

let musicIndex = 0;
let isPlaying = false;

function togglePlay() {
    if (isPlaying) {
        pauseMusic();
    } else {
        playMusic();
    }
}

function playMusic() {
    isPlaying = true;
    // Change play button icon
    playBtn.classList.replace('fa-play', 'fa-pause');
    // Set button hover title
    playBtn.setAttribute('title', 'Pause');
    music.play();
}

function pauseMusic() {
    isPlaying = false;
    // Change pause button icon
    playBtn.classList.replace('fa-pause', 'fa-play');
    // Set button hover title
    playBtn.setAttribute('title', 'Play');
    music.pause();
}

function loadMusic(song) {
    music.src = song.path;
    title.textContent = song.displayName;
    artist.textContent = song.artist;
    image.src = song.cover;
    background.src = song.cover;
}

function changeMusic(direction) {
    musicIndex = (musicIndex + direction + songs.length) % songs.length;
    loadMusic(songs[musicIndex]);
    playMusic();
}

function updateProgressBar() {
    const { duration, currentTime } = music;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;

    const formatTime = (time) => String(Math.floor(time)).padStart(2, '0');
    durationEl.textContent = `${formatTime(duration / 60)}:${formatTime(duration % 60)}`;
    currentTimeEl.textContent = `${formatTime(currentTime / 60)}:${formatTime(currentTime % 60)}`;
}

function setProgressBar(e) {
    const width = playerProgress.clientWidth;
    const clickX = e.offsetX;
    music.currentTime = (clickX / width) * music.duration;
}

playBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', () => changeMusic(-1));
nextBtn.addEventListener('click', () => changeMusic(1));
music.addEventListener('ended', () => changeMusic(1));
music.addEventListener('timeupdate', updateProgressBar);
playerProgress.addEventListener('click', setProgressBar);

loadMusic(songs[musicIndex]);