const callbacks = {
  functions() {
    let ts_x = ts_y = 0
    
    this.actionsTitle = ({ target: el }) => {
      const { key } = this.getDataSetAttributes(el)
      console.log(key)
      
      const actions = {
        search: () => {
          
        },
        settings: () => {
          this.removeStorage()
          alert("Dados apagados...")
        }
      }
      const func = actions[key]
      if(func) func()
    }
    this.exitSceneTasker = function(){
      const timeout = setTimeout(()=>{
        clearTimeout(timeout)
        tasker.setLocalVar("cont_exit", 0)
        window.navigator.vibrate(15)
      }, 5000)
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
      if (!this.statusRepeat) this.currentPlaying++
      if (this.currentPlaying > audiosData.length -1) this.currentPlaying = 0
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
      if (!btn) return

      return {
        repeat: () => this.toggleRepeat(),
        previous: () => this.previous(),
        play: () => this.playPause(),
        next: () => this.next(),
        random: () => this.toggleRandom(),
      }[btn]() || ""
    }
    this.toggleSearch = function() {
      const isVisible = this.c_search.className.includes("active")
      if (!isVisible) {
        this.c_search.classList.add("active")
        this.pageMusics.scroll(0,0)
        setTimeout(()=> this.search.focus(), 300)
      } else {
        this.c_search.classList.remove("active")
      }
    }
    this.resetSearch = async function (){
      this.toggleSearch()
      if (this.search.value) {
        setTimeout( () => {
          this.search.value = ""
          this.searchMusics({ target: this.search })
        }, 300)
      }
      this.searchMoveDown(30)
    }
    this.searchMusics = async ({target: el}) => {
      const musicSearch = el.value.trim().toUpperCase()
      const filtered = audiosData.filter( ({name}) => name.trim().toUpperCase().includes(musicSearch) )
      this.renderCardsMusics(filtered)
    }
    this.searchMoveUp = function(ms = 300){
      setTimeout( () => {
        this.c_headerMusics.classList.add("hide")
      }, ms)
    }
    this.searchMoveDown = function(ms = 300){
      setTimeout( () => {
        this.c_headerMusics.classList.remove("hide")
      }, ms)
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
        actions: () => {
          const screen_y = window.innerHeight
          const x = e.clientX
          const y = e.clientY
          const div = document.createElement("div")
          div.setAttribute("class", "c-player__card__c_actions")
          div.style.top = `${y-25}px`
          div.style.right = `8vw`
          div.innerHTML = `<p>${audiosData[value].nReproduced}</p><p> Excluir </p><p>Adicionar Playlist</p><p>Favoritar</p>`
          this.c_player.appendChild(div)
          div.onclick = async () => {
            await this.sleep(200)
            div.remove()
          }
        },
      }[key]() || ""

    }
    this.footerActions = ({ target: el}) => {
      const action = el.getAttribute("data-footer")
      if( !action ) return
      const functions = {
        minimize: () => this.footerMinimize(),
        order: () => this.footerOrder(),
      }
      const isPage = ["music","playlist","lyric"]
        .some( page => page == action )
      if(isPage){
        const to = document.querySelector(`.c-player__c_page [data-page="${action}"]`).offsetLeft
        this.c_page.scroll(to,0)
        return
      }
      const func = functions[action]
      func()
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
    this.callbackObserver = (entries, observer) => { entries.forEach( 
      ({  isIntersecting, intersectionRatio, target: el }) => {
        
        const elementoVisivel = isIntersecting === true || intersectionRatio > 1;
        if (elementoVisivel) this.actionsVisiblePage(el)
  
      })
    }
    this.touchStart = (e) => {
      ts_x = e.touches[0].clientX;
      ts_y = e.touches[0].clientY;
    }
    this.touchMoveEnd = (e) => {
      const className = e.target.className
      const td_x = e.changedTouches[0].clientX - ts_x;
      const td_y = e.changedTouches[0].clientY - ts_y;
    
      const verticalMovement = Math.abs(td_x) < Math.abs(td_y)
      if(verticalMovement) {
        if(td_y < 0){
          this.main.classList.add("active")
          return
        }
        this.main.classList.remove("active")
      }
    }
  }
}