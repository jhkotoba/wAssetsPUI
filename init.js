const fs = require("fs");
const init = {
    express: null,
    app: null,    
    start: function(express, app){
        this.express = express;
        this.app = app;

        this.import("src");        
    },
    //정적 리소스 임포트
    import: function(root){        
        fs.readdirSync("./" + root, { withFileTypes: true }).forEach(item => {            
            if(item.isDirectory()){
                this.app.use("/"+item.name, this.express.static(__dirname  + '\\' + root + '\\' +item.name));
            }
        });
    }
}
module.exports = init;