
const updateRender = {
  update(){
    this.updateSeekbar = function(value){
      this.seekbar.max = value
    }
    this.updateTotalDuration = function(duration){
      this.totalDuration.textContent = duration
    }
    this.updateArtist = function(){
      this.artist.textContent = this.splitName(this.currentAudio.name)
    }
    this.updateTotalMusics = function(total = audiosData.totalMusics){
      document.querySelector("[data-total_musics]").textContent = total
    }
    this.updateTotalDurations = function(){
      this.totalDurationsElem.textContent = this.setDuration(audiosData.totalDurations)
    }
    this.updateReproducionNumber = function(){
      document.querySelector(`[data-card="${this.currentPlaying}"] .c-musics__card__name span`).textContent = this.currentAudio.nReproduced
    }
    this.updateDataCardsIds = function(){
      const cards = [...document.querySelectorAll("[data-card]")]
      cards.forEach( (card, index) => card.setAttribute("data-card", index) )
    }
    this.updateAlertProgress = function(c,total){
      document.querySelector("[data-alert_progress] p")
        .textContent = `${c} / ${total}`
      document.querySelector("[data-alert_progress] div > div")
        .style.width = `${ (c * 100) / total }%`
    }
  },
  render(){
    this.renderLoading = async function(){
      this.musics.innerHTML = `<section class="c-loading"><div></div><section>`
      await this.sleep(10)
    }
    this.renderSongsNotFound = function(){
      const div = document.createElement("div")
      div.setAttribute("class", "c-not_found")
      div.innerHTML = `
      <p>Não foram encontradas musicas na pasta indicada</p>
      <div>
        <input value="${this.musicsPath}">
        <button class="c--flex"></button>
      </div>`
      this.musics.innerHTML = ""
      this.musics.appendChild(div)
      div.querySelector("button").onclick = () => {
        const value = this.formatMusicPath(div.querySelector("input").value.trim())
        if(value == "") return this.createMsg("Campo em vazio...")
        tasker.setLocalVar("musics_path", value)
        this.musicsPath = value
        this.removeStorage()
        this.musics.innerHTML = ""
        this.start(true)
      }
    }
    this.renderCardsMusics = async function(data, isSearch) {
      const htmlCards = data.map( 
        ({id, name, duration, date, nReproduced }) => {
       const isActiveCard = audiosData.lastPlay === id
    
         return `
          <li class="c-musics__card ${ isActiveCard && !isSearch ? 'active' : '' } ${ this.isPlaying && isActiveCard ? 'playing' : '' }" data-card${ isSearch ? "_search" : "" }="${id}">
            <label>
              <input data-card_select type="checkbox" class="checkbox" />
            </label>
            <div class="c-musics__card__icon">
              <img src="${this.path}/src/icons/${ isActiveCard ? 'music-playing.webp' : 'music-black.png' }" loading="lazy" />
              <span>${ this.setDuration(duration) || "00:00" }</span>
            </div>
            <div class="c-musics__card__name">
              <p class="nowrap">${ this.splitName(name) }</p>
              <span>${nReproduced}</span>
            </div>
            <div class="c-musics__card__points" data-actions="${id}">
              <span></span>
            </div>
          </li>`
        }).join("")
        if(!isSearch) { 
          this.musics.innerHTML = htmlCards
          return
        }
        this.musicsSearch.innerHTML = htmlCards
    
    }
    this.renderAlertProgress = function(msg){
      const section = document.createElement("section")
      section.setAttribute("data-container_progress_durations", "")
      section.setAttribute("class", "c-alert c--flex")
      section.innerHTML = `
      <div class="content c--flex">
        <h3>${msg}</h3>
        <div class="progress"><div data-progress_barra></div></div>
        <p data-progress_durations>...</p>  
      </div>
      `
      this.c_player.appendChild(section)
      setTimeout( () => section.classList.add("active"), 100)
    }
    this.renderConfirmationAlert = function(msg, active){
      const section = document.createElement("section")
      section.setAttribute("data-comfirmation_alert", "")
      section.setAttribute("class", "c-alert c--flex")
      section.innerHTML = `
      <div class="content c--flex">
        <h3>${msg}</h3>
        <div class="buttons">
          <button class="${ !active ? 'active' : '' }" type="click">Não</button>
          <button class="${ active ? 'active' : '' }" type="click">Sim</button>
        </div>
      </div>
      `
      this.c_player.appendChild(section)
      setTimeout( () => section.classList.add("active"), 100)
    }
    this.getBodyMsg = (text, status, isPermanent) => {
      const msg = document.createElement("li")
      msg.setAttribute("class", `${status ? "sucess" : "error" } c--flex`)
      msg.innerHTML = `
      <div class="c-msg__progress c--flex">
        ${ isPermanent ? "P" : "" }
      </div>
      <div class="c-msg__msg c--flex">
        <p>${text}</p>
      </div>
      <div data-msg_cancel class="c-msg__cancel c--flex">
        <img src="${this.path}/src/icons/msg_cancel.png">
      </div>`
      return msg
    }
    this.createMsg = async (text, status, isLongTime, isPermanent) => {
      const msg = this.getBodyMsg(text, status, isPermanent)
      const c_progress = msg.querySelector("div")
      this.c_msg.prepend(msg)
      if(isPermanent) return
      let n = isLongTime ? 12 : 8
      
      await this.sleep(30)
      
      const interval = setInterval( ()=> {
        c_progress.textContent = --n
        if(n == 0) {
          msg.remove()
          clearInterval(interval)
        }
      },1000)
      
      msg.setAttribute("data-msg_card", interval)
    }
  }
}