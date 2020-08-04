/**
 * wGrid
 * @author JeHoon 
 * @version 0.4.0
 */
class wGrid {

    //생성자
    constructor(targetId, args){
        console.log("wGrid.constructor");

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

        //그리드내 유틸함수
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
            }
        }

        //필드저장
        this._field = args.field;

        //그리드 옵션값 세팅
        let option = {
            isInstantCreate: false,                
            isHeaderCreate: true,
            isBodyCreate: true,
            isFooterCreate: true,
            gridMode: "LIST" //list, thum
        }

        //그리드 인자값 세팅
        this._data = [];
        this.setData(args.data); 
        this._option = option; 

        this._option.isInstantCreate = args.option.isInstantCreate;
        
        //그리드 스타일세팅
        this._element.target.classList.add("wgrid-field");
        this.util.addElementStyleAttribute(this._element.target, "width", args.option.style.width);
        this.util.addElementStyleAttribute(this._element.target, "height", args.option.style.height);        
       
        //생성시 바로 그리드 생성
        if(this._option.isInstantCreate === true) this.create();
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
    setData(list, isRefresh){
        list.forEach(data => {
            data._rowSeq = this._getNextSeq();
            data._state = "SELECT";
        });
        this._data = list;
        if(isRefresh === true) this.refresh();
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
    create(){
        if(this._option.isHeaderCreate === true) this._headerCreate();
        if(this._option.isBodyCreate === true) this._bodyCreate();
        if(this._option.isFooterCreate === true) this._footerCreate();
        return this;
    }

    //그리드 새로고침
    refresh(){

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
            div.textContent = row[[field.name]];
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
}
window.wGrid = wGrid;