/**
 * wGird 초기생성
 */
export const construct = {

    /**
     * 그리드 상태값 생성
     * @returns 
     */   
    createState(){
        return {
            curSeq: 0,      // 현재 시퀀스
            seqIndex: {},   // 데이터 맵 key sequence value index
            idxSequence: {}, // 데이터 맵 key index value sequence
            seqRowElement: {}, // 테이터 맵 key sequence value name element
            seqCellElement: {} // 테이터 맵 key sequence value name element
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
            bodyTb : document.createElement("table"),
            bodyEmpty: document.createElement("div")
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

        // 옵션 기본값 세팅
        let option = {           
            grid: {
                style:{
                    width: 1000, 
                    height: 500  
                },
                format:{
                    date: "YYYY-MM-DD"
                },
                empty:{
                    message: "no data"
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

        // 옵션값 세팅
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
                if(paramater.option.grid.empty){
                    if(paramater.option.grid.empty.message){
                        option.grid.empty.message = paramater.option.grid.empty.message;
                    }
                }
                if(paramater.option.grid.format){
                    if(paramater.option.grid.format.date){
                        option.grid.format.date = paramater.option.grid.format.date
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

    /**
     * wGrid 생성시 그리드 이벤트 세팅
     * @param {this} self 
     * @param {object} paramater 
     * @returns 
     */
    createEvent(self, paramater){

        // 생성할 이벤트 종류
        let evList = ["click", "change", "keyup"];
        // 정의할 이벤트
        let innerEvent = {};

        // 필드 이벤트 세팅
        for(let i=0; i<paramater.fields.length; i++){
            
            let item = paramater.fields[i];
            
            // 빈값이면 통과
            if(item.event == undefined || item.event == null){
                continue;
            }

            // 그리드 내부 연결 이벤트 세팅
            evList.forEach(evName => {                
                if(item.event[evName]){

                    // 빈값체크
                    if(!innerEvent[evName]) innerEvent[evName] = {};

                    // 이벤트 등록
                    innerEvent[evName][item.name] = {
                        head: item.event[evName].head ? item.event[evName].head : null,
                        body: item.event[evName].body ? item.event[evName].body : null
                    }
                }
            });
        }

        // 헤드 이벤트 세팅
        for(let i=0; i<evList.length; i++){
            // 이벤트 등록
            self.element.head.addEventListener(evList[i], event => {
                if(innerEvent[evList[i]]
                    && innerEvent[evList[i]][event.target.name]
                    && innerEvent[evList[i]][event.target.name].head ){
                    // 연결된 이벤트 호출
                    innerEvent[evList[i]][event.target.name].head(event);
                }
                event.stopPropagation();
            });
        }

        // 바디 이벤트 세팅
        for(let i=0; i<evList.length; i++){

            self.element.body.addEventListener(evList[i], event => {
                
                let sequence = self.util.closest("TR", event.target).dataset.rowSeq;
                let index = self.getSeqIndex(sequence);

                // 연결할 이벤트 체크
                if(innerEvent[evList[i]]
                    && innerEvent[evList[i]][event.target.name]
                    && innerEvent[evList[i]][event.target.name].body ){
                    // 연결된 이벤트 호출
                    innerEvent[evList[i]][event.target.name].body(
                        event,
                        self.data[index],
                        index,
                        sequence
                    );
                }

                // 외부 이벤트 체크
                if(self.outerEvent && self.outerEvent[evList[i]]){
                    // 정의된 외부 이벤트 호출
                    self.outerEvent[evList[i]](
                        event,
                        self.data[index],
                        index,
                        sequence
                    );
                }

                // 데이터 동기화
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