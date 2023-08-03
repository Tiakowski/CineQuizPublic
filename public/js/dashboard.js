new Vue({
    el: '#dashboard',
    data: {
      showUsers: false,
      showProblems: false,
      showSuggestions: false,
      showPosters: false,
      users: [],
      problems: [],
      suggestions: [],
      posters: []
    },
    methods: {
      showUsersTable(){
        this.showPosters = false
        this.showSuggestions = false
        this.showProblems = false
        this.showUsers = true
        
        axios.get('/api/user/getallusers')
          .then(response => {
            const users = response.data
            this.users = users;
          })
          .catch(error => {
            if (error.message !== 'A listener indicated an asynchronous response by returning true, but the message channel closed before a response was received') {
              console.log(error)
            }
          });

          console.log(this.users)
      },
      showProblemsTable(){
        this.showUsers = false
        this.showPosters = false
        this.showSuggestions = false
        this.showProblems = true

        axios.get('/api/feedback/getproblems')
          .then(response => {
            const problems = response.data
            this.problems = problems;
          })
          .catch(error => {
            if (error.message !== 'A listener indicated an asynchronous response by returning true, but the message channel closed before a response was received') {
              console.log(error)
            }
          });


      },
      showSuggestionsTable(){
        this.showUsers = false
        this.showPosters = false
        this.showProblems = false
        this.showSuggestions = true

        axios.get('/api/feedback/getsuggestions')
          .then(response => {
            const suggestions  = response.data
            this.suggestions = suggestions;
          })
          .catch(error => {
            if (error.message !== 'A listener indicated an asynchronous response by returning true, but the message channel closed before a response was received') {
              console.log(error)
            }
          });

      },
      showPostersTable(){
        this.showUsers = false
        this.showProblems = false
        this.showSuggestions = false
        this.showPosters = true

        axios.get('/api/feedback/getposters')
          .then(response => {
            const posters  = response.data
            this.posters = posters;
          })
          .catch(error => {
            if (error.message !== 'A listener indicated an asynchronous response by returning true, but the message channel closed before a response was received') {
              console.log(error)
            }
          });

      },
      async deleteUser(id) {
        try {
          const role = await axios.get('/api/role/getrole/' + id);
          const response = await axios.get(`/api/feedback/deleteuser/${id}/${role.data.role}`);
          console.log(response);
        } catch (error) {
          console.log(error);
        }
      },
      
      deleteFeedback(id){
        axios.get('/api/feedback/deletefeedback/'+id)
          .then(response => {
            console.log(response)
          })
          .catch(error => {
            if (error.message !== 'A listener indicated an asynchronous response by returning true, but the message channel closed before a response was received') {
              console.log(error)
            }
          });
      },
      changeRole(id, role){
        const data = {
          id, role
        }
        axios.post("/api/role/changerole", data)
        .then(response => {
          console.log(response)
        }).catch(error => {
          console.log(error)
        })
      }

    },
  });
  
  document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('dashboard').style.display = "flex"
  });