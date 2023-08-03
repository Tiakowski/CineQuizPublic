new Vue({
    el: '#app',
    data: {
      searchTerm: '',
      suggestions: []
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
        axios.get('/api/user/search/' + this.searchTerm)
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

      }
    }
  });
  

