const mediaData = [
{
  author: 'Freedom Trail Studio',
  authorUrl: 'https://www.youtube.com/channel/UCx6kpgiQkDkN1UnK5GaATGw',
  fileName: 'Swing Theory',
  fileUrl: 'https://s3-ap-northeast-1.amazonaws.com/dazedbear-assets/custom-audio-player/Swing_Theory.mp3',
  thumb: 'https://s3-ap-northeast-1.amazonaws.com/dazedbear-assets/custom-audio-player/15367448967_0551dce9c1_q.jpg' },

{
  author: 'Huma-Huma',
  authorUrl: '',
  fileName: "It's All Happening",
  fileUrl: 'https://s3-ap-northeast-1.amazonaws.com/dazedbear-assets/custom-audio-player/It_s_All_Happening.mp3',
  thumb: 'https://s3-ap-northeast-1.amazonaws.com/dazedbear-assets/custom-audio-player/34347642316_fe2f354cfd_q.jpg' },

{
  author: 'Danny Kean/Doug Maxwell',
  authorUrl: 'https://www.youtube.com/channel/UCwhJTv7O8EmDwyvqMBLHcHg',
  fileName: "So Smooth",
  fileUrl: 'https://s3-ap-northeast-1.amazonaws.com/dazedbear-assets/custom-audio-player/So_Smooth.mp3',
  thumb: 'https://s3-ap-northeast-1.amazonaws.com/dazedbear-assets/custom-audio-player/36981460496_80c2c2bce5_q.jpg' },

{
  author: 'Silent Partner',
  authorUrl: '',
  fileName: "Sinking Ship",
  fileUrl: 'https://s3-ap-northeast-1.amazonaws.com/dazedbear-assets/custom-audio-player/Sinking_Ship.mp3',
  thumb: 'https://s3-ap-northeast-1.amazonaws.com/dazedbear-assets/custom-audio-player/38552225096_84b69eb7aa_q.jpg' },

{
  author: 'Jimmy Fontanez/Doug Maxwell',
  authorUrl: 'https://www.youtube.com/channel/UCwhJTv7O8EmDwyvqMBLHcHg',
  fileName: "Trap Unboxing",
  fileUrl: 'https://s3-ap-northeast-1.amazonaws.com/dazedbear-assets/custom-audio-player/Trap_Unboxing.mp3',
  thumb: 'https://s3-ap-northeast-1.amazonaws.com/dazedbear-assets/custom-audio-player/41451305061_f0bd9717be_q.jpg' }];



// 格式化秒數
const formatTime = sec => {
  const fillZero = num => num < 10 ? `0${num}` : num;

  // FIXME:
  const hour = Math.floor(sec / 3600);
  const minute = Math.floor(sec % 3600 / 60);
  const secs = Math.floor(sec - 3600 * hour - 60 * minute);
  return hour > 0 ?
  `${fillZero(hour)}:${fillZero(minute)}:${fillZero(secs)}` :
  `${fillZero(minute)}:${fillZero(secs)}`;
};

/**
 * 播放器功能
 */
class AudioPlayer {
  constructor(playlist) {
    this.audioPlayer = new Audio();

    this.playList = playlist || [];
    this.playMode = 'step';
    this.currentIdx = 0;
    this.isPlaying = false;
    // internal: volume
    // internal: duration
    // internal: currentTime

    this.initEvents();
    this.setCurrentMusic();
  }

  // 內部註冊的事件
  initEvents() {
    // 建立自訂事件
    this.event = {
      current: new Event("currentmusicchange"),
      playMode: new Event("playmodechange"),
      playList: new Event("playlistchange"),
      isPlaying: new Event("playstatuschange") };


    // 換歌時讀到歌曲總時間才算完成更換
    this.audioPlayer.addEventListener('durationchange', () => {
      this.audioPlayer.dispatchEvent(this.event.current);
    });

    // 換歌時判斷是否繼續播放
    this.audioPlayer.addEventListener('currentmusicchange', () => {
      this.isPlaying ? this.audioPlayer.play() : this.audioPlayer.pause();
    });

    // 錯誤狀態停止播放
    this.audioPlayer.addEventListener('playing', () => this.setPlayStatus(true));
    this.audioPlayer.addEventListener('waiting', () => this.setPlayStatus(false));
    this.audioPlayer.addEventListener('error', () => this.setPlayStatus(false));
    this.audioPlayer.addEventListener('stalled', () => this.setPlayStatus(false));

    // 自動播下一首
    this.audioPlayer.addEventListener('ended', () => {
      const nextIdx = this.getNextMusicIdx();
      const stopWhenReachPlaylistEnd = this.playMode === 'step' && nextIdx === 0;
      this.setCurrentMusic(nextIdx);
      this.setPlayStatus(!stopWhenReachPlaylistEnd);
    });
  }

  // 對外暴露的註冊事件 callback
  // internal event: timeupdate, volumechange, durationchange
  // custom event: playmodechange, currentmusicchange, playlistchange, playstatuschange
  on(event, callback) {
    this.audioPlayer.addEventListener(event, callback);
  }

  // 指定並讀取當下要播放的音樂
  // identifier = prev, next, 0, <integer>
  setCurrentMusic(identifier = this.currentIdx) {
    if (Number.isInteger(identifier)) {
      if (identifier < 0 || identifier >= this.playList.length) return;
      this.currentIdx = identifier;
    } else if (typeof identifier === 'string') {
      const newIdx = this.getNextMusicIdx(identifier);
      if (!newIdx) return;
      this.currentIdx = newIdx;
    } else {
      console.error('不合法的 identifier in setCurrentMusic');
      return;
    }

    this.audioPlayer.setAttribute('src', this.getMediaInfo().fileUrl);
    this.audioPlayer.load();
  }

  // 取得指定的歌曲資訊
  getMediaInfo(idx = this.currentIdx) {
    if (!Number.isInteger(idx) || idx < 0 || idx >= this.playList.length) return {};
    return this.playList[this.currentIdx];
  }

  // 播放 / 暫停
  togglePlay(nextIsPlaying = !this.isPlaying) {
    if (nextIsPlaying) {
      // 播放
      this.audioPlayer.play().
      then(() => this.setPlayStatus(true)).
      catch(e => console.error('播放發生錯誤', e));
    } else {
      // 暫停
      this.audioPlayer.pause();
      this.setPlayStatus(false);
    }
  }

  // 調整播放模式
  setPlayMode(mode) {
    const validMode = ['step', 'shuffle', 'repeat-one', 'repeat-all'];
    if (validMode.indexOf(mode) !== -1) {
      this.playMode = mode;
      this.audioPlayer.dispatchEvent(this.event.playMode);
    }
  }

  // 調整播放狀態
  setPlayStatus(val) {
    if (typeof val !== 'boolean') return;
    this.isPlaying = val;
    this.audioPlayer.dispatchEvent(this.event.isPlaying);
  }

  // 取得下一首要播放的歌曲
  getNextMusicIdx(operation = this.playMode) {
    let nextIdx = 0;
    switch (operation) {
      case 'step':
        // 到播放清單底，結束播放
        if (this.currentIdx + 1 >= this.playList.length) this.audioPlayer.pause();
        nextIdx = this.currentIdx + 1 >= this.playList.length ? 0 : this.currentIdx + 1;
        break;

      case 'next':
      case 'repeat-all':
        nextIdx = this.currentIdx + 1 >= this.playList.length ? 0 : this.currentIdx + 1;
        break;

      case 'prev':
        nextIdx = this.currentIdx - 1 < 0 ? this.playList.length - 1 : this.currentIdx - 1;
        break;

      case 'shuffle':
        nextIdx = Math.floor(Math.random() * this.playList.length - 1);
        break;

      case 'repeat-one':
        nextIdx = this.currentIdx;
        break;

      default:
        console.log('不合法的操作', operation);
        return;}


    return nextIdx;
  }

  // 音量調整 (0 - 100)
  setVolume(vol) {
    if (typeof vol !== 'number') return;
    this.audioPlayer.volume = vol / 100;
  }

  // 進度條調整
  setCurrentTime(nextSec) {
    const currentMusic = this.getMediaInfo();
    if (!currentMusic) return;
    if (nextSec > currentMusic.duration) {
      this.audioPlayer.currentTime = 0;
    } else if (nextSec < 0) {
      this.audioPlayer.currentTime = 0;
    } else {
      this.audioPlayer.currentTime = nextSec;
    }
  }

  // 取得當前音量
  getVolume() {
    return this.audioPlayer.volume;
  }

  // 取得當前秒數
  getCurrentTime() {
    return this.audioPlayer.currentTime;
  }

  // 取得當前歌曲總長度
  getDuration() {
    return this.audioPlayer.duration;
  }

  // 取得當前播放模式
  getPlayMode() {
    return this.playMode;
  }

  // 取得當前播放狀態
  getIsPlaying() {
    return this.isPlaying;
  }}


/**
 * UI 互動
 */
$(document).ready(() => {
  // DOM elements
  const playBtn = $('#play'); // play_arrow, pause
  const prevBtn = $('#prev');
  const nextBtn = $('#next');
  const shuffleBtn = $('#shuffle');
  const repeatBtn = $('#repeat'); // repeat, repeat_one
  const volumeBtn = $('#volume');
  const volumeWrapper = $('#volume-wrapper');
  const queueBtn = $('#queue');
  const queueCloseBtn = $('#queue-close');
  const queueWrapper = $('#queue-wrapper');
  const timelineBg = $('#timeline-bg');
  const timelineBar = $('#timeline-bar');
  const timelineHandle = $('#timeline-handle');
  const passtime = $('#passtime');
  const duration = $('#duration');
  const volumeBg = $('#volume_bg');
  const volumeBar = $('#volume_bar');
  const volumeHandle = $('#volume_handle');

  // 歌曲資訊元件
  const MusicInfo = (info, idx) => {
    return `
			<div class="info">
				<img class="info__thumb" src="${info.thumb}"/>
				<div class="info__wrapper">
					<p class="info__author" title="${info.author || 'Author'}">${info.author || 'Author'}</p>
					<span class="info__name">${info.fileName || 'Song Name'}</span>
				</div>
			</div>
		`;
  };

  // 播放清單
  const renderPlaylist = playlist => {
    $('#playlist').html(mediaData.map((musicInfo, idx) => `<div id="queue-item-${idx}" class="queue__item">${MusicInfo(musicInfo)}</div>`));

    $('#playlist .queue__item').click(function () {
      const idx = parseInt($(this).attr('id').replace("queue-item-", ''));
      myAudio.setCurrentMusic(idx);
    });
  };

  // 當前播放歌曲資訊
  const renderCurrent = (info, currentTime, duration) => {
    $('#current-thumb').attr('src', info.thumb);
    $('#current-author').attr('href', info.authorUrl || '#');
    $('#current-author').html(info.author || 'Author');
    $('#current-name').html(info.fileName || 'Song Name');
    $('#passtime').html(formatTime(currentTime));
    $('#duration').html(formatTime(duration));
  };

  const myAudio = new AudioPlayer(mediaData);
  const timelineBarTotalLength = 250;
  const volumeBarTotalLength = 100;


  // 監聽事件顯示 UI
  myAudio.on('playstatuschange', () => playBtn.html(myAudio.getIsPlaying() ? 'pause' : 'play_arrow'));
  myAudio.on('playmodechange', () => {
    switch (myAudio.playMode) {
      case 'step':{
          shuffleBtn.removeClass('select');
          repeatBtn.removeClass('select');
          repeatBtn.html('repeat');
          break;
        }
      case 'shuffle':{
          shuffleBtn.addClass('select');
          repeatBtn.removeClass('select');
          repeatBtn.html('repeat');
          break;
        }
      case 'repeat-one':{
          shuffleBtn.removeClass('select');
          repeatBtn.addClass('select');
          repeatBtn.html('repeat_one');
          break;
        }
      case 'repeat-all':{
          shuffleBtn.removeClass('select');
          repeatBtn.addClass('select');
          repeatBtn.html('repeat');
          break;
        }
      default:
        return;}

  });
  myAudio.on('currentmusicchange', () => {
    const currentTime = myAudio.getCurrentTime();
    const duration = myAudio.getDuration();
    renderCurrent(myAudio.getMediaInfo(), myAudio.getCurrentTime(), myAudio.getDuration());
    passtime.html(formatTime(currentTime));
    timelineBar.width(`${currentTime / duration * timelineBarTotalLength}px`);
    timelineHandle.css('left', `${currentTime / duration * timelineBarTotalLength}px`);
  });
  myAudio.on('timeupdate', () => {
    const currentTime = myAudio.getCurrentTime();
    const duration = myAudio.getDuration();
    passtime.html(formatTime(currentTime));
    timelineBar.width(`${currentTime / duration * timelineBarTotalLength}px`);
    timelineHandle.css('left', `${currentTime / duration * timelineBarTotalLength}px`);
  });
  myAudio.on('volumechange', () => volumeBar.height(`${myAudio.getVolume() * volumeBarTotalLength}px`));

  // 播放 or 停止
  playBtn.click(() => myAudio.togglePlay());

  // 上一首歌 or 下一首歌
  prevBtn.click(() => myAudio.setCurrentMusic(myAudio.getNextMusicIdx('prev')));
  nextBtn.click(() => myAudio.setCurrentMusic(myAudio.getNextMusicIdx('next')));

  // shuffle 播放開關
  shuffleBtn.click(() => myAudio.setPlayMode(myAudio.getPlayMode() === 'shuffle' ? 'step' : 'shuffle'));

  // repeat 播放開關
  repeatBtn.click(() => {
    const playMode = myAudio.getPlayMode();
    if (playMode === 'repeat-one') {
      myAudio.setPlayMode('step');
    } else if (playMode === 'repeat-all') {
      myAudio.setPlayMode('repeat-one');
    } else {
      myAudio.setPlayMode('repeat-all');
    }
  });

  // 播放清單開關
  queueBtn.click(() => {
    queueWrapper.removeClass('hidden');
    queueBtn.addClass('select');
  });

  queueCloseBtn.click(() => {
    queueWrapper.addClass('hidden');
    queueBtn.removeClass('select');
  });

  // 音量調整面板
  volumeBtn.on('mouseenter', () => volumeWrapper.removeClass('hidden'));
  volumeWrapper.on('mouseleave', () => volumeWrapper.addClass('hidden'));

  // 拖動時間軸
  timelineHandle.draggable({
    axis: "x",
    containment: timelineBg,
    start: (event, ui) => myAudio.togglePlay(false),
    drag: (event, ui) => {
      const nextSec = Math.floor(ui.position.left * (myAudio.getDuration() / timelineBarTotalLength));
      passtime.html(formatTime(nextSec));
      timelineBar.width(`${ui.position.left}px`);
    },
    stop: (event, ui) => {
      const nextSec = Math.floor(ui.position.left * (myAudio.getDuration() / timelineBarTotalLength));
      myAudio.setCurrentTime(nextSec);
      myAudio.togglePlay(true);
    } });


  // 調整音量
  volumeHandle.draggable({
    axis: "y",
    containment: volumeBg,
    drag: (event, ui) => {
      const vol = volumeBarTotalLength - ui.position.top;
      volumeBar.height(`${vol}px`);
      myAudio.setVolume(vol);
    } });


  renderPlaylist(mediaData);
});