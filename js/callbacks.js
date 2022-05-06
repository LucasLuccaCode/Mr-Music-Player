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
          this.musics.innerHTML = ""
          this.artist.innerHTML = "..."
          this.start(true)
          this.createMsg("Dados apagados...", true)
        }
      }
      const func = actions[key]
      if(func) func()
    }
    this.removeMsg = ({ target: el }) => {
      const { key } = this.getDataSetAttributes(el)
      if(key != "msg_cancel") return 
      const card = el.parentNode
      const { value } = this.getDataSetAttributes(card)
      if(value) clearInterval(value)
      setTimeout( () => card.remove(), 250)
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
      this.updateReproducionNumber()
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
      this.c_player.classList.remove("main")
      this.c_player.classList.remove("order")
      //this.c_player.classList.remove("blur")
      // this.alertProgress.classList.remove("active")
      // this.confirmationAlert.classList.remove("active")
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
          this.activateCard()
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
    this.actionsConfirmationAlert = ({ target: el }) => {
      const { value } = this.getDataSetAttributes(el)
      
      const actions = {
        not: ()=> this.alertFunc.not(),
        yes: async () => { 
          await this.alertFunc.yes()
        },
      }
      const func = actions[value]
      if(func){ 
        setTimeout( async () => {
          this.confirmationAlert.classList.remove("active")
          await func()
          this.c_player.classList.remove("blur")
        }, 200)
      }
    }
    this.longTapActions = ({ target: el }) => {
      const { key, value } = this.getDataSetAttributes(el)
      if(key != "card") return
      window.navigator.vibrate(15)
      this.c_player.classList.add("select")
      const checkbox = el.querySelector("[data-card_select]")
      checkbox.checked = !checkbox.checked
      this.updateTotalMusics(`${ this.getSelectedsCheckbox().length } / ${ audiosData.totalMusics }`)
    }
    this.toggleCheckboxs = ({ target: el }) => {
      const { key, value } = this.getDataSetAttributes(el)

      const actions = {
        options_select: () => {
          if (el.checked) {
            this.c_player.classList.add("select")
            setTimeout(() => {
              const selecteds = [...document.querySelectorAll("[data-card_select]")];
              selecteds.forEach(el => el.checked = true)
              this.updateTotalMusics(`${ selecteds.length } / ${ audiosData.totalMusics }`)
            }, 100)
            return
          }
          setTimeout(() => {
            this.getSelectedsCheckbox().forEach(el => el.checked = false)
            this.updateTotalMusics()
          }, 100)
        },
        card_select: () => {
          el = el.parentNode.parentNode
          const { value } = this.getDataSetAttributes(el)
          const totalSelecteds = document.querySelectorAll("[data-card_select]:checked").length
          this.updateTotalMusics(`${ totalSelecteds } / ${ audiosData.totalMusics }`)

          if (totalSelecteds == audiosData.totalMusics) {
            document.querySelector("[data-options_select]").checked = true
            return
          }
          const checkbox = document.querySelector("[data-options_select]")
          if (checkbox.checked) checkbox.checked = false
        },  
      }
      const func = actions[key]
      if(func) setTimeout( ()=> func(), 50 )
    }
    this.selectionActions = ({ target: el }) => {
      const { value } = this.getDataSetAttributes(el)

      const actions = {
        "cancel": () => { 
          this.c_player.classList.remove("select")
          document.querySelector("[data-options_select]").checked = false
          this.updateTotalMusics()
          this.getSelectedsCheckbox().forEach(el => el.checked = false)
        },
        "add": () => {
          const selecteds = this.getSelectedsCheckbox()
          console.log(selecteds)
        },
        "delete": () => {
          const selecteds = this.getSelectedsCheckbox()
          if(!selecteds.length){ 
            this.createMsg("Você não selecionou nenhuma musica para apagar")
            return
          }
          const msg = `Deseja mesmo apagar as ${selecteds.length} musicas?`
          this.showConfirmationAlert(msg)
          this.alertFunc.yes = () => this.startDeleteMusics(selecteds)
        }
      }
      const func = actions[value]
      if (func) setTimeout( () => func(), 300 )
    }
  }
}