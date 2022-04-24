const callbacks = {
  functions() {
    let ts_x = ts_y = 0
    
    this.actionsTitle = ({ target: el }) => {
      const { key } = this.getDataSetAttributes(el)
      
      const actions = {
        search: () => {
          this.toggleSearch()
        },
        settings: async () => {
          if(this.isPlaying) this.playPause("pause")
          this.removeStorage()
          alert("Dados apagados...")
          if(this.path == "."){ 
            window.location.reload()
            return
          }
          audiosData = { ...audiosDataDefault }
          this.musics.innerHTML = ""
          this.start()
        }
      }
      const func = actions[key]
      if(func) func()
    }
    this.slideAudio = function() {
      this.audio.pause()
      this.audio.currentTime = this.seekbar.value
      this.audio.play()
      if(!this.isPlaying){
        this.isPlaying = true
        this.btnPlayPause.src = `${this.path}/src/icons/pause.webp`
        this.cardActive.classList.add("playing")
      }
    }
    this.audioLoadedData = function(){
      const duration = this.setDuration(this.audio.duration)
      this.seekbar.max = this.audio.duration
      this.totalDuration.textContent = duration
    }
    this.audioTimeUpdate = function() {
      this.currentDuration.textContent =  this.setDuration(this.audio.currentTime)
      this.seekbar.value = this.audio.currentTime
    }
    this.audioEnded = function() {
      if(!this.statusRepeat) this.currentPlaying++
      if(this.currentPlaying > audiosData.length -1) this.currentPlaying = 0
      this.isPlaying = true
      this.update()
    }
    this.actionsMoreOptions = function(){
      const card = document.querySelector(`.c-player__musics [data-card="${this.currentPlaying}"]`)
      const to = card.offsetTop - 210
      this.pageMusics.scroll(0, to)
    }
    this.actionsControl = ( { target: el }) => {
      const btn = el.getAttribute("data-controls_card")

      const actions = {
        repeat: () => this.toggleRepeat(),
        previous: () => this.previous(),
        play: () => this.playPause(),
        next: () => this.next(),
        random: () => this.toggleRandom(),
      }
      const func = actions[btn]
      if(func) func()
    }
    this.toggleSearch = function() {
      const isVisible = this.c_search.className.includes("active")
      if (!isVisible) {
        this.musicsSearch.innerHTML = ""
        this.c_search.classList.add("active")
        this.inputSearch.focus()
        return
      } 
      this.c_search.classList.remove("active")
      this.musicsSearch.innerHTML = ""
      this.inputSearch.value = ""
    }
    this.searchMusics = async ({target: el}) => {
      const musicSearch = el.value.trim().toUpperCase()
      const filtered = audiosData.musics.filter( ({name}) => name.trim().toUpperCase().includes(musicSearch) )
      this.renderCardsMusics(filtered, true)
    }
    this.actionsCard = (e) => {
      const { target: el } = e
      const { key, value } = this.getDataSetAttributes(el)

      const actions = {
        card: () => {
          const card = el
          if(!value || this.cardActive === card ) return
    
          this.currentPlaying = value
          this.isPlaying = true
          this.update()
        },
        card_search: () => {
          this.currentPlaying = Number(value)
          this.isPlaying = true
          el.classList.add("active")
          setTimeout( () => {
            this.update()
            el.classList.remove("active")
          }, 100 )
        },
        actions: () => {
          console.log(value)
        },
      }
      const func = actions[key]
      if(func) func()
    }
    this.speedUpAudio = ( { target: el }) => {
      const btn = el.getAttribute("data-controls")
      if (!btn) return
      window.navigator.vibrate(15)
      this.interval = setInterval(()=> {
        if (btn == "next") this.audio.currentTime += 1
        if (btn == "previous") this.audio.currentTime -= 1
      }, 100)
    }
    this.stopSpeedAudio = ( { target: el }) => {
      const btn = el.getAttribute("data-controls")
      if (!btn) return
      clearInterval(this.interval)
      this.interval = false
    }
    this.touchStart = (e) => {
      ts_x = e.touches[0].clientX;
      ts_y = e.touches[0].clientY;
    }
    this.touchMoveEnd = (e) => {
      const { key } = this.getDataSetAttributes(e.target)
      if(key == "card" || key == "actions") return
      
      const td_x = e.changedTouches[0].clientX - ts_x;
      const td_y = e.changedTouches[0].clientY - ts_y;
    
      const verticalMovement = Math.abs(td_x) < Math.abs(td_y)
      if(verticalMovement) {
        if(td_y < 0){
          this.main.classList.add("active")
          this.c_player.classList.add("blur")
          return
        }
        this.main.classList.remove("active")
        this.c_player.classList.remove("blur")
      }
    }
  }
}