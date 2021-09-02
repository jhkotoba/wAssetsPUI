import { UTL } from "./util.js";

/**
 * wGird 초기생성
 */
export const CST = {

    /**
     * 그리드 상태값 생성
     * @returns 
     */   
    createState(){
        return {
            curSeq: 0,      //현재 시퀀스
            seqIndex: {},   //데이터 맵 key sequence value index
            idxSequence: {} //데이터 맵 key index value sequence
        }
    },

    /**
     * wGrid 생성시 엘리먼트 값 저장
     * @param {string} targetId 
     * @returns 
     */
    createElement(targetId){
        return {
            id: targetId,
            target: document.getElementById(targetId),
            head : document.createElement("div"),
            headTb : document.createElement("table"),
            headTr : document.createElement("tr"),
            body: document.createElement("div"),
            bodyTb : document.createElement("table")
        }
    },

    /**
     * wGrid 생성시 그리드 내부 상수 세팅
     * @returns 
     */
    createConstant(){
        return {
            STATE: {
                SELECT: "SELECT",
                INSERT: "INSERT",
                UPDATE: "UPDATE",
                REMOVE: "REMOVE"
            },
            TR_CLS_STATE: {
                SELECT: "",
                INSERT: "wgrid-insert-tr",
                UPDATE: "wgrid-update-tr",
                REMOVE: "wgrid-remove-tr"
            },
            TAG_CLS_STATE:{
                SELECT: "",
                INSERT: "wgrid-insert-tag",
                UPDATE: "wgrid-update-tag",
                REMOVE: "wgrid-remove-tag"
            },
            EMPTY: "EMPTY"
        }

    },

    /**
     * wGrid 생성시 옵션 세팅
     * @param {object} paramater 
     * @returns 
     */
    createOption(paramater){

        //옵션 기본값 세팅
        let option = {           
            grid: {
                style:{
                    width: 1000, 
                    height: 500  
                }
            },
            head: {

            },            
            row: {
                style:{                    
                    cursor: "inherit" 
                }
            },
            cell: {

            }
        }

        //옵션값 세팅
        if(paramater.option){
            if(paramater.option.grid){
                if(paramater.option.grid.style){
                    if(paramater.option.grid.style.width){
                        option.grid.style.width = paramater.option.grid.style.width;
                    }
                    if(paramater.option.grid.style.height){
                        option.grid.style.height = paramater.option.grid.style.height;
                    }
                }
            }
            if(paramater.option.row){
                if(paramater.option.row.style){
                    if(paramater.option.row.style.cursor){
                        option.row.style.cursor = paramater.option.row.style.cursor;
                    }
                }
            }
        }

        return option;
    },

    /**
     * wGrid 생성시 그리드 세팅
     * @param {element} element 
     * @param {object} paramater 
     */
    settingGrid(element, paramater){
        element.target.classList.add("wgrid-field");
        element.target.style.width = paramater.option.grid.style.width + "px";
        element.target.style.height = paramater.option.grid.style.height + "px";
    },

    //
    /**
     * wGrid 생성시 그리드 이벤트 세팅
     * @param {element} self 
     * @param {object} paramater 
     * @returns 
     */
    createEvent(self, paramater){

        //생성할 이벤트 종류
        let evList = ["click", "change", "keyup"];
        //정의할 이벤트
        let innerEvent = {};

        //필드 이벤트 세팅
        for(let i=0; i<paramater.fields.length; i++){
            
            let item = paramater.fields[i];
            
            //빈값이면 통과
            if(item.event == undefined || item.event == null){
                continue;
            }

            //그리드 내부 연결 이벤트 세팅
            evList.forEach(evName => {                
                if(item.event[evName]){
                    innerEvent[item.name] = {
                        head: item.event[evName].head ? item.event[evName].head : null,
                        body: item.event[evName].body ? item.event[evName].body : null
                    }
                }
            });            
        }

        //헤드 이벤트 세팅
        for(let i=0; i<evList.length; i++){
            //이벤트 등록
            self.element.head.addEventListener(evList[i], event => {
                if(innerEvent[event.target.name]
                    && innerEvent[event.target.name][evList[i]]
                    && innerEvent[event.target.name][evList[i]].head ){
                    //연결된 이벤트 호출
                    innerEvent[event.target.name][evList[i]].head(event);
                }
                event.stopPropagation();
            });
        }

        //바디 이벤트 세팅
        for(let i=0; i<evList.length; i++){            
            self.element.body.addEventListener(evList[i], event => {
                
                let sequence = self.closest("TR", event.target).dataset.rowSeq;
                let index = self.getSeqIndex(sequence);
                
                //연결할 이벤트 체크
                if(innerEvent[event.target.name]
                    && innerEvent[event.target.name][evList[i]]
                    && innerEvent[event.target.name][evList[i]].head ){
                    //연결된 이벤트 호출
                    innerEvent[event.target.name][evList[i]].head(
                        event,
                        self.data[index],
                        index,
                        sequence
                    );
                }

                //외부 이벤트 체크
                if(self.outerEvent && self.outerEvent[evList[i]]){
                    //정의된 외부 이벤트 호출
                    self.outerEvent[evList[i]](
                        event,
                        self.data[index],
                        index,
                        sequence
                    );
                }

                //데이터 동기화
                switch(event.target.dataset.sync){
                case "text": case "checkbox": case "select": case "date": case "dateTime":
                    self.data[self.getSeqIndex(sequence)][event.target.name] = event.target.value;
                    break;
                }

                event.stopPropagation();
            });
        }
        return innerEvent;
    }
}