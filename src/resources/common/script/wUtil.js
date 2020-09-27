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

    isNotEmpty(data){
        return !this.isEmpty(data);
    },

    //빈값 체크 후 비어있지 않으면 인자값 반환, 비어있으면 2번째 인자값 반환
    isEmptyRtn(confirmData, emptyRtnData){
        if(isEmpty(confirmData)){
           return confirmData;
        }else{
            return emptyRtnData;
        }
    },

    //비어있지 않으면 전달받은 함수 실행
    runFunctionIfNotEmpty(fn, args){
        if(!this.isEmpty(fn)){
            if(typeof fn === "function"){
                return fn(args);
            }
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
    },

    setAttributes(element, obj){
        for(key in obj){
            element.setAttribute(key, obj[key]);
        }        
    },

    childEmpty(elementId){
        let el = document.getElementById(elementId);
        while(el.hasChildNodes()){
            el.removeChild(el.firstChild);
        }
    },

    blindShow(){
        let blind = document.getElementById("blind");
        blind.classList.remove("hide");
    },
    blindHide(){
        let blind = document.getElementById("blind");
        blind.classList.add("hide");
    }



    
}