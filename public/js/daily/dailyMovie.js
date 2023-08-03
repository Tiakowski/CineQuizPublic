var movies = []
var tips = ['runtime', 'year','genre', 'director', 'star1', 'star2']
var tipsPtBr = ["Tempo de filme", "Ano de lançamento", "Gênero", "Diretor", "Atores", "Atores"]
var currentMovie = -1
var chances = ["first", "second", "third", "fourth", "fifth", "sixth"];
var moviesNumber = 0;

new Vue({
    el: '#dailyMovie',
    data: {
        buttonTip: true,
        buttonTipContent:'Próxima dica',
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
        theme: "Ex: Diretor do filme",
        tip: "Christopher Nolan<br>",
        poster: '',
        title: '',
        resposta: '',
        meta: '?',
        points: 0,
        skip: 3,
        isDisabledNextTip: true,
        isDisabledChances: true,
        isDisabledSkip: false,
        isDisabledNext: true,
        isDisabledInput: true,
        isDisabledInputButton: true,
        timeout: null
    },
    mounted(){
        axios.get('/api/movie/getdailymovie')
                .then(response => {
                   currentMovie = response.data

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
    computed: {
        colors(){
            if (this.meta >= 0 && this.meta <= 39) {
                return 'meta-red';
              } else if (this.meta >= 40 && this.meta <= 74) {
                return 'meta-yellow';
              } else if (this.meta >= 75) {
                return 'meta-green';
              } else {
                return '';
              }
        },
    },
    methods: {
        fetchSuggestionsDebounced(){
            clearTimeout(this.timeout);

            this.timeout = setTimeout(()=> {
                this.fetchSuggestions();
            },300)
        },

        fetchSuggestions() {
            if (!this.searchTerm) {
                this.suggestions = [];
                return;
            }
            axios.get('/api/movies/search/' + this.searchTerm)
                .then(response => {
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
            this.searchTerm = suggestion.title;
            this.suggestions = [];

        },

        //Quiz

        saveLastGame(){
          const today = new Date().toLocaleDateString();
          localStorage.setItem('lastplay', today)
        },

        userPlayed(){
          const today = new Date().toLocaleDateString();
          const lastplay = localStorage.getItem('lastplay')
          if(today == lastplay){
            this.playedToday = true
          } else { 
            this.playedToday = false
          }
        },



        start() {
            this.showStartButton = false
            this.showBlackScreen = false
            turniningGreen()
            this.getTip()
            this.getMeta()
            this.isDisabledInput = false,
            this.isDisabledInputButton = false
            this.isDisabledNextTip = false,
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
            var theme = tips[0]
            var tema = tipsPtBr[0]
            this.theme = tema
            tips.splice(0, 1)
            tipsPtBr.splice(0,1)
            
            axios.get('/api/movies/getmovie/' + currentMovie + "/" + theme)
                .then(response => {
                    if(theme == "star1"){
                        this.tip = response.data["star1"] + "<br>" + response.data["star2"];
                    } else if (theme == "star2") {
                        this.tip = response.data["star3"] + "<br>" + response.data["star4"];
                    } else if (theme == 'runtime') {
                        var totalMinutes = response.data['runtime']
                        const hours = Math.floor(totalMinutes / 60);
                        const minutes = totalMinutes % 60
                        this.tip = `${hours}h ${minutes}min`
                    } else {
                        this.tip = response.data[theme]
                    }

                this.saveTip(tema,this.tip)
                })
                .catch(error => {
                    if (error.message !== 'A listener indicated an asynchronous response by returning true, but the message channel closed before a response was received') {
                        console.log(error)
                    }
                });
        },
        verify(){
            if (this.searchTerm.trim() === "") {
                return;
              }
              
            axios.get('/api/movies/verify/' + currentMovie + "/" + this.searchTerm)
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
            axios.get("/api/movies/poster/" + currentMovie)
                    .then(response => {
                        this.poster = response.data.poster;
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

            axios.get("/api/movies/title/" + currentMovie)
                .then(response => {
                    this.title = response.data.title;
                    })
                .catch(error => {
                    console.log(error)
                    })
            
            this.callLost = true
            this.buttonTipContent = 'Próxima dica'
            this.saveLastGame()
        },

        repeat(){
            this.buttonTipContent = "Próxima dica"
            this.nextMovie()
            this.points = 0
            this.skip = 3
            this.tips = []
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
            axios.get("/api/movies/poster/" + currentMovie)
                    .then(response => {
                        this.poster = response.data.poster;

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

                axios.get("/api/movies/title/" + currentMovie)
                .then(response => {
                    this.title = response.data.title;
                    })
                .catch(error => {
                    console.log(error)
                    })
                  this.saveLastGame()

        },

        nextMovie(){
            this.tips = [];
            chances = ["first", "second", "third", "fourth", "fifth", "sixth"];
            tips = ['year', 'runtime','genre', 'director', 'star1', 'star2']
            tipsPtBr = ["Ano", "Tempo de filme", "Gênero", "Diretor", "Atores", "Atores"]
            this.poster = ''
            this.callLost = false
            this.showNextButton = false,
            this.getTip()
            turniningGreen()
            this.getMeta()
        },

        skipMovie(){
            this.buttonTipContent = 'Próxima dica'
            if(this.skip == 1){
                this.isDisabledSkip = true
            }

            if(this.skip != 0 && currentMovie != -1) {
            this.nextMovie()
            this.isDisabled = false
            this.skip -= 1
            this.isDisabled = true
            }
            this.getMeta()
        },

        savePoints(){
            axios.get("api/movies/newrecord/"+this.points)
                .then(response => {
                    
                    })
                .catch(error => {
                    console.log(error)
                    })

        },

        getMeta(){
            axios.get("/api/movie/meta/"+currentMovie)
            .then(response => {
                this.meta = response.data.meta_score
            }).catch(error => {

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

