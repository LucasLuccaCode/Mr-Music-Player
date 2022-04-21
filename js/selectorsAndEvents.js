
const selectorsAndEvents = {
  selectors() {
    this.c_title = document.querySelector("[data-title]")
    this.currentDuration = document.querySelector("[data-duration='current']")
    this.seekbar = document.querySelector("[data-seekbar]")
    this.totalDuration = document.querySelector("[data-duration='total']")
    this.artist = document.querySelector("[data-artist]")
    this.controls = document.querySelector("[data-controls]")
    this.btnPlayPause = document.querySelector("[data-controls_card='play'] img")
    this.main = document.querySelector("[data-main]")
    this.mainSlider = document.querySelector("[data-main_slider]")
    this.totalTimesElem = document.querySelector("[data-total_times]")
    this.musics = document.querySelector("[data-musics]")
  },
  events() {
    this.seekbar.oninput = () => this.slideAudio()
    this.controls.oncontextmenu = (e) => this.speedUpAudio(e)
    this.controls.onclick = (e) => this.actionsControl(e)
    this.c_title.onclick = (e) => this.actionsTitle(e)
    this.controls.ontouchend = (e)  => this.stopSpeedAudio(e)
    this.audio.onloadeddata = () => this.audioLoadedData()
    this.audio.ontimeupdate = () => this.audioTimeUpdate()
    this.audio.onended = () => this.audioEnded()
    this.mainSlider.addEventListener("touchstart", this.touchStart)
    this.mainSlider.addEventListener("touchmove", this.touchMoveEnd)
    this.musics.addEventListener("click", this.actionsCard)
  },
}