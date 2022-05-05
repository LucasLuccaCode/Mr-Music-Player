
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
      console.log(`[this.updateTotalMusics] => ${total}`)
    }
    this.updateTotalDurations = function(){
      this.totalDurationsElem.textContent = this.setDuration(audiosData.totalDurations)
      console.log(`[this.updateTotalDurations] => ${this.setDuration(audiosData.totalDurations)}`)
    }
    this.updateDataCardsIds = function(){
      const cards = [...document.querySelectorAll("[data-card]")]
      cards.forEach( (card, index) => card.setAttribute("data-card", index) )
      console.log("[this.updateDataCardsIds]")
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
      console.log("[renderLoading]")
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
        console.log(`[this.renderCardsMusics]`)
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
  }
}