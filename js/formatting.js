
const formatting = {
  functions(){
    this.recreateIds = function(array){
      let hasPlayingDefined = false
      return array.map( (item, index) => { 
        if(item.id == audiosData.lastPlay && !hasPlayingDefined){
          hasPlayingDefined = true
          this.currentPlaying = index
          audiosData.lastPlay = index
        }
        return  { ...item, id: index }
      })
    }
    this.orderRanking = function(array){
      return [...array].sort( (a,b) => b.nReproduced - a.nReproduced)
    }
    this.orderRecents = function(array){
      return [...array].sort( (a,b) => a - b)
    }
    this.orderLongerDuration = function(array){
      return [...array].sort( (a, b) => {
        if(!a.duration || !b.duration) return +1
        return a.duration < b.duration ? +1 : -1
      })
    }
    this.orderShorterDuration = function(array){
      return [...array].sort( (a, b) => {
        if(!a.duration || !b.duration) return +1
        return a.duration > b.duration ? +1 : -1
      })
    }
    this.orderNameC = function(array){
      return [...array].sort( (a, b) => a.name.toUpperCase() > b.name.toUpperCase() ? +1 : -1 )
    }
    this.orderNameD = function(array){
      return [...array].sort( (a, b) => a.name.toUpperCase() < b.name.toUpperCase() ? +1 : -1 )
    }
    this.orderDate = function(array){
      return [...array].sort( (a, b) => a.date+a.hour < b.date+b.hour ? +1 : -1 )
    }
  }
}