Vue.component("digit-template", {
    props: ["digit"],
    template: "#digit-template",
    computed: {
        digitClass: function(){
            return "counter--" + this.digit;
        }
    }
});

Vue.config.debug = true;
var app = new Vue({
    el: "#stopWatch",
    data: {
        timer: null,
        startTime: 0,
        now_: 0
    },
    computed: {
        elapse: function(){
            var elapseArray = "00000000".split("");
            if(this.now_ != 0){
                var elapse = moment.duration(this.now_.diff(this.startTime));
                elapseArray = moment.utc(elapse.as("milliseconds")).format("HHmmssSS").split("");
            }
            return elapseArray;
        },
        starting: function(){
            return this.timer != null ? true : false;
        }
    },
    methods: {
        start: function(){
            if(this.startTime == 0){
                this.startTime = moment();
            }else{
                var elapse = moment.duration(this.now_.diff(this.startTime));
                this.startTime = moment().subtract(elapse);
            }
            var self = this;
            this.timer = setInterval(function(){
                self.now_ = moment();
            }, 10)
        },
        stop: function(){
            clearInterval(this.timer);
            this.timer = null;
        },
        reset: function(){
            if(this.timer != null){
                this.stop();
            }
            this.startTime = 0;
            this.now_ = 0;
        }
    }
})
