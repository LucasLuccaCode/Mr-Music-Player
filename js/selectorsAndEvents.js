const selectorsAndEvents = {
  selectors() {
    this.c_player = document.querySelector("[data-player]")
    this.c_search = document.querySelector("[data-search]")
    this.formSearch = document.querySelector("[data-form_search]")
    this.backSearch = document.querySelector("[data-back_search]")
    this.inputSearch = document.querySelector("[data-input_search]")
    this.musicsSearch = document.querySelector("[data-musics_search]")
    this.c_title = document.querySelector("[data-title]")
    this.currentDuration = document.querySelector("[data-duration='current']")
    this.seekbar = document.querySelector("[data-seekbar]")
    this.totalDuration = document.querySelector("[data-duration='total']")
    this.artist = document.querySelector("[data-artist]")
    this.controls = document.querySelector("[data-controls]")
    this.btnRepeat = document.querySelector("[data-controls_card='repeat']")
    this.btnRandom = document.querySelector("[data-controls_card='random']")
    this.btnPlayPause = document.querySelector("[data-controls_card='play'] img")
    this.main = document.querySelector("[data-main]")
    this.btnOrder = document.querySelector("[data-options='order']")
    this.totalDurationsElem = document.querySelector("[data-total_times]")
    this.musics = document.querySelector("[data-musics]")
    this.c_order = document.querySelector("[data-order_options]")
    this.selectOptions = document.querySelector("[data-select_options]")
    this.alertProgress = document.querySelector("[data-alert_progress]")
    this.confirmationAlert = document.querySelector("[data-confirmation_alert]")
  },
  events() {
    this.c_player.addEventListener("click", this.removeBlurs)
    this.btnOrder.addEventListener("click", this.showOptionsOrder)
    this.selectOptions.addEventListener("click", ({ target: el }) => {
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
          const msg = `Deseja mesmo apagar as ${selecteds.length} musicas?`
          this.showConfirmationAlert(msg)
          this.alertFunc = () => this.startDeleteMusics(selecteds)
        }
      }
      const func = actions[value]
      if (func) setTimeout( ()=> func(), 300 )
    })
    this.main.addEventListener("contextmenu", ({ target: el })=>{
      const { key, value } = this.getDataSetAttributes(el)
      if(key != "card") return
      window.navigator.vibrate(15)
      this.c_player.classList.add("select")
      const checkbox = el.querySelector("[data-card_select]")
      checkbox.checked = !checkbox.checked
      this.updateTotalMusics(`${ this.getSelectedsCheckbox().length } / ${ audiosData.totalMusics }`)
    })
    this.main.addEventListener("change", ({ target: el })=> {
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
      if (func) setTimeout( ()=> func(), 50 )
    })
    this.confirmationAlert.addEventListener("click", ({ target: el }) => {
      const { value } = this.getDataSetAttributes(el)
      
      const actions = {
        no: () => alert("no"),
        yes: () => this.alertFunc(),
      }
      const func = actions[value]
      if(func){ 
        setTimeout( () => {
          this.confirmationAlert.classList.remove("active")
          func()
          this.c_player.classList.remove("blur")
        }, 200)
      }
    })
    this.c_order.addEventListener("change", this.orderActions)
    this.audio.addEventListener("error", this.debounce(this.audioError, 100))
    this.audio.addEventListener("loadeddata", this.audioLoadedData)
    this.audio.addEventListener("timeupdate", this.audioTimeUpdate)
    this.audio.addEventListener("ended", this.audioEnded)
    this.backSearch.addEventListener("click", this.toggleSearch)
    this.inputSearch.addEventListener("input", this.debounce(this.searchMusics, 300))
    this.seekbar.addEventListener("input", this.slideAudio)
    this.controls.addEventListener("contextmenu", this.speedUpAudio)
    this.controls.addEventListener("click", this.actionsControl)
    this.c_title.addEventListener("click", this.actionsTitle)
    this.controls.addEventListener("touchend", this.stopS3peedAudio)
    this.main.addEventListener("touchstart", this.touchStart)
    this.c_order.addEventListener("touchstart", this.touchStart)
    this.main.addEventListener("touchmove", this.touchMoveEnd)
    this.c_order.addEventListener("touchmove", this.touchMoveEnd)
    this.musics.addEventListener("click", this.actionsCard)
    this.musicsSearch.addEventListener("click", this.actionsCard)
  },
}


