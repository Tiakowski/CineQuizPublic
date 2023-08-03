new Vue({
    el: '#dailyControl',
    data: {
      id: 0,
      searchTerm: '',
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
      allDailyMovies: []
    },
    mounted(){
      this.getAllDailyMovies()
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
            if(!response.data){
              this.suggestions = []
            }
            const users = response.data
            this.suggestions = users;
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
    }

    
    }
  });
  

