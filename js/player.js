const player = {
  audio: new Audio(),
  path: typeof tasker === 'undefined' ? "." : tasker.path,
  musicsPath: typeof tasker === 'undefined' ? "./src/musics" : tasker.musicsPath,
  internal: false,
  existStorage: false,
  isPlaying: false,
  statusRepeat: false,
  statusRandom: false,
  lastActiveFooter: false,
  observador: false,
  currentPlaying: 0,
  cardActive: false,
  currentAudio: {},
  musicsPlayed: [],
  observador: false,
  
  setContexts(){
    selectorsAndEvents.selectors.call(this)
    callbacks.functions.call(this)
    ultilities.functions.call(this)
    selectorsAndEvents.events.call(this)
    //this.activateDevTools()
  },
  async start() {
    //this.removeStorage()
    const hasStorageData = await this.checkStorageData()
    if(hasStorageData) this.assignSaveData()
    if(!hasStorageData && this.path != ".") this.listMusics()
    this.renderCardsMusics(audiosData.musics)
    if(audiosData.timeTotal) this.updateTimeTotal()
    if(!hasStorageData) this.calculateMusicsTimes()
    this.update()
  },
  update() {
    if(this.statusRandom) this.randomizeMusics()
    this.currentAudio = audiosData.musics[this.currentPlaying]
    this.audio.pause()
    this.audio.currentTime = 0
    this.audio.src = this.setPath(this.currentAudio.name)
    this.artist.textContent = this.splitName(this.currentAudio.name)
    this.activateCard()
    if(this.isPlaying) this.audio.play()
    
    this.btnPlayPause.src = `${this.path}/src/icons/${ this.isPlaying ? "pause" : "play"}.webp`
    
    if(12 == 56){
      ++audiosData.musics[this.currentPlaying].nReproduced
      this.saveData(audiosData)
    }
  },
  previous() {
    this.currentPlaying--
    if (this.currentPlaying < 0) this.currentPlaying = audiosData.musics.length - 1
    this.isPlaying = true
    this.update()
  },
  playPause() {
    if(this.isPlaying) {
      this.audio.pause()
      this.isPlaying = false
      this.btnPlayPause.src = `${this.path}/src/icons/play.webp`
      this.toggleMusicPlaying()
      return
    }
    this.audio.play()
    this.isPlaying = true
    this.btnPlayPause.src = `${this.path}/src/icons/pause.webp`
    this.toggleMusicPlaying()
  },
  toggleMusicPlaying(){
    if(this.isPlaying) this.cardActive.classList.add("playing")
    if(!this.isPlaying) this.cardActive.classList.remove("playing")
  },
  next() {
    this.currentPlaying++
    if (this.currentPlaying > audiosData.musics.length -1) this.currentPlaying = 0
    this.isPlaying = true
    this.update()
  },
  randomizeMusics() {
    let was_reproduced = this.musicsPlayed.indexOf(this.currentPlaying)
    if (this.musicsPlayed.length == audiosData.musics.length) this.musicsPlayed = []
    while (was_reproduced != -1) {
      this.currentPlaying = this.getNumberRandom(0, audiosData.musics.length - 1)
      was_reproduced = this.musicsPlayed.indexOf(this.currentPlaying)
    }
    this.musicsPlayed.push(this.currentPlaying)
  },
  toggleRepeat() {
    this.statusRepeat = !this.statusRepeat
    this.btn_repeat.style.background = this.statusRepeat ? "rgba(0,255,255, .5)": "#44444a"
  },
  toggleRandom() {
    this.removeStorage()
    this.statusRandom = !this.statusRandom
    this.btn_random.style.background = this.statusRandom ? "rgba(0,255,255, .5)": "#44444a"
  }

}