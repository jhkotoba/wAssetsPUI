export let wUtil = {
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
    runFunctionIfNotEmpty(fn){
        if(!this.isEmpty(fn)){
            fn();
        }
    }
}