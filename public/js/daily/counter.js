new Vue({
    el: '#counter',
    data: {
        hours: 0,
        separateHours: ":",
        minutes: 0,
        seconds: 0

    },
    created(){
        this.update();
        setInterval(this.update, 1000);
    },
    methods: {
        update(){
            const now = new Date()
            const midnight = new Date()
            midnight.setHours(24, 0, 0, 0)

            const diff = midnight - now
            this.hours = Math.floor(diff / (1000 * 60 * 60)).toString().padStart(2, '0');
            if(this.hours == "00"){
                this.hours = ''
                this.separateHours = ''
            } else {
                this.separateHours = ':'
            }
            this.minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
            this.seconds = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0');
            
        }
    }
  });
  

