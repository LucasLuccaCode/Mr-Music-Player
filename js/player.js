const player = {
  audio: new Audio(),
  path: typeof tasker === 'undefined' ? "." : tasker.path,
  musicsPath: typeof tasker === 'undefined' ? "./src/musics" : tasker.musicsPath,
  isPlaying: false,
  statusRepeat: false,
  statusRandom: false,
  currentPlaying: 0,
  activeCard: false,
  currentAudio: {},
  musicsPlayed: [],
  alertFunc: {...alertFuncDefault},
  
  setContexts(){
    formatting.functions.call(this)
    updateRender.update.call(this)
    updateRender.render.call(this)
    selectorsAndEvents.selectors.call(this)
    callbacks.functions.call(this)
    ultilities.functions.call(this)
    selectorsAndEvents.events.call(this)
    //this.activateDevTools()
  },
  async start(update) {
    //this.removeStorage()
    await this.renderLoading()
    let hasStorageData = await this.checkStorageData()
    if(hasStorageData) this.assignSaveData()
    const numberMusics = await this.getNumberMusics()

    if(numberMusics != audiosData.totalMusics || update || numberMusics == 0){
      const msg = "Lista de musicas desatualizada.<br>Deseja atualizar agora?"
      if(!update && numberMusics != 0) this.showConfirmationAlert(msg)
      this.alertFunc = {
        not: async () => {
          this.updateTotalDurations()
          this.updateTotalMusics()
          this.renderCardsMusics(audiosData.musics)
          this.update()
        },
        yes: async () => {
          audiosData = { ...audiosDataDefault }
          await this.listMusics()
          if(!audiosData.musics.length) return this.renderSongsNotFound()
          audiosData.totalMusics = audiosData.musics.length
          this.currentPlaying = audiosData.lastPlay
          this.renderCardsMusics(audiosData.musics)
          this.setMusicsDuration()
          this.updateTotalMusics()
          this.update()
        }
      }
      if(update || numberMusics == 0) this.alertFunc.yes()
      return
    }
    this.currentPlaying = audiosData.lastPlay
    if(audiosData.totalDurations) this.updateTotalDurations()
    if(audiosData.totalMusics) this.updateTotalMusics()
    this.renderCardsMusics(audiosData.musics)
    if(!hasStorageData) this.calculateMusicsTimes()
    if(audiosData.lastPlay !== false) this.update()
  },
  update() {
    if(!audiosData.musics.length) return
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
    if(this.isPlaying) this.activeCard.classList.add("playing")
    if(!this.isPlaying) this.activeCard.classList.remove("playing")
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
      this.createMsg("Todas as musicas foram tocadas aleatoriamente. Reiniciando lista...", true)
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
