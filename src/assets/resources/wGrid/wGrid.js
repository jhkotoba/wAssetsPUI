/**
 * wGrid
 * @author JeHoon 
 * @version 0.4.0
 */
class wGrid {

    //생성자
    constructor(targetId, args){

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
        this._option = option;
        if(this.util.isNotEmpty(args.option.isInitCreate)){
            this._option.isInitCreate = args.option.isInitCreate;
        }
        
        
        //그리드 스타일세팅
        this._element.target.classList.add("wgrid-field");
        this.util.addElementStyleAttribute(this._element.target, "width", args.option.style.width);
        this.util.addElementStyleAttribute(this._element.target, "height", args.option.style.height);

        //이벤트 연결
        this._createEvent(args.event);
       
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
                data._state = "SELECT";
            });
            this._data = obj.list;

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

    prepend(data, option){

    }

    prepends(list, option){

    }

    append(data, option){

    }
    
    //데이터 추가
    appends(list, option){

    }

    //그리드 생성
    _create(obj){
        if(obj.isHeader === true) this._headerCreate();
        if(obj.isBody === true) this._bodyCreate();
        if(obj.isFooter === true) this._footerCreate();
        return this;
    }

    //그리드 새로고침
    refresh(obj){
        if(this.util.isEmpty(obj)){
            //TABLE 태그만 수정 - 비우기
            this.util.childElementEmpty(this._element.bodyTb);
            //TABLE 태그만 수정 - TD생성
            this._data.forEach((row, rIdx) => {
                this._element.bodyTb.appendChild(this._bodyListRowCreate(row, rIdx));
            });
        }else{


        }
        
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
        let th, div = null;
        this._field.forEach(field => {
            //태그생성
            th = document.createElement("th");
            div = document.createElement("div");
            
            //제목적용
            div.textContent = field.title;
            
            //스타일 적용
            this.util.addElementStyleAttribute(th, "width", field.width);
            this.util.addElementStyleAttribute(th, "textAlign", "center");            

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
        this._element.body.style.marginTop = this._element.headTr.offsetHeight + "px";
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

        //엘리먼트 분기
        switch(field.element){
        case "text":
        default:
            this.util.addElementStyleAttribute(div, "textAlign", "center");

            //코드맵핑
            if(this.util.isNotEmpty(field.codeMapping)){
                div.textContent = field.codeMapping[row[field.name]];
            }else{
                div.textContent = row[field.name];
            }
            td.appendChild(div);
            break;
        }

        //해당 셀 넒이 적용
        this.util.addElementStyleAttribute(td, "width", field.width);
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

    //이벤트 생성
    _createEvent(cEvent){
        //이벤트 연결 - click
        this._element.target.addEventListener("click", event => {
            if(this.util.isFunction(cEvent.click)){
                cEvent.click(event, this.getData(this.util.getTrNode(event.target).dataset.rowSeq));
            }
            event.stopPropagation();
        });
        //이벤트 연결 - dbclick
        this._element.target.addEventListener("dblclick", event => {            
            if(this.util.isFunction(cEvent.dblclick)){
                cEvent.dblclick(event, this.getData(this.util.getTrNode(event.target).dataset.rowSeq));
            }
            event.stopPropagation();
        });
    }

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