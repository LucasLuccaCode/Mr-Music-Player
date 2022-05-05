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
          this.artist.innerHTML = "..."
          this.start()
        }
      }
      const func = actions[key]
      if(func) func()
    }
    this.slideAudio = () => {
      this.audio.pause()
      this.audio.currentTime = this.seekbar.value
      this.audio.play()
      if(!this.isPlaying){
        this.isPlaying = true
        this.btnPlayPause.src = `${this.path}/src/icons/pause.webp`
        this.activeCard.classList.add("playing")
      }
    }
    this.audioError = e => {
      const { id } = e.path[0]
     // alert(`Música "${audiosData.musics[id].name}" não encontrada`)
      const card = document.querySelector(`[data-card="${id}"]`)
      if(card) card.remove()
      audiosData.totalDurations -= audiosData.musics[id].duration
      this.updateTotalDurations()
      audiosData.musics.splice(id, 1)
      audiosData.musics = this.recreateIds(audiosData.musics)
      console.log(audiosData.musics)
      audiosData.totalMusics = audiosData.musics.length
      this.updateTotalMusics()
      if(+this.currentPlaying > audiosData.musics.length -1) this.currentPlaying = 0
      this.updateDataCardsIds()
      this.update()
    }
    this.audioLoadedData = () => {
      const duration = this.setDuration(this.audio.duration)
      if(this.isPlaying) this.audio.play()
      this.updateSeekbar(this.audio.duration)
      this.updateTotalDuration(duration)
      this.updateArtist()
      
      this.btnPlayPause.src = `${this.path}/src/icons/${ this.isPlaying ? "pause" : "play"}.webp`
      
      audiosData.lastPlay = +this.currentPlaying
      ++this.currentAudio.nReproduced
      ++audiosData.totalPlayed
      this.saveData(audiosData)
    }
    this.audioTimeUpdate = () => {
      this.currentDuration.textContent =  this.setDuration(this.audio.currentTime)
      this.seekbar.value = this.audio.currentTime
    }
    this.audioEnded = () => {
      if(!this.statusRepeat){
        this.next()
        return
      }
      this.update()
    }
    this.removeBlurs = ({ target: el}, run) => {
      const { key } = this.getDataSetAttributes(el)
      if(key != "player" && !run) return
      this.c_player.classList.remove("blur")
      this.c_player.classList.remove("main")
      this.c_player.classList.remove("order")
      this.alertProgress.classList.remove("active")
      this.confirmationAlert.classList.remove("active")
    }
    this.showOptionsOrder = () => {
      document.querySelector(`[data-order_option="${audiosData.orderOption}"]`).checked = true
      this.c_player.classList.add("order")
    }
    this.orderActions = ({ target: el }) => {
      const { value, key } = this.getDataSetAttributes(el)
      if(key != "order_option") return

      const array = audiosData.musics
      const actions = {
        ranking: ()=> this.orderRanking(array),
        longer_duration: ()=> this.orderLongerDuration(array),
        shorter_duration: ()=> this.orderShorterDuration(array),
        nameC: ()=> this.orderNameC(array),
        nameD: ()=> this.orderNameD(array),
        date: ()=> this.orderDate(array),
      }
      const func = actions[value]
      if(func){
        setTimeout(() => {
          audiosData.musics = this.recreateIds(func())
          this.renderCardsMusics(audiosData.musics)
          audiosData.orderOption = value
          this.saveData(audiosData)
        }, 0)
      }
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
    this.toggleSearch = () => {
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
      console.log(`[card_value] => ${value}`)
      const actions = {
        card: () => {
          const card = el
          if(!value || this.activeCard === card ) return
    
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
          console.log(audiosData.musics[value].nReproduced)
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
      if(key != "main" && key != "order_options") return
      
      const td_x = e.changedTouches[0].clientX - ts_x;
      const td_y = e.changedTouches[0].clientY - ts_y;
    
      const verticalMovement = Math.abs(td_x) < Math.abs(td_y)
      if(verticalMovement) {
        if(td_y < 0){
          if(key == "main") this.c_player.classList.add("main")
          return
        }
        if(key == "main") this.c_player.classList.remove("main")
        if(key == "order_options") this.c_player.classList.remove("order")
      }
    }
  }
}