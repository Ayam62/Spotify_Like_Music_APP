
let songs = [];
const prevBtn = document.querySelector(".prev ");
const playBtn = document.querySelector(".play ");
const nxtBtn = document.querySelector(".next ");
const songListBox = document.querySelector(".song-list ul");
const songProgress = document.querySelector(".songtime");
const songInfo = document.querySelector(".songinfo");
const circle = document.querySelector(".circle");
const seekBar=document.querySelector(".seekbar")
const hamBurger=document.querySelector(".hamBurger")
const leftDiv=document.querySelector(".left")
const rightDiv=document.querySelector(".right")
const close=document.querySelector(".close")
const cardContainer=document.querySelector(".cardContainer")



let songId;
let lis, lisArr;
let play = true;
let nowSong = new Audio();
let timeProgress,totalTime;


//  for(let i=0;i<2;i++){
getSongs();
//  }
function getSongs() {
  const url =`http://127.0.0.1:5501/songs/`;
  fetch(url)
    .then((response) => response.text()) // Await the text() Promise
    .then((data) => {
      let div = document.createElement("div");
      div.innerHTML = data;
      let as = div.getElementsByTagName("a");
      for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {
          songs.push(element.href);
        }
      }
       createSongList();
    })
    .catch((error) => {
      console.log(error); // Handle any errors here
    });
}

function createSongList() {
  for (let i = 0; i < songs.length; i++) {
    const li = document.createElement("li");
    songs[i] = songs[i].replaceAll("%20", " ");
    console.log(songs[i]);
    let songName = songs[i].split(`/songs/`)[1];
    li.innerHTML = `
                <div class="flex g-1">
                <img class="music" src="./svgs/music.svg" />
                <div class="info">
                
                  <div class="songName">${songName}</div>
                  <div class="songArtist">Ayam</div>
                </div>
                </div>
                <img class="invert"  src="./svgs/play.svg">`;
    songListBox.appendChild(li);     
  }
  const div = document.createElement("div");
  div.innerHTML=` <div class="card">
            <img
              src="./svgs/musicCard.svg"
            />
            <img class="greenPlay" src="./svgs/playSub.svg" alt="" height="50px" width="50px">
            <h2>${"folder"}</h2>
            <p>Ayam</p>
          </div>`
   cardContainer.appendChild(div)  
  findAllLis();
}

function findAllLis() {
  let lis = document.querySelectorAll(".song-list  li");
  lisArr = Array.from(lis);
  for (let i = 0; i < lisArr.length; i++) {
    lisArr[i].addEventListener("click", () => {
      playSong(i);
    });
  }
}

function playSong(i) {
  pausePlay();
  songId = i;
  play = false;
  nowSong.src = songs[i];
  giveSongInfo(nowSong.src);
  nowSong.play();
}

playBtn.addEventListener("click", () => {
  pausePlayClick();

  if (play) {
    if (!nowSong.src) {
      playSong(0);
    } else {
      nowSong.play();
    }
    play = false;
  } else {
    nowSong.pause();
    play = true;
  }
});
nxtBtn.addEventListener("click", () => {
  if (songId < lisArr.length - 1) {
    songId += 1;
    playSong(songId);
  } else {
    playSong(0);
  }
});

prevBtn.addEventListener("click", () => {
  if (songId >= 0) {
    songId -= 1;
    playSong(songId);
  } else {
    playSong(0);
  }
});

function pausePlay() {
  if (nowSong.play()) {
    playBtn.setAttribute("src", "./svgs/pause.svg");
  } else {
    playBtn.setAttribute("src", "./svgs/play.svg");
  }
}

function pausePlayClick() {
  if (play) {
    playBtn.setAttribute("src", "./svgs/pause.svg");
  } else {
    playBtn.setAttribute("src", "./svgs/play.svg");
  }
}

nowSong.addEventListener("timeupdate", (e) => {
  timeProgress = nowSong.currentTime.toFixed(0);
  totalTime = nowSong.duration.toFixed(0);
  circle.style.left = `${(timeProgress / totalTime) * 100-1}%`;
  showCurrentTime(timeProgress, totalTime);
});

function showCurrentTime(timeProgress, totalTime) {
  let timeInSeconds, timeInMinutes, totalTimeInSeconds, totalTimeInMinutes;
  timeInSeconds = timeProgress % 60;
  timeInMinutes = Math.floor(timeProgress / 60);

  totalTimeInSeconds = totalTime % 60;
  totalTimeInMinutes = Math.floor(totalTime / 60);

  songProgress.innerHTML = `${timeInMinutes}:${
    timeInSeconds < 10 ? `0${timeInSeconds}` : timeInSeconds
  }/${totalTimeInMinutes}:${
    totalTimeInSeconds < 10 ? `0${totalTimeInSeconds}` : totalTimeInSeconds
  } `;
}

function giveSongInfo(info) {
  cleanName = info.split("/")[4];
  cleanName = cleanName.replaceAll("%20", "");
  songInfo.innerHTML = cleanName;
}

seekBar.addEventListener("click",(e)=>{
    // console.log(e.layerX,e.target.getBoundingClientRect().width)
    totalLengthBar=e.target.getBoundingClientRect().width;
    decimalClick=(e.layerX/totalLengthBar);
    circle.style.left=`${decimalClick*100}%`;
    nowSong.currentTime=decimalClick*totalTime;

    // timeProgress=percentageClick*nowSong.duration;
    // totalTime = nowSong.duration.toFixed(0);
})

hamBurger.addEventListener("click",()=>{
    leftDiv.style.left="0px";
})

close.addEventListener("click",()=>{
    leftDiv.style.left="-700px";
})

