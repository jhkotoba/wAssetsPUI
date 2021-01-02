/**
 * wGrid
 * @author JeHoon 
 * @version 0.4.0
 */
class wGrid {

    //생성자
    constructor(targetId, args){

        //그리드내 상수값
        this.const = {
            STATE : {
                SELECT : "SELECT",
                INSERT : "INSERT",
                UPDATE : "UPDATE",
                REMOVE : "REMOVE"
            }
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

        //이벤트 연결
        if(args.event){
            this._createEvent(args.event);
        }
       
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

    //데이터 set
    //list: 데이터, isRefresh: setData시 갱신여부, callbackFn: 완료후 콜백함수
    setData(obj){
        if(this.util.isNotEmpty(obj)){
            //내부데이터 세팅
            obj.list.forEach(data => {
                data._rowSeq = this._getNextSeq();
                data._state = this.const.STATE.SELECT;
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
        this._field.forEach(item =>{
            if(item.element.includes("controller") === false){
                row[item.name] = "";
            }
            row._rowSeq = this._getNextSeq();
            row._state = this.const.STATE.INSERT;
        });
        let tr = this._bodyListRowCreate(row, row._rowSeq);
        tr.classList.add("wgrid-insert-tr")
        this._element.bodyTb.appendChild(tr);
    }

    //그리드 생성
    _create(obj){
        if(obj.isHeader === true) this._headerCreate();
        if(obj.isBody === true) this._bodyCreate();
        if(obj.isFooter === true) this._footerCreate();
        return this;
    }

    //그리드 최후 조회상태로 리셋
    reset(){
        this._data = this._orgData;
        this.refresh();
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

    //헤더 생성
    _headerCreate(){
        switch(this._option.gridMode){
            case "LIST": this._headerListCreate(); break;
            case "THUM": this._headerThumCreate(); break;
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
                case "controller-checkbox" :
                    //타이틀이 있는경우 체크박스 무시
                    if(field.title){                        
                        div.textContent = field.title;                       
                    }else{
                        //체크박스 속성
                        tag = document.createElement("input");
                        tag.setAttribute("type", "checkbox");
                        //tag.setAttribute("name", field.name);
                        tag.setAttribute("id", field.name);

                        //체크박스 이벤트(헤더 바디체크박스 전체선택/전체해제)
                        tag.addEventListener("change", event => {
                            document.getElementsByName(event.target.id).forEach(bodyChk => {
                                if(event.target.checked){
                                    bodyChk.checked = true;
                                }else{
                                    bodyChk.checked = false;
                                }
                            });
                        });
                        div.appendChild(tag);
                    }
                    break;
                //헤더 - 버튼
                case "controller-button" :
                    //타이틀이 있는경우 버튼 무시
                    if(field.title){                        
                        div.textContent = field.title;     
                    }else{
                        //버튼속성
                        tag = document.createElement("button");
                        tag.classList.add("wgrid-btn");
                        tag.textContent = field.button.title;
                        
                        //버튼이벤트(사용자 정의)
                        if(typeof field.click === "function"){
                            tag.addEventListener("click", event => {
                                field.button.click(event, {isBody:false});
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

    //헤더 생성 - 섬네일
    _headerThumCreate(){
    }

    //바디 생성
    _bodyCreate(){
        //그리그 종류 분기
        switch(this._option.gridMode){
            case "LIST": this._bodyListCreate(); break;
            case "THUM": this._bodyThumCreate(); break;
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

        //엘리먼트 분기
        switch(field.element){
        //바디 - 체크박스
        case "controller-checkbox":

            //신규행은 체크박스 생성하지 않음.
            //if(row._state === this.const.STATE.INSERT) break;
            
            tag = document.createElement("input");
            tag.setAttribute("type", "checkbox");
            tag.setAttribute("name", field.name);

            //체크박스 이벤트등록(헤더체크박스가 생성된 경우)
            if(this.util.isEmpty(field.title)){
                tag.addEventListener("change", event => {

                    //바디 체크박스 전체 체크(전체 체크시 헤더 체크박스 선택, 전체가 아닐경우 해제)
                    let isCheck = true;                    
                    for(let chk of this._element.bodyTb.querySelectorAll("input[name=" + event.target.name + "]")){
                        if(chk.checked == false){
                            isCheck = false;
                            break;
                        }
                    }
                    let chkId = document.getElementById(event.target.name);
                    if(isCheck){
                        chkId.checked = true;
                    }else{
                        chkId.checked = false;
                    }
                });
            }

            div.appendChild(tag);
            break;
        case "controller-button":

            //신규행은 체크박스 생성하지 않음.
            //if(row._state === this.const.STATE.INSERT) break;

            //버튼속성
            tag = document.createElement("button");
            tag.classList.add("wgrid-btn");
            
            //타입이 문자열이면 텍스트 대입
            if(typeof field.button.title === "string"){
                tag.textContent = field.button.title;
            //아닌경우 엘리먼트 태그라고 판단하여 append
            }else{
                tag.appendChild(field.button.title);
            }

            //버튼이벤트
            if(typeof field.button.click === "function"){
                tag.addEventListener("click", event => {
                    field.button.click(event, {isBody:true, index:rowIdx, data:row});
                    event.stopPropagation();
                });
            }
            div.appendChild(tag);
            break;
        //바디 - 디폴트(텍스트)
        case "text":
        default:
            //코드맵핑
            if(this.util.isNotEmpty(field.codeMapping)){
                div.textContent = field.codeMapping[row[field.name]];
            }else{
                div.textContent = row[field.name];
            }
            break;
        }

        td.appendChild(div);

        //스타일 적용        
        this.util.addElementStyleAttribute(div, "width", field.width);
        this.util.addElementStyleAttribute(div, "textAlign", "center"); 
        return td;
    }

    //바디 생성 - 섬네일
    _bodyThumCreate(){

    }

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

    // //그리드 이벤트 생성
    // _createEvent(gEvent){
    //     //이벤트 연결 - click
    //     if(gEvent.click){
    //         this._element.target.addEventListener("click", event => {
    //             if(this.util.isFunction(gEvent.click)){
    //                 gEvent.click(event, this.getData(this.util.getTrNode(event.target).dataset.rowSeq));
    //             }
    //             event.stopPropagation();
    //         });
    //     }
    // }

    //그리드내 유틸생성
    _createUtil(){
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
	        }
        }
    }
}
window.wGrid = wGrid;