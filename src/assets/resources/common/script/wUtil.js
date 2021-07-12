export const wUtil = {

    //상수
    CONST: {
        VALID: {
            EMPTY: "EMPTY",
            NUMBER: "NUMBER",
            DATE_YYYYMMDD: "DATE_YYYYMMDD",
            DATE_YYYYMMDDHHMM: "DATE_YYYYMMDDHHMM",
            DATE_YYYYMMDDHHMMSS: "DATE_YYYYMMDDHHMMSS"
        },
        VALID_MESSAGE: {
            EMPTY: "값을 입력(선택) 해주세요.",
            NUMBER: "숫자만 입력할 수 있습니다.",
            DATE_YYYYMMDD: "날짜형식이 바르지 않습니다. (예: 2020-01-01)",
            DATE_YYYYMMDDHHMM: "날짜형식이 바르지 않습니다. (예: 2020-01-01 12:00)",
            DATE_YYYYMMDDHHMMSS: "날짜형식이 바르지 않습니다. (예: 2020-01-01 12:00:00)"
        },
        VALUE: {
            LAST_DAYS: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
        }


    },

    //유효성 메시지
    getValidMessage(validType){
        return this.CONST.VALID_MESSAGE[validType];
    },

    //툴팁
    tooltip(element, message, millisec){
        element.classList.add("tooltip-border");
        element.focus();

        let div = document.createElement("div");
		div.classList.add("tooltip");
		div.textContent = message;
		document.body.appendChild(div);

		div.style.top = (window.pageYOffset + element.getBoundingClientRect().top - 42) + "px";
		div.style.left = (window.pageYOffset + element.getBoundingClientRect().left) + "px";
		
		element.addEventListener("blur", () => {
            element.classList.remove("tooltip-border");
            element.removeEventListener("blur", this, false);
            div.remove();
        });

        if(millisec > 100){
            setTimeout(() => div.classList.add("tooltip-remove"), millisec);
            setTimeout(() => {
                element.classList.remove("tooltip-border");
                element.removeEventListener("blur", this, false);
                div.remove();
            }, millisec + 500);
        }
    },

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
    isArray(object){
        if(this.isEmpty(object)){
            return false;
        }else if(typeof object === "object" && typeof object.length === "number"){
            return true;
        }else{
            return false;
        }
    },

    //배열이 아닌지 체크
    isNotArray(object){
        return !this.isArray(object);
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
    ////@deactivated
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
    ////@deactivated
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
    //@deactivated
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

    valid(data, typeList){

    },

    //계좌번호 유효성 검사
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

    //날짜 유효성 검사
    isDate(date, pattern){
        let datePattern = null;
        
        switch(pattern.toUpperCase()){
        case this.CONST.VALID.DATE_YYYYMMDD:	
            datePattern = /^(19|20)\d{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])$/;	
            break;
        case this.CONST.VALID.DATE_YYYYMMDDHHMM:
            datePattern = /^(19|20)\d{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])(0[0-9]|1[0-9]|2[0-3])([0-5][0-9])$/;
            break;	
        case this.CONST.VALID.DATE_YYYYMMDDHHMMSS:
            datePattern = /^(19|20)\d{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])(0[0-9]|1[0-9]|2[0-3])([0-5][0-9])([0-5][0-9])$/;
            break;
        }

        try{
            if(datePattern.test(date)){
                if(isNaN(date) || date.length < 8){
                    return false;
                }

                let year = Number(date.substring(0, 4));
                let month = Number(date.substring(4, 6));
                let day = Number(date.substring(6, 8));

                if(month < 1 || month > 12 ) {
                    return false;
                }
                let maxDay = this.CONST.VALUE.LAST_DAYS[month-1];
                
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
    },
    
    //유효성 검사 value, checkList[]
    valid(value, key, checkList){

        let result = {};
        checkList.forEach(validType => {
            if(result.isValid == false) return;

            switch(validType){
            case this.CONST.VALID.EMPTY:
                result.isValid = this.isNotEmpty(value);
                break;
            case this.CONST.VALID.NUMBER:
                if(window.isNaN(value)){
                    result.isValid = false;
                }
                break;
            case this.CONST.VALID.DATE_YYYYMMDD:
                result.isValid = this.isDate(value, this.CONST.VALID.DATE_YYYYMMDD)
                break;
            case this.CONST.VALID.DATE_YYYYMMDDHHMM:
                result.isValid = this.isDate(value, this.CONST.VALID.DATE_YYYYMMDDHHMM);
                break;
            case this.CONST.VALID.DATE_YYYYMMDDHHMMSS:
                result.isValid = this.isDate(value, this.CONST.VALID.DATE_YYYYMMDDHHMMSS);
                break;
            }

            //유효성 검사된 항목 세팅
            if(result.isValid == false){
                result.validType = validType;
                result.key = key;
                result.value = value;
            }
        });

        return result;
    },
   
    //리스트 -> 코드Map형식으로 변환
    listToCode(list){
        return this.listToMap(list, "code", "codeNm");
    },

    //리스트 -> Map형식으로 변환
    listToMap(list, keyName, valueName){
        let result = new Object();        
        list.forEach(item => {
            result[item[keyName]] = item[valueName];
        });
        return result;
    },

    //현재 노드의 부모를 찾다가 TR태그 만날시 멈추고 반환
    getTrNode(node){
        while(true){
            if(node.tagName === "TR"){
                break;						
            }else if(node.tagName === "TABLE" || node.tagName === "BODY" || node.tagName === "HTML"){
                return null;						
            }else{
                node = node.parentNode;
            }
        }
        return node;
    },
    
    //현재 노드의 부모를 찾다가 TD태그 만날시 멈추고 반환
    getTdNode(node){
        while(true){
            if(node.tagName === "TD"){
                break;						
            }else if(node.tagName === "TABLE" || node.tagName === "BODY" || node.tagName === "HTML"){
                return null;						
            }else{
                node = node.parentNode;
            }
        }
        return node;
    },

    /**
     * 자식노드 비우기
     * @param {element} element 비울 자식노드들의 부모노드 엘리먼트 
     */
    childElementEmpty(element){
        while(element.hasChildNodes()){
            element.removeChild(element.firstChild);
        }
    },
    
    /**
     * SELECT태그, 데이터, 텍스트명, 값명, 빈값명을 받아서 셀렉트박스에 자식노드추가
     * @param {element} element 적용할 태그 엘리먼트
     * @param {objectList} dataList 적용할 데이터
     * @param {string} valueName 데이터에서 가져올 밸류 데이터 키값
     * @param {string} textName 데이터에서 가져올 텍스트 데이터 키값
     * @param {string} emptyName 첫번쨰 빈값 텍스트(ex 전체, 선택 등) 넣지않으면 넘어감
     */
    appendOptions(element, dataList, valueName, textName, emptyName){
        let option = null;

        if(this.isNotEmpty(emptyName)){
            option = document.createElement("option");
            option.textContent(emptyName);
            element.appendChild(option);
        }

        dataList.forEach(item => {
            option = document.createElement("option");
            option.textContent = item[textName];
            option.value = item[valueName];
            element.appendChild(option);
        });
    },

    /**
     * SELECT태그, 데이터, 빈값명을 받아서 셀렉트박스에 자식노드추가 (공통코드용)
     * @param {element} element 적용할 태그 엘리먼트
     * @param {objectList} dataList 적용할 데이터
     * @param {string} emptyName 첫번쨰 빈값 텍스트(ex 전체, 선택 등) 넣지않으면 넘어감
     */
    appendCodeOptions(element, dataList, emptyName){
        this.appendOptions(element, dataList, "code", "codeNm", emptyName);
    },

    /**
     * 라디오버튼 생성
     * @param {element} element 적용할 태그 엘리먼트
     * @param {objectList} dataList 적용할 데이터
     * @param {string} radioName 라디오버튼 이름태그명
     * @param {string} valueName 데이터에서 가져올 밸류 데이터 키값
     * @param {string} textName 데이터에서 가져올 텍스트 데이터 키값
     */
    appendRadio(element, dataList, radioName, valueName, textName){
        let input = null;
        let label = null;
        
        dataList.forEach((item, idx) => {
            input = document.createElement("input");
            input.name = radioName;
            input.id = radioName + idx;
            input.value = item[valueName];
            input.setAttribute("type", "radio");

            label = document.createElement("label");
            label.textContent = item[textName];
            label.setAttribute("for", radioName + idx);

            element.appendChild(input);
            element.appendChild(label);
        });
    },

    /**
     * 라디오버튼 생성(공통코드용)
     * @param {element} element 적용할 태그 엘리먼트
     * @param {objectList} dataList 적용할 데이터
     * @param {string} radioName 라디오버튼 이름태그명
     */    
    appendCodeRadio(element, dataList, radioName){
        this.appendRadio(element, dataList, radioName, "code", "codeNm");
    }
}