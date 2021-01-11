/**
 * wGrid
 * @author JeHoon 
 * @version 0.5.0
 */
class wGrid {

    //생성자
    constructor(targetId, args){

        //그리드내 상수값
        this.CONSTANT = {
            STATE: {
                SELECT: "SELECT",
                INSERT: "INSERT",
                UPDATE: "UPDATE",
                REMOVE: "REMOVE"
            },
            EMPTY: "EMPTY",
            EVENT_LIST: ["click", "change"]
        }

        //그리드 상태값
        this._state = {
            curSeq: 0,  //현재 시퀀스
            seqIndex: {}, //데이터 맵 key sequence value index
            idxSequence: {}  //데이터 맵 key index value sequence
        };

        //엘리먼트
        this._element = {
            id: targetId,   //타켓 id
            target: document.getElementById(targetId), //타겟
            head : document.createElement("div"),
            headTb : document.createElement("table"),
            headTr : document.createElement("tr"),
            body: document.createElement("div"),
            bodyTb : document.createElement("table")
        }

        //그리드내 유틸함수 생성
        this._createUtil();

        //필드저장
        this._field = args.field;

        //그리드 옵션값 세팅
        let option = {
            isCreate: {isHeader:true, isBody:true, isFooter:false},
            gridMode: "LIST" //list, thum
        }

        //그리드 인자값 세팅
        this._data = [];
        this._orgData = [];
        this._option = option;
        if(this.util.isNotEmpty(args.option.isInitCreate)){
            this._option.isInitCreate = args.option.isInitCreate;
        }
        if(this.util.isNotEmpty(args.option.style)){
            this._option.style = args.option.style;
        }
        
        //그리드 스타일세팅
        this._element.target.classList.add("wgrid-field");
        this.util.addElementStyleAttribute(this._element.target, "width", args.option.style.width);
        this.util.addElementStyleAttribute(this._element.target, "height", args.option.style.height);

        //이벤트 생성
        this._event = {};
        this._createEvent();
       
        //생성시 바로 그리드 생성
        this._create(this._option.isInitCreate);
        return this;
    }

    _testShowData(){
        console.log(this._data);
    }

    _getCurSeq(){
        return this._state.curSeq;
    }

    _getNextSeq(){
        return ++this._state.curSeq;
    }

    getElementTarget(){
        return this._element.target;
    }

    getElementHeader(){
        return this._element.head;
    }

    getElementHeadTable(){
        return this._element.headTb;
    }

    getElementHeadTableRow(){
        return this._element.headTr;
    }

    getElementBody(){
        return this._element.body;
    }

    getElementBodyTable(){
        return this._element.bodyTb;
    }

    //데이터 set
    //list: 데이터, isRefresh: setData시 갱신여부, callbackFn: 완료후 콜백함수
    setData(obj){
        if(this.util.isNotEmpty(obj)){
            //내부데이터 세팅
            obj.list.forEach(data => {
                data._rowSeq = this._getNextSeq();
                data._state = this.CONSTANT.STATE.SELECT;
            });
            this._data = obj.list;
            this._orgData = this._data;

            //새로고침 false아니면 새로고침
            if(obj.isRefresh !== false){
                this.refresh();
            }
            //완료후 콜백함수
            if(typeof obj.callbackFn === "function"){
                this.callbackFn();
            }
        }
    }

    getData(rowSeq){
        if(this.util.isEmpty(rowSeq)){
            return this._data;
        }else{
            return this._data[rowSeq];
        }
    }

     /**
     * 데이터 추가
     * @param {*} data
     * @param {*} option 
     */
    append(data, option){

    }
    
    /**
     * 데이터목록 추가
     * @param {*} list
     * @param {*} option 
     */
    appends(list, option){

    }   

    //신규행 추가
    appendNewRow(){
        let row = {};
        this._field.forEach(item => {
            row[item.name] = "";
            row._rowSeq = this._getNextSeq();
            row._state = this.CONSTANT.STATE.INSERT;
        });
        let tr = this._bodyListRowCreate(row, row._rowSeq);
        tr.classList.add("wgrid-insert-tr")
        this._element.bodyTb.appendChild(tr);
    }

    //name으로 체크된 체크박스 가져오기
    getCheckeds(name){

    }

    //여러개의 행 편집모드로 변경
    changeEditRows(){

    }

    //행 편집모드로 변경
    changeEditRow(){

    }

    //그리드 최후 조회상태로 리셋
    reset(){
        this._data = this._orgData;
        this.refresh();
    }

    //여러개의 행 리셋
    resetRows(){

    }

    //행단위 리셋
    resetRow(){

    }

    //그리드 새로고침
    refresh(){        
        //TABLE 태그만 수정 - 비우기
        this.util.childElementEmpty(this._element.bodyTb);
        //TABLE 태그만 수정 - TD생성
        this._data.forEach((row, rIdx) => {
            this._element.bodyTb.appendChild(this._bodyListRowCreate(row, rIdx));
        });
    }

    //그리드 생성
    _create(obj){
        if(obj.isHeader === true) this._headerCreate();
        if(obj.isBody === true) this._bodyCreate();
        if(obj.isFooter === true) this._footerCreate();
        return this;
    }

    //헤더 생성
    _headerCreate(){
        switch(this._option.gridMode){
            case "LIST": this._headerListCreate(); break;           
        }
    }

    //헤더 생성 - 리스트
    _headerListCreate(){
        let th, div, tag = null;
        this._field.forEach(field => {
            //태그생성
            th = document.createElement("th");
            div = document.createElement("div");
            
            switch(field.element){

                //헤더 - 체크박스
                case "checkbox" :
                    //타이틀이 있는경우 체크박스 무시
                    if(field.title){                        
                        div.textContent = field.title;                       
                    }else{
                        //체크박스 속성
                        tag = document.createElement("input");
                        tag.setAttribute("type", "checkbox");
                        tag.setAttribute("name", field.name);
                        div.appendChild(tag);
                    }
                    break;

                //헤더 - 버튼
                case "button" :
                    //타이틀이 있는경우 버튼 무시
                    if(field.title){                        
                        div.textContent = field.title;     
                    }else{
                        //버튼속성
                        tag = document.createElement("button");
                        tag.classList.add("wgrid-btn");
                        tag.setAttribute("name", field.name);
                        tag.textContent = field.button.title;
                        
                        //버튼이벤트(사용자 정의)
                        if(typeof field.click === "function"){
                            tag.addEventListener("click", event => {
                                field.event.click(event, {isBody:false});
                                event.stopPropagation();
                            });
                        }
                        div.appendChild(tag);
                    }
                    break;

                //헤더 - 디폴트(텍스트)
                case "text":
                default :
                    //제목적용
                    div.textContent = field.title;
                    break;
            }

            //스타일 적용             
            this.util.addElementStyleAttribute(div, "width", field.width);
            this.util.addElementStyleAttribute(div, "textAlign", "center");

            //태그연결
            th.appendChild(div);
            this._element.headTr.appendChild(th);
        });

        //클래스 적용
        this._element.head.classList.add("wgrid-div-header");        
        this._element.headTb.classList.add("wgrid-table-header");

        //태그연결
        this._element.headTb.appendChild(this._element.headTr);
		this._element.head.appendChild(this._element.headTb);
        this._element.target.appendChild(this._element.head);
    }

    //바디 생성
    _bodyCreate(){
        //그리그 종류 분기
        switch(this._option.gridMode){
            case "LIST": this._bodyListCreate(); break;
        }
    }

    //바디 생성 - 리스트
    _bodyListCreate(){
        this._data.forEach((row, rIdx) => {
            this._element.bodyTb.appendChild(this._bodyListRowCreate(row, rIdx));
        });
        
        //스타일, 클래스 적용
        this._element.body.classList.add("wgrid-div-body");
        this._element.bodyTb.classList.add("wgrid-table-body");        
        
        //태그 연결
        this._element.body.appendChild(this._element.bodyTb);
        this._element.target.appendChild(this._element.body);
    }

    //바디 생성 - 리스트 - 행
    _bodyListRowCreate(row, rIdx){
        let tr = document.createElement("tr");
        tr.dataset.rowSeq = rIdx;

        //cell 생성후 태그 연결
        this._field.forEach((field, fIdx) => {
            tr.appendChild(this._bodyListCellCreate(field, fIdx, row, rIdx));               
        });
        return tr;
    }

    //바디 생성 - 리스트 - 행 - 셀
    _bodyListCellCreate(field, fieldIdx, row, rowIdx){
        let td = document.createElement("td");
        let div = document.createElement("div");
        let tag = null;
        let elementType = null;
        
        //태그 생성전 엘리먼트 타입 구분
        if(this.util.isInsert(row._state) || this.util.isUpdate(row._state)){
            if(this.util.isNotEmpty(field.edit) && field.edit.toLowerCase() == "text"){
                elementType = "text-edit";
            }else{
                elementType = field.edit;
            }
        }else{
            elementType = field.element;
        }

        //엘리먼트 분기
        switch(elementType){
        //바디 - 체크박스
        case "checkbox":
            tag = document.createElement("input");
            tag.setAttribute("type", "checkbox");
            tag.setAttribute("name", field.name);
            div.appendChild(tag);
            break;
        
        //버튼
        case "button":

            //버튼속성
            tag = document.createElement("button");
            tag.classList.add("wgrid-btn");
            tag.setAttribute("name", field.name);

            //버튼명
            tag.textContent = field.text;

            //버튼이벤트
            if(typeof field.event.click === "function"){
                tag.addEventListener("click", event => {
                    field.event.click(event, {isBody:true, row:row, index:rowIdx});
                    event.stopPropagation();
                });
            }
            div.appendChild(tag);
            break;

        //셀렉트박스
        case "select":

            //셀릭트박스 생성
            tag = document.createElement("select");
            tag.classList.add("wgrid-select");            
            tag.classList.add("wgrid-wth100p");

            let option = null;

            if(this.util.isNotEmptyChildObjct(field, "data", "select", "empty")){
                option = document.createElement("option");
                option.textContent = field.data.select.empty;
                tag.appendChild(option);
            }
            
            if(this.util.isNotEmptyChildObjct(field, "data", "select", "list")){
                field.data.select.list.forEach(item =>{
                    option = document.createElement("option");
                    option.value = item[field.data.select.value ? field.data.select.value : "value"];
                    option.textContent = item[field.data.select.text ? field.data.select.text : "text"];

                    if(option.value == row[field.name]){
                        option.selected = true;
                    }

                    tag.appendChild(option);
                });
            }

            div.appendChild(tag);
            break;

        //텍스트(입력)
        case "text-edit":
            tag = document.createElement("input");
            tag.classList.add("wgrid-input");
            tag.classList.add("wgrid-wth90p");
            
            tag.value = row[field.name];
            div.appendChild(tag);
            break;

        //바디 - 디폴트(텍스트)
        case "text":
        default:
            //코드맵핑
            if(this.util.isNotEmpty(field.data) && this.util.isNotEmpty(field.data.mapping)){
                div.textContent = field.data.mapping[row[field.name]];
            }else{
                div.textContent = row[field.name];
            }
            break;
        }

         //태그생성 후 상태에 따른 다른 스타일 적용을 위한 부분
         if(this.util.isNotEmpty(tag)){
            switch(row._state){
                case this.CONSTANT.STATE.SELECT:
                    break;
                case this.CONSTANT.STATE.INSERT:
                    tag.classList.add("wgrid-insert-tag");
                    break;
                case this.CONSTANT.STATE.UPDATE:
                    break;
                case this.CONSTANT.STATE.REMOVE:
                    break;
            }
         }

        td.appendChild(div);

        //스타일 적용        
        this.util.addElementStyleAttribute(div, "width", field.width);
        this.util.addElementStyleAttribute(div, "textAlign", "center"); 
        return td;
    }ㄴ

    //풋터 생성
    _footerCreate(){       
        switch(this._option.gridMode){
            case "LIST": this._footerListCreate(); break;
            case "THUM": this._footerThumCreate(); break;
        }
    }

    //풋터 생성 - 리스트
    _footerListCreate(){
       
    }

    //풋터 생성 - 섬네일
    _footerThumCreate(){
       
    }

    //그리드 이벤트 세팅
    _createEvent(){
        //필드 이벤트 세팅
        this._field.forEach(item => {
            //빈값이면 통과
            if(this.util.isEmpty(item.event)){
                return;
            }
            //이벤트 종류만큼 루프
            this.CONSTANT.EVENT_LIST.forEach(evNm => {
                if(this.util.isNotEmpty(item.event[evNm])){                    
                    this._event[item.name] = {};
                    this._event[item.name][evNm] = {};
                    //헤더
                    if(this.util.isFunction(item.event[evNm].header)){
                        this._event[item.name][evNm]["header"] = item.event[evNm].header;
                    }
                    //바디
                    if(this.util.isFunction(item.event[evNm].body)){
                        this._event[item.name][evNm]["body"] = item.event[evNm].body;
                    }
                }
            });
        });

        //헤드 클릭이벤트
        this._element.head.addEventListener("click", event => {
             //빈값 체크 후
            if(this.util.isNotEmptyChildObjct(this._event, event.target.name, "click", "header")){
                if(this.util.isFunction(this._event[event.target.name].click.header)){
                    this._event[event.target.name].click.header(event);
                }
            }
            event.stopPropagation();
        });
        //바디 클릭이벤트        
        this._element.body.addEventListener("click", event => {
            //빈값 체크 후
           if(this.util.isNotEmptyChildObjct(this._event, event.target.name, "click", "body")){
               if(this.util.isFunction(this._event[event.target.name].click.body)){
                   //연결된 이벤트 호출(event, row)
                   this._event[event.target.name].click.body(event, this._data[this.util.getTrNode(event.target).dataset.rowSeq]);
               }
           }
           event.stopPropagation();
        });

        //헤드 체인지이벤트
        this._element.head.addEventListener("change", event => {
            //빈값 체크 후
            if(this.util.isNotEmptyChildObjct(this._event, event.target.name, "change", "header")){
                if(this.util.isFunction(this._event[event.target.name].change.header)){
                    this._event[event.target.name].change.header(event);
                }
            }
            event.stopPropagation();
        });
        //바디 체인지이벤트        
        this._element.body.addEventListener("change", event => {
            //빈값 체크 후
            if(this.util.isNotEmptyChildObjct(this._event, event.target.name, "change", "body")){
                if(this.util.isFunction(this._event[event.target.name].change.body)){
                    //연결된 이벤트 호출(event, row)
                    this._event[event.target.name].change.body(event, this._data[this.util.getTrNode(event.target).dataset.rowSeq]);
                }
            }
            event.stopPropagation();
        });
    }

    //그리드내 유틸생성
    _createUtil(){
        let _self = this;
        this.util = {
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
            addElementStyleAttribute(element, style, attribute){
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
            //상태체크 SELECT
            isSelect(state){ return _self.CONSTANT.STATE.SELECT === state},
            //상태체크 INSERT
            isInsert(state){ return _self.CONSTANT.STATE.INSERT === state},
            //상태체크 SELECT
            isUpdate(state){ return _self.CONSTANT.STATE.UPDATE === state},
            //상태체크 REMOVE
            isRemove(state){ return _self.CONSTANT.STATE.REMOVE === state}
        }
    }
}
window.wGrid = wGrid;