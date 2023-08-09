

var movies = []
var tips = ['lyrics_1', 'lyrics_2','lyrics_3', 'lyrics_4', 'lyrics_5', 'lyrics_6']
var currentMusic = -1
var chances = ["first", "second", "third", "fourth", "fifth", "sixth"];
var moviesNumber = 0;

new Vue({
    el: '#dailyMusic',
    data: {
        buttonTip: true,
        callLost: false,
        searchTerm: '',
        tips:[],
        suggestions: [],
        showStartButton: true,
        playedToday: false,
        showBlackScreen: true,
        showNextButton: false,
        showRepeatButton: false,
        showTipsButton: false,
        isMenuOpen: false,
        tip: "Só de pensar que nós dois éramos dois <br> Eu feijão, você arroz <br>  Temperados com Sazon",
        poster: '',
        title: '',
        resposta: '',
        singer:'',
        points: 0,
        isDisabledNextTip: true,
        isDisabledChances: true,
        isDisabledInput: true,
        isDisabledInputButton: true,
        timeout: null
    },
    mounted(){
        axios.get('/api/music/getdailymusic')
                .then(response => {
                   currentMusic = response.data
                    console.log(currentMusic)
                   this.userPlayed()
                    if(this.playedToday){
                      this.showStartButton = false
                      this.showBlackScreen = false
                      this.win()
                    }    
                })
                .catch(error => {
                    if (error.message !== 'A listener indicated an asynchronous response by returning true, but the message channel closed before a response was received') {
                        console.log(error)
                    }
                });
       
            
    },
    methods: {
        fetchSuggestionsDebounced(){
            clearTimeout(this.timeout);

            this.timeout = setTimeout(()=> {
                this.fetchSuggestions();
            },300)
        },

        fetchSuggestions() {
            console.log("OI")
            if (!this.searchTerm) {
                this.suggestions = [];
                return;
            }
            axios.get('/api/music/search/' + this.searchTerm)
                .then(response => {
                    console.log(response.data)
                    if (!response.data) {
                        this.suggestions = []
                    }
                    const moviesSuggestions = response.data
                    this.suggestions = moviesSuggestions;
                })
                .catch(error => {
                    if (error.message !== 'A listener indicated an asynchronous response by returning true, but the message channel closed before a response was received') {
                        console.log(error)
                    }
                });

        },
        clearSuggestions() {
            setTimeout(() => {
                this.suggestions = [];
            }, 150);

        },
        selectSuggestion(suggestion) {
            this.searchTerm = suggestion.singer;
            this.suggestions = [];

        },

        //Quiz

        saveLastGame(){
          const today = new Date().toLocaleDateString();
          localStorage.setItem('lastplay-music', today)
        },

        userPlayed(){
          const today = new Date().toLocaleDateString();
          const lastplay = localStorage.getItem('lastplay-music')
          if(today == lastplay){
            this.playedToday = true
          } else { 
            this.playedToday = false
          }
        },

        start() {
            this.showStartButton = false
            this.showBlackScreen = false
            this.isDisabledInput = false
            this.isDisabledInputButton = false
            this.isDisabledNextTip = false
            turniningGreen()
            this.getTip()
            
            
           
            setTimeout(() => {
                this.showTipsButton = true
            }, 10);
            
        },

        openMenu(){
            this.isMenuOpen = !this.isMenuOpen;
        },
        closeMenu(){
            this.isMenuOpen = !this.isMenuOpen;
        },

        getTip() {
            var tip = tips[0]
            axios.get('/api/music/gettip/'+currentMusic+"/"+tip)
                .then(response => {
                    console.log(tip)
                    this.tip = response.data[tip]
                    
                })
                .catch(error => {
                    if (error.message !== 'A listener indicated an asynchronous response by returning true, but the message channel closed before a response was received') {
                        console.log(error)
                    }
                });
            tips.splice(0, 1)
        },
        verify(){
            if (this.searchTerm.trim() === "") {
                return;
              }
              
            axios.get('/api/music/verify/' + currentMusic + "/" + this.searchTerm)
            .then(response => {
                    if(response.data == false){
                        var element = document.getElementsByClassName(chances[0])[0];
                        element.classList.remove("green");
                        element.classList.add("red");
                        this.getTip()
                        chances.shift()
                    } else if(response.data) {
                        this.points += ((chances.length +1)*2) 
                        this.savePoints()
                        this.win()
                    }
                
                    if(chances.length == 0){
                        this.lost()
                    }
                
                this.searchTerm = ''               
            })
            .catch(error => {
                if (error.message !== 'A listener indicated an asynchronous response by returning true, but the message channel closed before a response was received') {
                    console.log(error)
                }
            });
        },
        lost(){
            this.savePoints()
            this.showRepeatButton = true
            axios.get("/api/music/poster/" + currentMusic)
                    .then(response => {
                        this.poster = response.data;
                        axios.head(this.poster)
                            .then(() => {
                            
                            })
                            .catch(() => {
                            this.poster = "https://upload.wikimedia.org/wikipedia/commons/6/64/Poster_not_available.jpg";
                            });
                        
                    })
                    .catch(error => {
                        console.log(error)
                    })

            axios.get("/api/music/singer/" + currentMusic)
                .then(response => {
                    this.singer = response.data;
                    })
                .catch(error => {
                    console.log(error)
                    })

            axios.get("/api/music/title/" + currentMusic)
                .then(response => {
                    this.title = response.data;
                    })
                .catch(error => {
                    console.log(error)
                    })
            
            this.callLost = true
            this.buttonTipContent = 'Próxima dica'
            this.saveLastGame()
        },
        saveTip(theme, tip){
            if(theme == "Atores"){
                var tip = tip.replace('<br>', ' e ') 
            }
            const newTip = {
                theme: theme, 
                tip
            }
            this.tips.push(newTip);
        },

        nextTip(){

            if(chances.length == 2){
                this.buttonTipContent = 'Ver resposta'
            }

            if(chances.length > 1){
            var element = document.getElementsByClassName(chances[0])[0];
            element.classList.remove("green");
            element.classList.add("red");
            this.getTip()
            chances.shift()
            } else {
                var element = document.getElementsByClassName(chances[0])[0];
                element.classList.remove("green");
                element.classList.add("red");
                this.lost()
            }
            
            

        },

        win(){
            this.savePoints()
            this.showRepeatButton = false,
            this.callLost = true
            this.showNextButton = true
            axios.get("/api/music/poster/" + currentMusic)
                    .then(response => {
                        this.poster = response.data
                        console.log(this.poster)
                        axios.head(this.poster)
                            .then(() => {
                            })
                            .catch(() => {
                            this.poster = "https://upload.wikimedia.org/wikipedia/commons/6/64/Poster_not_available.jpg";
                            });
                        
                    })
                    .catch(error => {
                        console.log(error)
                    })

                axios.get("/api/music/singer/" + currentMusic)
                .then(response => {
                    this.singer = response.data;
                    })
                .catch(error => {
                    console.log(error)
                    })
                  this.saveLastGame()
                
                axios.get("/api/music/title/" + currentMusic)
                  .then(response => {
                      this.title = response.data;
                      })
                  .catch(error => {
                      console.log(error)
                      })

        },
        savePoints(){
            axios.get("api/movies/newrecord/"+this.points)
                .then(response => {
                    
                    })
                .catch(error => {
                    console.log(error)
                    })

        }

    }
});





function turniningGreen() {
    var classes = ["first", "second", "third", "fourth", "fifth", "sixth"];

    for (var i = 0; i < classes.length; i++) {
        var element = document.getElementsByClassName(classes[i])[0];
        element.classList.remove("gray");
        element.classList.add("green");
    }
}

function turniningGray() {
  var classes = ["first", "second", "third", "fourth", "fifth", "sixth"];

  for (var i = 0; i < classes.length; i++) {
      var element = document.getElementsByClassName(classes[i])[0];
      element.classList.remove("green");
      element.classList.add("gray");
  }
}

