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
        now_: 0,
        tags: [],
        selected: 0,
        newName: ""
    },
    created: function(){
        var stored = localStorage.getItem("tags");
        if(stored != null){
            this.tags = JSON.parse(stored);
            this.selected = this.tags[0].id;
            this.setForm();
        }
        if(this.tags.length == 0){
            this.addNewTag();
            this.addNewTag();
            this.addNewTag();
            this.setForm();
        }
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
        },
        selectedTag: function(){
            var tag = null;
            for(var i = 0; i < this.tags.length; i++){
                if(this.tags[i].id == this.selected){
                    tag = this.tags[i];
                    break;
                }
            }
            return tag;
        },
        selectedTagTime: function(){
            return this.formatSeconds(this.selectedTag);
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
            var tag = this.selectedTag;
            var elapse = moment.duration(this.now_.diff(this.startTime)).asSeconds();
            tag.seconds += elapse;
            this.save();
            this.startTime = 0;
            this.now_ = 0;
        },
        formatSeconds: function(tag){
            var elapse = moment.duration(tag.seconds, "seconds");
            var formatted = moment.utc(elapse.asMilliseconds()).format("H[h] m[m] s[s]");  //up to 24h
            return formatted;
        },
        setForm: function(){
            var tag = this.selectedTag;
            this.newName = tag.name;
        },
        doneEdit: function(){
            var tag = this.selectedTag;
            var newName = this.newName.trim();
            if(newName){
                tag.name = newName;
                this.save();
            }
        },
        clearSeconds: function(){
            var tag = this.selectedTag;
            tag.seconds = 0;
            this.save();
        },
        removeTag: function(){
            var tag = this.selectedTag;
            this.tags.splice(this.tags.indexOf(tag), 1);
            this.save();
            this.selected = this.tags[0].id;
            this.setForm();
        },
        addNewTag: function(){
            var index = this.tags.length;
            var name = this.newName ? this.newName : ("Task" + index);
            var tag = {"id": index, "name": name, "seconds": 0};
            this.tags.push(tag);
            this.save();
            this.selected = this.tags[this.tags.length - 1].id;
            this.setForm();
        },
        save: function(){
            localStorage.setItem("tags", JSON.stringify(this.tags));
        }
    }
})
