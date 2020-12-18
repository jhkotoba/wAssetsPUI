export const wUtil = {
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

    //not 빈값체크
    isNotEmpty(data){
        return !this.isEmpty(data);
    },

    //빈값 체크 후 비어있지 않으면 인자값 반환, 비어있으면 2번째 인자값 반환
    isEmptyRtn(confirmData, emptyRtnData){
        if(!this.isEmpty(confirmData)){
           return confirmData;
        }else{
            return emptyRtnData;
        }
    },

    //배열인지 체크
    isArray(obj){
        if(this.isEmpty(obj)){
            return false;
        }else if(typeof obj === "object" && typeof obj.length === "number"){
            return true;
        }else{
            return false;
        }
    },

    //배열이 아닌지 체크
    isNotArray(obj){
        return !this.isArray(obj);
    },

    //비어있지 않으면 전달받은 함수 실행
    runFunctionIfNotEmpty(fn, args){
        if(!this.isEmpty(fn)){
            if(typeof fn === "function"){
                return fn(args);
            }
        }
    },

    //set 쿠키
    setCookie(name, value, expires){
        let date = new Date();
        date.setTime(date.getTime() + expires * 86400000);
        document.cookie = name + "=" + value + ";expires=" + date.toUTCString() + ";path=/";
    },

    //get 쿠키
    getCookie(name){
        return document.cookie.split("; ").find(row => row.startsWith(name)).split("=")[1];
    },

    //쿠키 확인
    isCookie(name){
        if (document.cookie.split(";").some((item) => item.trim().startsWith(name+"="))) {
            return true;
        }else{
            return false;
        }
    },

    //쿠키 삭제
    removeCookie(name){
        document.cookie = name + '=; expires=Thu, 01 Jan 1999 00:00:10 GMT;';
    },

    //속성s 추가
    setAttributes(element, obj){
        for(let key in obj){
            element.setAttribute(key, obj[key]);
        }        
    },

    //자식 노드 비우기
    childEmpty(elementId){
        let el = document.getElementById(elementId);
        while(el.hasChildNodes()){
            el.removeChild(el.firstChild);
        }
    },

    //블라인트 보이기
    blindShow(){
        let blind = document.getElementById("blind");
        blind.classList.remove("hide");
    },
    
    //블라인트 숨기기
    blindHide(){
        let blind = document.getElementById("blind");
        blind.classList.add("hide");
    },

    //라디오값 가져오기
    getRadioValue(name){
        let radio = document.getElementsByName(name);
        for(let i=0; i<radio.length; i++){
            if(radio[i].checked){
                return radio[i].value;
            }
        }
    },

    //파라미터 가져오기
    getParams(list, option){
        let element, value, temp = null, data = {};
        let result = {isValid: true, message: null, data: null};

        list.forEach(item => {

            if(result.isValid === false) return;

            switch(item.type){
            case "input" :
                element = document.getElementById(item.target);
                value = element.value;
                break;
            case "raido" :
                value = this.getRadioValue(item.target);
                break;
            case "check" :
                element = document.getElementById(item.target);
                value = element.checked ? "Y" : "N";
                break;
            case "select" :
                element = document.getElementById(item.target);
                value = element.value;
                break;
            }
            
            if(option.isValid && item.valid){
                for(let i=0; i<item.valid.length; i++){
                    let valid = this.validCheck(item.valid[i], value, item.title);                    
                    if(valid.isValid === false){
                        result.isValid = valid.isValid;
                        result.message = valid.message;
                        result.element = element;
                        result.data = null;
                        
                        if(option.isAlert){
                            alert(valid.message);
                        }
                        if(option.isFocus){
                            switch(item.type){
                                case "input": 
                                case "select": 
                                    element.focus();
                                    break;
                                case "raido":
                                    element = document.getElementsByName(item.target);
                                    if(this.isNotEmpty(element) && element.length > 0){                                        
                                        element[0].focus();
                                    }
                                    break;
                                case "check":
                                    element.focus(); 
                                    break;
                            }
                        }

                        break;
                    }
                }
            }

            if(result.isValid){
                data[item.target] = value;
            }
        });
        result.data = data;
        return result;
    },

    //파라미터 가져오기 및 밸리데이션 체크
    //id값의 value값 가져오기 id는 밸류데이션 체크
    getParams_old(objs){
        let result = {isValid: true, msg: null, data: null};
        if(this.isNotArray(objs)){
            return result;
        }

        let data = {}, element = null;
        objs.forEach(item => {

            if(result.isValid === false) return;
            
            if(this.isNotEmpty(item.id) && typeof item.id === "string"){
                element = document.getElementById(item.id);

                //값 대입
                switch(element.type){
                    case "checkbox" :
                        data[item.id] = element.checked ? "Y" : "N";
                        break;

                    default :
                        //밸류데이션 체크
                        if(this.isArray(item.valid)){
                            let resValid;
                            for(let i=0; i<item.valid.length; i++){
                                resValid = this.validCheck(item.valid[i], element.value, item.title);
                                if(resValid.isValid === false){
                                    result.isValid = resValid.isValid;
                                    result.msg = resValid.msg;
                                    result.target = element;
                                    data = null;
                                    break;
                                }
                            }
                        }
                        if(result.isValid){
                            data[item.id] = element.value;
                        }
                        break;
                }
                
            }else if(this.isNotEmpty(item.name) && typeof item.name === "string"){
                data[item.name] = this.getRadioValue(item.name);
            }
        });
        result.data = data;
        return result;
    },

    //밸리데이션 체크
    //  notEmpty    => 비어있는 값 체크                 => "값이 비어있습니다."
    //  accountNum  => 계좌번호 형식체크                => "계좌번호 형식이 바르지 않습니다."
    //  date        => 날짜체크(YYYY-MM-DD)             => "날짜형식이 바르지 않습니다."
    //  datetime    => 날짜체크(YYYY-MM-DD HH:MM:SS)    => "날짜형식이 바르지 않습니다."
    validCheck(validNm, value, title){
        let result = {};

        console.log("validCheck:", validNm );

        let titleValue = this.isEmptyRtn(title, "");
        titleValue = titleValue == "" ? "" : titleValue + "의 "

        switch(validNm){
        case "notEmpty":
            result.isValid = this.isNotEmpty(value);
            result.message = titleValue + "값이 비어있습니다.";
            break;
        case "accountNumber":
            result.isValid = this.isAccountNumber(value);
            result.message = "계좌번호 형식이 바르지 않습니다.";
            break;
        case "date":
            result.isValid = this.isDate(value, "YYYY-MM-DD");
            result.message = titleValue + "날짜형식이 바르지 않습니다.";
            break;
        case "dateMinute":
            result.isValid = this.isDate(value, "YYYY-MM-DD HH:MM");
            result.message = titleValue + "날짜형식이 바르지 않습니다.";
            break;
        case "datetime":
            result.isValid = this.isDate(value, "YYYY-MM-DD HH:MM:SS");
            result.message = titleValue + "날짜형식이 바르지 않습니다.";
            break;
        }

        return result;
    },

    isAccountNumber(value){
        let pattern = /^[0-9]*$/;
        if(pattern.test(value)){
            return true;
        }else{
            if(String(value).indexOf("--") == -1){
                return true;
            }else{
                return false;
            }
        }
    },

    //날짜 밸리데이션 체크
    isDate(date, pattern){
        let datePattern = null;
        
        switch(pattern.toUpperCase()){
        case "YYYY-MM-DD":	
            datePattern = /^(19|20)\d{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[0-1])$/;	
            break;
        case "YYYY-MM-DD HH:MM":
            datePattern = /^(19|20)\d{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[0-1]) (0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/;
            break;	
        case "YYYY-MM-DD HH:MM:SS":
            datePattern = /^(19|20)\d{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[0-1]) (0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
            break;
        }

        try{
            if(datePattern.test(date)){
                let checkDate = date.replace(/[^0-9]/g,"");
                    
                if(isNaN(checkDate) || checkDate.length < 8){
                    return false;
                }
                
                let year = Number(checkDate.substring(0, 4));
                let month = Number(checkDate.substring(4, 6));
                let day = Number(checkDate.substring(6, 8));

                if(month < 1 || month > 12 ) {
                    return false;
                }

                let lastDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                let maxDay = lastDays[month-1];
                
                if(month === 2 && (year % 4 === 0 && year % 100 !== 0 || year % 400 ===0)){
                    maxDay = 29;
                }
                    
                if(day <= 0 || day > maxDay){
                    return false;
                }
                return true;
            }else{
                return false;
            }
        }catch(err){
            return false;
        }
    }
}