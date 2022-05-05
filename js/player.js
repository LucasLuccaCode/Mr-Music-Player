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
  alertFunc: () => {
    alert("yes")
  },
  
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
  async start() {
    //this.removeStorage()
    await this.renderLoading()
    let hasStorageData = await this.checkStorageData()
    console.log(`[hasStorageData] => ${hasStorageData}`)
    if(hasStorageData) this.assignSaveData()
    console.log(`[this.path] => ${this.path}`)
    if(this.path != "."){ 
      let numberMusics = await this.getNumberMusics()
      if(!hasStorageData || numberMusics != audiosData.totalMusics || !audiosData.totalMusics){
        let isConfirmed
        if(hasStorageData && audiosData.totalMusics){
          isConfirmed = confirm("Lista de musicas desatualizada, deseja atualizar agora?")
          if(isConfirmed){ 
            audiosData = { ...audiosDataDefault }
            this.musics.innerHTML = ""
            hasStorageData = false
          }
        }
        if(isConfirmed || isConfirmed == undefined){
          this.totalDurationsElem.textContent = "..."
          await this.sleep(10)
          await this.listMusics()
          if(!audiosData.musics.length){
            const msg = "<p class='infor'>Não foram encontradas musicas na pasta indicada</p>"
            this.musics.innerHTML = msg
            //audiosData.totalMusics = audiosData.musics.length
            //this.saveData(audiosData)
            return
          }
        }
      }
    }
    if(!hasStorageData) audiosData.totalMusics = audiosData.musics.length
    console.log(`[audiosData.totalMusics] => ${audiosData.totalMusics}`)
    this.currentPlaying = audiosData.lastPlay
    console.log(`[this.currentPlaying] => ${this.currentPlaying}`)
    
    this.renderCardsMusics(audiosData.musics)
    if(audiosData.totalDurations) this.updateTotalDurations()
    console.log(`[audiosData.totalDurations] => ${audiosData.totalDurations}`)
    if(audiosData.totalMusics) this.updateTotalMusics()
    if(!hasStorageData) this.calculateMusicsTimes()
    if(audiosData.lastPlay !== false) this.update()
  },
  update() {
    if(!audiosData.musics.length) return
    console.log(`[--CurrentPlaying] => ${this.currentPlaying}`)
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
