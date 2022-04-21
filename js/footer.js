

const footerActions = {
  functions(){
    this.footerMinimize = function(){
      console.log("minimize")
    }
    this.footerOrder = function(){
      audiosData = audiosData.sort( (a,b) => b.nReproduced - a.nReproduced )
      .map( (music, i) => ({ ...music, id: i }) )
      this.renderCardsMusics(audiosData)
    }
  }
}