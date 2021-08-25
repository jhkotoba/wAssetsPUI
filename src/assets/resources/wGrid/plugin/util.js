export const UTL = {
    isEmpty(value){
        if(typeof value === "string"){
            if(value.trim() === "") return true;
            else return false;
        }else{
            if(value === undefined || value === null) return true;
            else return false;
        }
    },
    isNotEmpty(value){ 
        return !this.isEmpty(value);
    },
    isFunction(value){
        if(this.isEmpty(value)){
            return false;
        }else if(typeof value === "function"){
            return true;
        }else{
            return false;
        }
    },
    isNotEmptyChildObjct(value, ...arge){
        if(this.isEmpty(value)){
            return false;
        }else{
            let obj = value;
            for(var i=0; i<arge.length; i++){
                if(obj[arge[i]]){
                    obj = obj[arge[i]];
                }else{
                    return false;
                }
            }
            return true;
        }
    },
    isEmptyRtn(value, emptyValue){
        if(this.isEmpty(value)){
            return emptyValue;
        }else{
            return value;
        }
    },
    isFunction(fn){
        if(fn == null || fn == undefined){
            return false;
        }else if(typeof fn === "function"){
            return true;
        }else{
            return false;
        }
    },
    addStyleAttribute(element, style, attribute){
        switch(style){
            case "width":
            case "height":
                if(this.isNotEmpty(attribute)){
                    if(typeof attribute === "number"){
                        element.style[style] = attribute + "px";
                    }else{
                        element.style[style] = attribute;
                    }
                }
                break;
            default: 
                element.style[style] = attribute;
                break;
        }
    },
    //자식 노드 비우기
    childElementEmpty(element){
        while(element.hasChildNodes()){
            element.removeChild(element.firstChild);
        }
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
    //데이터 날짜 포멧(YYYY-MM-DD)
    dateFormat(value){
        //밀리초로 판단
        if(typeof value === "number"){
            let date = new Date(value);
            return date.getFullYear() + "-" 
            + date.getMonth() < 11 ? "0" + (date.getMonth()+1) : (date.getMonth() + 1) + "-"
            + date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        }else if(typeof value === "string"){
            if(value.length === 8){
                return value.substring(0,4) + "-" + value.substring(4,6) + "-" + value.substring(6,8);
            }else if(value.length === 10){
                return value.replace(".", "-").replace(".", "-");
            }else if(value.length > 10){
                if(value.indexOf("-") > -1 || value.indexOf(".") > -1){
                    return value.substring(0,10).replace(".", "-").replace(".", "-");
                }else{
                    return value.substring(0,4) + "-" + value.substring(4,6) + "-" + value.substring(6,8);
                }
            }else{
                return "";
            }
        }else{
            return "";
        }
    },
    //데이터 날짜 포멧(YYYY-MM-DD HH:MM:SS)
    dateTimeFormat(value){
        //밀리초로 판단
        if(typeof value === "number"){
            let date = new Date(value);
            return date.getFullYear() + "-" 
            + date.getMonth() < 11 ? "0" + (date.getMonth()+1) : (date.getMonth() + 1) + "-"
            + date.getDate() < 10 ? "0" + date.getDate() : date.getDate()
            + " "
            + date.getHours() < 10 ? "0" + date.getHours() : date.getHours() + ":"
            + date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes() + ":"
            + date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
        }else if(typeof value === "string"){
            if(value.length === 8){
                return value.substring(0,4) + "-" + value.substring(4,6) + "-" + value.substring(6,8) + " 00:00:00";
            }else if(value.length === 10){
                return value.replace(".", "-").replace(".", "-") + " 00:00:00";
            }else if(value.length === 14){
                return value.substring(0,4) + "-" + value.substring(4,6) + "-" + value.substring(6,8)
                    + " " + value.substring(8,10) + ":" + value.substring(10,12) + ":" + value.substring(12,14);
            }else if(value.length > 19){
                if(value.indexOf("-") > -1 || value.indexOf(".") > -1){
                    return value.substring(0,10).replace(".", "-").replace(".", "-");
                }else{
                    return value.substring(0,4) + "-" + value.substring(4,6) + "-" + value.substring(6,8)
                        + " " + value.substring(8,10) + ":" + value.substring(10,12) + ":" + value.substring(12,14);
                }
            }else{
                return "";
            }
        }else{
            return "";
        }
    }
}