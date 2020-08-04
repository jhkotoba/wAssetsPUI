window.wUtil  = {
    //빈값 체크
    isEmpty(data){
        let val = null;
        if(typeof data === "string"){
            val = data.trim();
        }else{
            val = data;
        }             
        if(val === "" || val === null || val === undefined){
           return true;
        }else{
           return false;
        }
    },

    //비어있지 않으면 전달받은 함수 실행
    runFunctionIfNotEmpty(fn, args){
        if(!this.isEmpty(fn)){
            return fn(args);
        }
    },

    setCookie(name, value, expires){   
        let date = new Date();
        date.setTime(date.getTime() + expires * 86400000);
        document.cookie = name + "=" + value + ";expires=" + date.toUTCString() + ";path=/";
    },

    getCookie(name){
        return document.cookie.split("; ").find(row => row.startsWith(name)).split("=")[1];
    },

    isCookie(name){        
        if (document.cookie.split(";").some((item) => item.trim().startsWith(name+"="))) {
            return true;
        }else{
            return false;
        }
    },

    removeCookie(name){
        document.cookie = name + '=; expires=Thu, 01 Jan 1999 00:00:10 GMT;';
    }
}