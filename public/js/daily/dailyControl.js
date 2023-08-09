new Vue({
    el: '#dailyControl',
    data: {
      id: 0,
      searchTerm: '',
      searchTermMusic: '',
      date:'',
      title_no_accent:'',
      runtime:'',
      genre:'',
      metascore: '',
      director: '',
      actor1: '',
      actor2:'',
      actor3:'',
      actor4:'',
      year:'',
      poster:'',
      suggestions: [],
      musicSuggestions:[],
      allDailyMovies: [],
      allDailyMusics: [],
      titleMusic: '',
      musicDate:'',
      singer:'',
      lyrics_1:'',
      lyrics_2:'',
      lyrics_3:'',
      lyrics_4:'',
      lyrics_5:'',
      lyrics_6:''
    },
    mounted(){
      this.getAllDailyMovies(),
      this.getAllDailyMusics()
    },
    methods: {
      fetchSuggestionsDebounced(type){
        clearTimeout(this.timeout);

        this.timeout = setTimeout(()=> {
            this.fetchSuggestions(type);
        },300)
    },
      fetchSuggestions(type) {
        if(type == "movies"){
          if (!this.searchTerm) {
            this.suggestions = [];
            return;
          }
        }  else if (type == 'music') {
          if (!this.searchTermMusic) {
            this.musicSuggestions = [];
            return;
        }
        }

        var search = null
        if(type == "movies"){
          search = this.searchTerm
        } else {
          search = this.searchTermMusic
        }

        axios.get(`/api/${type}/search/${search}`)
          .then(response => {
            if(type == "movies"){
              const data = response.data
              this.suggestions = data;
            } else if (type == "music"){
              const data = response.data
              this.musicSuggestions = data
            }
             

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
      selectMusicSuggestion(suggestion){
        this.searchTermMusic = suggestion.singer;
        this.musicSuggestions = [];
      },
    getmovie(){
        axios.get("/api/movie/dashboardgetmovie/"+this.searchTerm).then(response => {
            const movie = response.data;
            this.title_no_accent = movie.no_accent;
            this.runtime = parseInt(movie.runtime);
            this.genre = movie.genre;
            this.metascore = movie.meta_score;
            this.director = movie.director;
            this.actor1 = movie.star1;
            this.actor2 = movie.star2;
            this.actor3 = movie.star3;
            this.actor4 = movie.star4;
            this.year = movie.year;
            this.poster = movie.poster;
            this.id = movie.id;
           
        }).catch(error => {
            console.log(error)
        })
    },
    addMovie(){
        const data = {
            title: this.searchTerm,
            runtime: this.runtime,
            genre: this.genre,
            metascore: this.metascore,
            director: this.director,
            actor1: this.actor1,
            actor2: this.actor2,
            actor3: this.actor3,
            actor4: this.actor4,
            year: this.year,
            poster: this.poster,
            date: this.date,
            id_movie: this.id
        }
          axios.post("/api/movie/daily/attmovie", data)
          .then(response => {
              console.log(response)
          }).catch(error => {
              console.log(error)
          })

    },
    getAllDailyMovies(){
      axios.get("/api/movie/getalldailymovie").then(response => {
        this.allDailyMovies = response.data
      }).catch(error => {
        console.log(error)
      })
    },
                    // MÚSICA


    addMusic(){
      const music = {
        singer: this.searchTermMusic,
        date: this.musicDate,
        title: this.titleMusic,
        lyrics_1: this.lyrics_1,
        lyrics_2: this.lyrics_2,
        lyrics_3: this.lyrics_3,
        lyrics_4: this.lyrics_4,
        lyrics_5: this.lyrics_5,
        lyrics_6: this.lyrics_6,
        poster: this.poster
      }
      axios.post("/api/movie/daily/addmusic", music)
          .then(response => {
            this.searchTermMusic = '';
            this.musicDate = '';
            this.titleMusic = '';
            this.lyrics_1 = '';
            this.lyrics_2 = '';
            this.lyrics_3 = '';
            this.lyrics_4 = '';
            this.lyrics_5 = '';
            this.lyrics_6 = '';
            this.poster = '';

          }).catch(error => {
              console.log(error)
          })
      
    },
    getAllDailyMusics(){
      axios.get("/api/music/getalldailymusics").then(response => {
        this.allDailyMusics = response.data
      }).catch(error => {
        console.log(error)
      })
    },

    deleteMusic(id){
      axios.get("/api/music/deletemusic/"+id).then(response => {
        console.log(response.data)
      }).catch(error => {
        console.log(error)
      })
    }
    


    
    }
  });
  

