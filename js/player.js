const player = {
  audio: new Audio(),
  path: typeof tasker === 'undefined' ? "." : tasker.path,
  musicsPath: typeof tasker === 'undefined' ? "./src/musics" : tasker.musicsPath,
  internal: false,
  isPlaying: false,
  statusRepeat: false,
  statusRandom: false,
  currentPlaying: 0,
  cardActive: false,
  currentAudio: {},
  musicsPlayed: [],
  
  setContexts(){
    selectorsAndEvents.selectors.call(this)
    callbacks.functions.call(this)
    ultilities.functions.call(this)
    selectorsAndEvents.events.call(this)
    //this.activateDevTools()
  },
  async start() {
    //this.removeStorage()
    //this.renderProgressDurations()
    const hasStorageData = await this.checkStorageData()
    if(hasStorageData) this.assignSaveData()
    if(!hasStorageData && this.path != ".") {
      this.totalTimesElem.textContent = "..."
      await this.listMusics()
    }
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
  playPause(action) {
    if(this.isPlaying || action == "pause") {
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
    const numberRandom = Math.floor( Math.random() * this.musicsPlayed.length )
    this.currentPlaying = this.musicsPlayed[numberRandom]
    this.musicsPlayed.splice(numberRandom, 1)
    
    if(!this.musicsPlayed.length){ 
      alert("Todas musicas foram tocadas")
      this.musicsPlayed = audiosData.musics.map( ({id}) => id )
    }
  },
  toggleRepeat(){
    if(this.statusRepeat) this.btnRepeat.classList.remove("active")
    if(!this.statusRepeat) this.btnRepeat.classList.add("active")
    this.statusRepeat = !this.statusRepeat
  },
  toggleRandom(){
    if(this.statusRandom){
      this.btnRandom.classList.remove("active")
      this.musicsPlayed = []
    }
    if(!this.statusRandom){ 
      this.btnRandom.classList.add("active")
      this.musicsPlayed = audiosData.musics.map( ({id}) => id )
    }
    this.statusRandom = !this.statusRandom
  }
}