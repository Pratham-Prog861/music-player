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
    background = document.getElementById('bg-img'),
    searchInput = document.getElementById('search-input'),
    searchBtn = document.getElementById('search-btn'),
    searchSuggestions = document.getElementById('search-suggestions');

let debounceTimeout;
const music = new Audio();

// Change const to let for songs array
let songs = [
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
    
    // Ensure background image is visible
    background.style.opacity = '1';
    image.classList.add('active');
    
    // Reset progress bar
    progress.style.width = '0%';
    currentTimeEl.textContent = '0:00';
    
    // Wait for duration to be loaded
    music.addEventListener('loadedmetadata', () => {
        const minutes = Math.floor(music.duration / 60);
        const seconds = Math.floor(music.duration % 60);
        durationEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    });
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

// Add your Deezer API search function
async function searchSongs(query) {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com',
            'X-RapidAPI-Key': 'be5038084bmsh6164ec659d9b6dcp186095jsn62eaa75ee625'
        }
    };

    try {
        const response = await fetch(`https://deezerdevs-deezer.p.rapidapi.com/search?q=${encodeURIComponent(query)}`, options);
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error searching songs:', error);
        return [];
    }
}

async function getTrackDetails(trackId) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener('readystatechange', function () {
            if (this.readyState === this.DONE) {
                if (this.status === 200) {
                    resolve(JSON.parse(this.responseText));
                } else {
                    reject(new Error('Failed to fetch track details'));
                }
            }
        });

        xhr.open('GET', `https://deezerdevs-deezer.p.rapidapi.com/track/${trackId}`);
        xhr.setRequestHeader('x-rapidapi-key', 'be5038084bmsh6164ec659d9b6dcp186095jsn62eaa75ee625');
        xhr.setRequestHeader('x-rapidapi-host', 'deezerdevs-deezer.p.rapidapi.com');

        xhr.send(null);
    });
}

// Update handleSearch function
async function handleSearch() {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) return;

    // First, search in local songs
    const localResults = songs.filter(song => 
        song.displayName.toLowerCase().includes(query) || 
        song.artist.toLowerCase().includes(query)
    );

    if (localResults.length > 0) {
        // Load the first matching local song
        musicIndex = songs.indexOf(localResults[0]);
        loadMusic(localResults[0]);
        playMusic();
        return;
    }

    // If no local results, search using API
    try {
        const searchResults = await searchSongs(query);
        if (searchResults && searchResults.length > 0) {
            const trackDetails = await getTrackDetails(searchResults[0].id);
            
            songs = [{
                path: trackDetails.preview,
                displayName: trackDetails.title,
                artist: trackDetails.artist.name,
                cover: trackDetails.album.cover_xl,
                background: trackDetails.album.cover_xl
            }];
            
            musicIndex = 0;
            loadMusic(songs[0]);
            playMusic();
        }
    } catch (error) {
        console.error('Error handling search:', error);
    }
}

// Update handleSearchInput function to include local results
async function handleSearchInput(e) {
    clearTimeout(debounceTimeout);
    const query = e.target.value.trim().toLowerCase();
    
    if (query.length < 2) {
        searchSuggestions.innerHTML = '';
        searchSuggestions.classList.remove('active');
        return;
    }

    debounceTimeout = setTimeout(async () => {
        try {
            // Search in local songs first
            const localResults = songs.filter(song => 
                song.displayName.toLowerCase().includes(query) || 
                song.artist.toLowerCase().includes(query)
            ).slice(0, 3);

            // Get API results
            const apiResults = await searchSongs(query);
            const combinedResults = [
                ...localResults.map(song => ({
                    ...song,
                    isLocal: true
                })),
                ...(apiResults || []).slice(0, 3).map(song => ({
                    title: song.title,
                    artist: { name: song.artist.name },
                    album: { cover_small: song.album.cover_small },
                    isLocal: false,
                    apiData: song
                }))
            ];

            if (combinedResults.length > 0) {
                searchSuggestions.innerHTML = combinedResults.map(song => `
                    <div class="suggestion-item" data-song-index="${combinedResults.indexOf(song)}" data-is-local="${song.isLocal}">
                        <img src="${song.isLocal ? song.cover : song.album.cover_small}" alt="${song.isLocal ? song.displayName : song.title}">
                        <div class="suggestion-info">
                            <div class="suggestion-title">${song.isLocal ? song.displayName : song.title}</div>
                            <div class="suggestion-artist">${song.isLocal ? song.artist : song.artist.name}</div>
                        </div>
                    </div>
                `).join('');
                searchSuggestions.classList.add('active');

                // Update click handlers
                document.querySelectorAll('.suggestion-item').forEach((item, index) => {
                    item.addEventListener('click', () => {
                        const result = combinedResults[index];
                        if (result.isLocal) {
                            musicIndex = songs.indexOf(result);
                            loadMusic(result);
                        } else {
                            loadSearchResult(result.apiData);
                        }
                        searchSuggestions.classList.remove('active');
                        searchInput.value = result.isLocal ? result.displayName : result.title;
                        playMusic();
                    });
                });
            }
        } catch (error) {
            console.error('Error getting suggestions:', error);
        }
    }, 300);
}

// Add this function to load selected search result
function loadSearchResult(song) {
    const playerSong = {
        path: song.preview,
        displayName: song.title,
        artist: song.artist.name,
        cover: song.album.cover_medium
    };
    
    loadMusic(playerSong);
    playMusic();
}

// Update event listeners
searchInput.addEventListener('input', handleSearchInput);
document.addEventListener('click', (e) => {
    if (!searchSuggestions.contains(e.target) && e.target !== searchInput) {
        searchSuggestions.classList.remove('active');
    }
});

// Add after your existing variable declarations
const downloadBtn = document.getElementById('download');

// Add the download functionality
async function downloadCurrentSong() {
    try {
        const response = await fetch(music.src);
        const blob = await response.blob();
        
        // Create a temporary link element
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        
        // Set the download filename
        const fileName = `${title.textContent} - ${artist.textContent}.mp3`;
        downloadLink.download = fileName;
        
        // Append to body, click, and remove
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        // Clean up the URL object
        URL.revokeObjectURL(downloadLink.href);
    } catch (error) {
        console.error('Error downloading song:', error);
        alert('Failed to download the song. Please try again.');
    }
}

// Add event listener for download button
downloadBtn.addEventListener('click', downloadCurrentSong);

// Add keyboard controls
// Update the keyboard controls section
document.addEventListener('keydown', (e) => {
    // Space bar - Play/Pause
    if (e.code === 'Space' && !e.ctrlKey) {
        e.preventDefault(); // Prevent page scroll
        if (isPlaying) {
            pauseMusic();
        } else {
            playMusic();
        }
    }

    // Right arrow - Next song
    if (e.code === 'ArrowRight') {
        changeMusic(1);
    }

    // Left arrow - Previous song
    if (e.code === 'ArrowLeft') {
        changeMusic(-1);
    }

    // Ctrl + K or Forward Slash for search focus
    if ((e.code === 'KeyK' && (e.ctrlKey || e.metaKey)) || (!e.ctrlKey && !e.metaKey && e.key === '/')) {
        e.preventDefault();
        searchInput.focus();
        // Clear the input when using slash key
        if (e.key === '/') {
            searchInput.value = '';
        }
    }

    // K - Download current song
    if (e.code === 'KeyK' && !e.ctrlKey) {
        downloadCurrentSong();
    }
});

// Add this to help users discover shortcuts
// searchInput is already declared at the top of the file
// No need to redeclare it
searchInput.setAttribute('placeholder', 'Search songs (Ctrl + K or /)');