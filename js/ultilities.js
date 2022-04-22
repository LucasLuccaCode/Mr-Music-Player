
const ultilities = {
  functions(){
    let timeTotal = conputed = musicsTotal = 0
    this.checkStorageData = function(){
      return localStorage.hasOwnProperty("audiosData")
    }
    this.assignSaveData = function(){
      audiosData = JSON.parse(localStorage.getItem("audiosData"))
    }
    this.saveData = function(data){
      localStorage.setItem("audiosData", JSON.stringify(data))
    }
    this.removeStorage = function(){
       localStorage.removeItem("audiosData")
    }
    this.getDataSetAttributes = function(el){
      const data = el.dataset
      const key = Object.keys(data)[0]
      const value = data[key]
      return { data, key, value }
    }
    this.listMusics = async function() {
      const directory = `${player.musicsPath}`
      const code = `#!/bin/bash;
      ls -oh -atx "${directory}" | awk 'NR > 1 { print NR-2"||"$0 }'`
      let listMusics = await tasker.actionsShell(code)
      
      const regex = /(.+)\|\|(.+)/
      const re = new RegExp(regex, 'g')
      listMusics = listMusics.replace(re, '{ "id": "$1", "name": "$2" },').replace(/.$/,"")
      const json = `[${listMusics}]`
      audiosData["musics"] = JSON.parse(json)
    }
    this.activateDevTools = function(){
      var script = document.createElement('script');
      script.src = "//cdn.jsdelivr.net/npm/eruda";
      document.body.appendChild(script);
      script.onload = function () {
        eruda.init()
      }
    }
    this.getCssPropertyValue = (elemento, propriedade) => {
      return propriedade+':', document.defaultView.getComputedStyle(elemento, null)[propriedade]
    }
    this.debounce = (func, wait, immediate) => {
      let timeout;
      return function(...args) {
        const context = this;
        const later = function () {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      }
    }
    this.activateCard = function(){
      if(this.cardActive) { 
        this.cardActive.classList.remove("active")
        const icon = this.cardActive.querySelector("img")
        icon.src = `${this.path}/src/icons/music-black.png`
        this.cardActive.classList.remove("playing")
      }
      const icon = document.querySelector(`[data-card="${this.currentPlaying}"] img`)
      const card = document.querySelector(`[data-card="${this.currentPlaying}"]`)
      icon.src = `${this.path}/src/icons/music-playing.webp`
      if(this.isPlaying) card.classList.add("playing")
      card.classList.add("active")
      this.cardActive = card
    }
    this.sleep = function(ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    }
    this.setPath = function(name) {
      return `${player.musicsPath}/${name}`
    }
    this.splitName = function(name) {
      const regex = /(.+)\..+/
      const re = new RegExp(regex, 'g')
      return name.replace(re, '$1')
    }
    this.getNumberRandom = function(min, max){
      return Math.floor(Math.random() * (max - min +1) + min)
    }
    this.setDuration = function(duration) {
      const hours = `0${ Math.floor(duration / 3600) }`
      const minutes = `0${ Math.floor((duration-(hours * 3600)) / 60) }`
      const seconds = `0${ Math.floor(duration % 60) }`
  
      return `${ Number(hours) ? hours.slice(-2)+":": ""}${ minutes.slice(-2) }:${ seconds.slice(-2) }`
    }
    this.updateTimeTotal = function(){
      this.totalTimesElem.textContent = audiosData.timeTotal
    }
    this.renderCardsMusics = async function(data, isSearch) {
      const htmlCards = data.map( 
        ({id, name, duration, nReproduced }) => {
       const cardActive = this.currentPlaying == id
         return `
          <li class="c-musics__card ${ cardActive && !isSearch ? 'active' : '' }" data-card${isSearch ? "_search" : "" }="${id}">
            <div class="c-musics__card__icon">
              <img src="${this.path}/src/icons/music-black.png" loading="lazy" />
              <span>${ duration || "00:00" }</span>
            </div>
            <p class="c-musics__card__name nowrap">${ this.splitName(name) }</p>
            <div class="c-musics__card__points" data-actions="${id}">
              <span></span>
            </div>
          </li>`
        }).join("")
        
        if(!isSearch) { 
          this.musics.innerHTML = htmlCards
          this.cardActive = document.querySelector(`[data-card="${this.currentPlaying}"]`)
          return
        }
        this.musicsSearch.innerHTML = htmlCards
    
    }
    this.calculateMusicsTimes = async () => {
      musicsTotal = audiosData.musics.length
      
      audiosData.musics.forEach( ({ id, name }) => {
        const audio = new Audio();
        audio.src = `${player.musicsPath}/${name}`
        audio.onloadedmetadata = function(e){
          conputed++
          const duration = player.setDuration(parseInt(this.duration))
          timeTotal += parseInt(this.duration)
          audiosData.musics[id].duration = duration
          
          document.querySelector(`[data-card="${id}"] .c-musics__card__icon span`).textContent = duration
        }
      })
      this.checkAllSetDurations()
    }
    this.checkAllSetDurations = async function(){
      const interval = setInterval( ()=> {
        if(conputed >= musicsTotal) {
          clearInterval(interval)
          audiosData.timeTotal = this.setDuration(timeTotal)
          this.saveData(audiosData)
          console.log(`${audiosData.musics.length} caches de musicas salvas no storage...`)
          this.updateTimeTotal()
        }
      }, 3000)
    }

  }
}