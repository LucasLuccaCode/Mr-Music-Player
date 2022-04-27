const player = {
  audio: new Audio(),
  path: typeof tasker === 'undefined' ? "." : tasker.path,
  musicsPath: typeof tasker === 'undefined' ? "./src/musics" : tasker.musicsPath,
  isPlaying: false,
  statusRepeat: false,
  statusRandom: false,
  currentPlaying: 0,
  cardActive: false,
  currentAudio: {},
  musicsPlayed: [],
  
  setContexts(){
    formatting.functions.call(this)
    selectorsAndEvents.selectors.call(this)
    callbacks.functions.call(this)
    ultilities.functions.call(this)
    selectorsAndEvents.events.call(this)
    //this.activateDevTools()
  },
  async start() {
    //this.removeStorage()
    await this.renderLoading()
    let numberMusics
    let hasStorageData = await this.checkStorageData()
    if(hasStorageData) this.assignSaveData()
    if(this.path != "."){ 
      numberMusics = await this.getNumberMusics()
      if(!hasStorageData || numberMusics != audiosData.totalMusics){
        let isConfirmed
        if(hasStorageData){
          isConfirmed = confirm("Lista de musicas desatualizada, deseja atualizar agora?")
          if(isConfirmed){ 
            audiosData = { ...audiosDataDefault }
            this.musics.innerHTML = ""
            hasStorageData = false
          }
        }
        if(isConfirmed || isConfirmed == undefined){
          this.totalTimesElem.textContent = "..."
          await this.sleep(10)
          await this.listMusics()
          audiosData.totalMusics = audiosData.musics.length
        }
      }
    }
    this.currentPlaying = audiosData.lastPlay
    this.renderCardsMusics(audiosData.musics)
    if(audiosData.totalTimes) this.updateTimeTotal()
    if(audiosData.totalMusics) this.updateTotalMusics()
    if(!hasStorageData) this.calculateMusicsTimes()
    if(audiosData.lastPlay !== false) this.update()
  },
  update() {
    if(this.statusRandom) this.randomizeMusics()
    this.activateCard()
    this.currentAudio = audiosData.musics[this.currentPlaying]
    this.audio.pause()
    this.audio.currentTime = 0
    this.audio.src = this.setPath(this.currentAudio.name)
    this.audio.id = this.currentPlaying
  },
  previous() {
    this.currentPlaying--
    if (this.currentPlaying < 0) this.currentPlaying = audiosData.musics.length - 1
    const existFile = audiosData.musics[this.currentPlaying].existFile
    if(!existFile) --this.currentPlaying
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
    const existFile = audiosData.musics[this.currentPlaying].existFile
    if(!existFile) ++this.currentPlaying
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