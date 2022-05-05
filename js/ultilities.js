
const ultilities = {
  functions(){
    let totalDurations = conputed = musicsTotal = deletedFiles = 0
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
    this.getSelectedsCheckbox = function(){
      return [...document.querySelectorAll("[data-card_select]:checked")]
    }
    this.selectAllCheckbox = function(){
      return [...document.querySelectorAll("[data-card_select]:checked")]
    }
    this.getNumberMusics = async function(){
      const directory = `${player.musicsPath}`
      const code = `#!/bin/bash;
      ls "${directory}" | wc -l`
      return await tasker.actionsShell(code)
    }
    this.listMusics = async function() {
      const directory = `${player.musicsPath}`
      const code = `#!/bin/bash;
      ls -atxo "${directory}" | awk 'NR > 1 { print NR-2"/"$0 }'`
      let listMusics = await tasker.actionsShell(code)
      const regex = /([0-9]+)\/.+(\d{4}\-\d{2}\-\d{2})\s(\d{1,2}\:\d{2})\s(.+)/
      const re = new RegExp(regex, 'g')
      listMusics = listMusics.replace(re, '{ "id": $1, "name": "$4", "duration": 0, "hour": "$3", "date": "$2", "nReproduced": 0 },').replace(/.$/,"")
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
      if(this.activeCard) { 
        this.activeCard.classList.remove("active")
        this.activeCard.classList.remove("playing")
        const icon = this.activeCard.querySelector("img")
        icon.src = `${this.path}/src/icons/music-black.png`
      }
      const icon = document.querySelector(`[data-card="${this.currentPlaying}"] img`)
      const card = document.querySelector(`[data-card="${this.currentPlaying}"]`)
      icon.src = `${this.path}/src/icons/music-playing.webp`
      if(this.isPlaying) card.classList.add("playing")
      card.classList.add("active")
      this.activeCard = card
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
    this.showAlertProgress = function(msg){
      this.c_player.classList.add("blur")
      document.querySelector("[data-alert_progress] h3").textContent = msg
      document.querySelector("[data-alert_progress] div > div").style.width = "0%"
      document.querySelector("[data-alert_progress] p").textContent = "..."
      this.alertProgress.classList.add("active")
    }
    this.showConfirmationAlert = function(msg){
      this.c_player.classList.add("blur")
      document.querySelector("[data-confirmation_alert] h3").textContent = msg
      this.confirmationAlert.classList.add("active")
    }
    this.calculateMusicsTimes = () => {
      this.showAlertProgress("Carregando durações das musicas")
      musicsTotal = audiosData.musics.length
      totalDurations = conputed = 0
     
      audiosData.musics.forEach( ({ id, name }) => {
        const audio = new Audio();
        audio.id = id
        audio.src = `${player.musicsPath}/${name}`
        audio.onloadedmetadata = function(e){
          ++conputed
          const duration = player.setDuration(parseInt(this.duration))
          totalDurations += parseInt(this.duration)
          if(audiosData.musics[id]){
            audiosData.musics[id].duration = parseInt(this.duration)
            document.querySelector(`[data-card="${id}"] .c-musics__card__icon span`).textContent = duration
          }
         // console.log(conputed+" / "+audiosData.musics[conputed].name)
          player.updateAlertProgress(conputed,musicsTotal)
          if(conputed >= musicsTotal) player.allDurationsLoaded(totalDurations)
        }
        audio.onerror = function(){ 
          ++conputed 
          if(conputed >= musicsTotal) player.allDurationsLoaded(totalDurations)
        }
      })
    }
    this.allDurationsLoaded = function(totalDurations){
      audiosData.totalDurations = totalDurations
      this.updateTotalDurations()
      setTimeout(() => { 
        this.alertProgress.classList.remove("active") 
        this.c_player.classList.remove("blur")
      }, 500 )
      this.saveData(audiosData)
    }
    this.removeFiles = function(ids){
      ids.map( id => {
        const code = `rm -rf "${this.musicsPath}/${audiosData.musics[id].name}"`
        if(this.path !== ".") tasker.actionsShell(code)
        
        document.querySelector(`[data-card="${id}"]`).remove()
        audiosData.totalDurations -= audiosData.musics[id].duration
        --audiosData.totalMusics
        ++deletedFiles
        this.updateAlertProgress(deletedFiles,ids.length)
      })
    }
    this.removeMusics = function(ids){
      audiosData.musics = audiosData.musics.filter( 
        ({id}) =>  !ids.includes(String(id)))
    }
    this.startDeleteMusics = function(selecteds){
      deletedFiles = 0
      let lastID = false
      
      this.showAlertProgress(`Excluindo ${selecteds.length} musicas`)
      setTimeout( ()=> {
        const ids = selecteds.map( el => {
          const id = el.parentNode.parentNode.getAttribute("data-card")
          if(id == audiosData.lastPlay) lastID = true
          return id
        })
        this.removeFiles(ids)
        this.removeMusics(ids)
        this.updateTotalDurations()
        audiosData.musics = this.recreateIds(audiosData.musics)
        audiosData.totalMusics = audiosData.musics.length
        this.updateTotalMusics()
        this.updateDataCardsIds()
        this.saveData(audiosData)
        setTimeout( ()=> {
          this.alertProgress.classList.remove("active")
        }, 500)
        if(lastID){ 
          this.currentPlaying = 0
          this.update()
        }
        this.alertFunc = false
        console.log(this)
      }, 1000)
    }
  }
}