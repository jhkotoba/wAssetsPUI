import { util } from "./plugin/util.js"

/**
 * wGrid
 * @author JeHoon 
 * @version 0.8.0
 */
class wGrid {

    //생성자
    constructor(targetId, args){

        //그리드 유틸
        this.util = util;

        //그리드내 상수값
        this.CONSTANT = {
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
        this._editOrgData = {};
        this._option = option;
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
        this._create();
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

    //seqIndex 넣기
	setSeqIndex(sequence, index){
		this._state.seqIndex[sequence] = index;
	}
	
	//seqIndex 가져오기
	getSeqIndex(sequence){
		return this._state.seqIndex[sequence];
	}
	
	//idxSequence 넣기
	setIdxSequence(index, sequence){
		this._state.idxSequence[index] = sequence;
	}
	
	//idxSequence 가져오기
	getIdxSequence(index){
		return this._state.idxSequence[index];
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
            this._orgData = Object.assign([], this._data);

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

    getData(){
        return this._data;
    }

    //시퀀스와 컬럼명으로 해당 좌표 구함
    getCellOffset(rowSeq, name){
        let tr = this.getElementBodyTable()
            .querySelectorAll("tr[data-row-seq='"+ rowSeq +"']")[0];
        let tag = tr.querySelectorAll("[name='" + name + "']")[0];
        return {
            offsetHeight: tag.offsetHeight,
            offsetLeft: tag.offsetLeft,
            offsetTop: tag.offsetTop,
            offsetWidth: tag.offsetWidth
        }
    }

    getDataRowSeq(rowSeq){
        return this._data[this.getSeqIndex(rowSeq)];
    }

    getDataIndex(index){
        return this._data[index];
    }

    //상태가 조회(SELECT)인 데이터 가져오기
    getSelectData(){
        return this._data.filter(item => this.isSelect(item._state));
    }

    //상태가 추가(INSERT)인 데이터 가져오기
    getInsertData(){
        return this._data.filter(item => this.isInsert(item._state));
    }

    //상태가 수정(UPDATE)인 데이터 가져오기
    getUpdateData(){
        return this._data.filter(item => this.isUpdate(item._state));
    }

    //상태가 삭제(DELETE)인 데이터 가져오기
    getDeleteData(){
        return this._data.filter(item => this.isDelete(item._state));
    }

    //상태가 변경(INSERT, UPDATE, DELETE)인 데이터 가져오기
    getApplyData(){
        return this._data.filter(item => !this.isSelect(item._state));
    }
   
    append(data, option){

    }
   
    appends(list, option){

    }   

    //신규행 추가(위에서)
    prependNewRow(){
        this._element.bodyTb.insertBefore(this._createNewRow(), this._element.bodyTb.firstChild);
    }

    //신규행 추가(아래에서)
    appendNewRow(){
        this._element.bodyTb.appendChild(this._createNewRow());
    }

    //신규행 생성
    _createNewRow(){
        let row = {};
        this._field.forEach(item => {
            row[item.name] = "";
            if(this.util.isNotEmptyChildObjct(item, "data", "select")){
                //data.select.empty 항목이 존재하지 않거나 false인 경우
                if(this.util.isEmpty(item.data.select.empty) || item.data.select.empty === false){
                    //list에 데이터가 있으면 첫번째 데이터를 넣음
                    if(item.data.select.list.length > 0){
                        if(this.util.isNotEmpty(item.data.select.value)){
                            row[item.name] = item.data.select.list[0][item.data.select.value];
                        }else{
                            row[item.name] = item.data.select.list[0].value;
                        }
                    }
                }
            }
        });
        row._rowSeq = this._getNextSeq();
        row._state = this.CONSTANT.STATE.INSERT;
        this._data.push(row);

        let tr = this._bodyListRowCreate(row, this._data.length-1);
        tr.classList.add(this.CONSTANT.TR_CLS_STATE.INSERT);
        return tr;
    }

    //name으로 체크된 체크박스 노드 가져오기
    getNameCheckedNodes(name){
        return this.getElementBodyTable()
            .querySelectorAll("input[type='checkbox'][name='"+name+"']:checked");
    }

    //name으로 체크된 체크박스 seq(list)번호 가져오기
    getNameCheckedSeqs(name){
        let seqList = [];
        this.getNameCheckedNodes(name)
            .forEach(check => {
                seqList.push(Number(this.util.getTrNode(check).dataset.rowSeq));
            });
        return seqList;
    }

    //name으로 체크된 체크박스 행 데이터(itemList) 가져오기
    getNameCheckedItems(name){
        let itemList = [];
        this.getNameCheckedNodes(name)
            .forEach(check => {
                itemList.push(this.getDataIndex(this.getSeqIndex(this.util.getTrNode(check).dataset.rowSeq)));
            });
        return Object.assign([], itemList);
    }

    //그리드 최후 조회상태로 리셋
    reset(){
        this._data = Object.assign([], this._orgData);
        this.refresh();
    }

    //여러개의 행 리셋
    resetRows(){

    }

    //행단위 리셋
    resetRow(){

    }

    //행의 변경상태를 체크
    isChangeDataRowIdx(rowIdx){
        return this._isChangeData(rowIdx, this.getIdxSequence(rowIdx));
    }

    //행의 변경상태를 체크
    isChangeDataRowSeq(rowSeq){
        return this._isChangeData(this.getSeqIndex(rowSeq), rowSeq);
    }

    //행의 변경상태를 체크
    _isChangeData(rowIdx, rowSeq){
        let result = false;
        for(let key in this._data[rowIdx]){
            if(key.indexOf("_") != 0){
                if(this._data[rowIdx][key] != this._editOrgData[rowSeq][key]){
                    result = true;
                    break;
                }
            }
        }
        return result;
    }

    //행의 상태를 취소(삭제, 편집상태를 취소) (idx)
    cancelStateRowIdx(rowIdx){
        this._cancelStateRow(rowIdx, this.getIdxSequence(rowIdx));
    }

    //행의 상태를 취소(삭제, 편집상태를 취소) (seq)
    cancelStateRowSeq(rowSeq){
        this._cancelStateRow(this.getSeqIndex(rowSeq), rowSeq);
    }

    //행의 상태를 취소(삭제, 편집상태를 취소)
    _cancelStateRow(rowIdx, rowSeq){
        var cancelTr = null;
        var cancelTag = null;
        
        switch(this._data[rowIdx]._state){
            //편집상태 취소(편집의 경우 행 재생성)
            case this.CONSTANT.STATE.UPDATE:
                
                //원본 데이터로 돌림
                for(let key in this._editOrgData[rowSeq]){
                    this._data[rowIdx][key] = this._editOrgData[rowSeq][key];
                }
                delete this._editOrgData[rowSeq];

                //데이터 상태 조회로 변경
                this._data[rowIdx]._state = this.CONSTANT.STATE.SELECT;

                let tr = this.getElementBodyTable()
                    .querySelectorAll("tr[data-row-seq='"+ rowSeq +"']")[0];

                //자식노드 비우기
                this.util.childElementEmpty(tr);

                //cell 생성후 태그 연결
                let loaded = [];
                this._field.forEach((field, fIdx) => {
                    let result = this._bodyListCellCreate(field, fIdx, this._data[rowIdx], rowIdx);
                    tr.appendChild(result.td);
                    //셀 행 직후 콜백함수 호출 세팅
                    if(this.util.isFunction(field.loaded)){
                        loaded.push({fn: field.loaded, tag: result.tag, row: Object.assign({}, this._data[rowIdx])});
                    }
                });
                //행생성후 loaded함수 호출
                loaded.forEach(item => item.fn(item.tag, item.row));

                //취소할 상태값 저장
                cancelTr = this.CONSTANT.TR_CLS_STATE.UPDATE;
                cancelTag = this.CONSTANT.TAG_CLS_STATE.UPDATE;
                break;
            //삭제상태 취소
            case this.CONSTANT.STATE.REMOVE:

                //데이터 상태 조회로 변경
                this._data[rowIdx]._state = this.CONSTANT.STATE.SELECT;
                
                //취소할 상태값 저장
                cancelTr = this.CONSTANT.TR_CLS_STATE.REMOVE;
                cancelTag = this.CONSTANT.TAG_CLS_STATE.REMOVE;
                break;
            }
    
            //ROW스타일 row 태그 스타일 삭제
            let tr = this.getElementBodyTable()
                .querySelectorAll("tr[data-row-seq='"+ rowSeq +"']")[0];
            tr.classList.remove(cancelTr);

            //행 자식노드의 태그의 스타일(클래스) 삭제
            for(let remove of tr.getElementsByClassName(this.CONSTANT.TAG_CLS_STATE.REMOVE)){
                remove.classList.remove(cancelTag);
            }
    }

    //행 편집모드로 변경(idx[])
    modifyStateRowIdxs(rowIdx){
        rowIdx.forEach(idx => this.modifyStateRowIdx(idx));
    }

    //행 편집모드로 변경(seq[])
    modifyStateRowSeqs(rowSeq){
        rowSeq.forEach(req => this.modifyStateRowSeq(req));
    }

    //행 편집모드로 변경(idx)
    modifyStateRowIdx(rowIdx){
        this._modifyStateRow(rowIdx, this.getIdxSequence(rowIdx));
    }

    //행 편집모드로 변경(seq)
    modifyStateRowSeq(rowSeq){
        this._modifyStateRow(this.getSeqIndex(rowSeq), rowSeq);
    }

    //행 편집모드로 변경   
    _modifyStateRow(rowIdx, rowSeq){
        let tr = this.getElementBodyTable()
            .querySelectorAll("tr[data-row-seq='"+ rowSeq +"']")[0];
       
        //편집모드 변경전 본래값 저장
        this._editOrgData[rowSeq] = {};
        for(let key in this._data[rowIdx]){
            this._editOrgData[rowSeq][key] = this._data[rowIdx][key];
        }        

        //데이터 행상태 값 변경
        this._data[rowIdx]._state = this.CONSTANT.STATE.UPDATE;

        //자식노드 비우기
        this.util.childElementEmpty(tr);

        //cell 생성후 태그 연결
        let loaded = [];
        this._field.forEach((field, fIdx) => {
            let result = this._bodyListCellCreate(field, fIdx, this._data[rowIdx], rowIdx);
            tr.appendChild(result.td);
            //셀 행 직후 콜백함수 호출 세팅
            if(this.util.isFunction(field.loaded)){
                loaded.push({fn: field.loaded, tag: result.tag, row: Object.assign({}, this._data[rowIdx])});
            }
        });
        //행생성후 loaded함수 호출
        loaded.forEach(item => item.fn(item.tag, item.row));

        tr.classList.add(this.CONSTANT.TR_CLS_STATE.UPDATE);
        tr.childNodes.forEach(td => {
            switch(td.firstChild.firstChild.tagName){
                case "INPUT":
                    if(td.firstChild.firstChild.type == "checkbox"){
                        break;
                    }
                case "BUTTON":
                case "SELECT":
                    td.firstChild.firstChild.classList.add(this.CONSTANT.TAG_CLS_STATE.UPDATE);
                break;
            }
        });
    }

    //여러행 삭제상태 변환(idx[])
    removeStateRowIdxs(rowIdx){
        rowIdx.forEach(idx => this.removeStateRowIdx(idx));
    }

    //여러행 삭제상태 변환(seq[])
    removeStateRowSeqs(rowSeq){
        rowSeq.forEach(req => this.removeStateRowSeq(req));
    }
    
    //한행 삭제상태 변환(idx)
    removeStateRowIdx(rowIdx){
        this._removeStateRow(rowIdx, this.getIdxSequence(rowIdx));
    }

    //한행 삭제상태 변환(seq)
    removeStateRowSeq(rowSeq){
        this._removeStateRow(this.getSeqIndex(rowSeq), rowSeq);
    }

    //한행 삭제상태 변환
    _removeStateRow(rowIdx, rowSeq){
        this._data[rowIdx]._state = this.CONSTANT.STATE.REMOVE;

        let tr = this.getElementBodyTable()
            .querySelectorAll("tr[data-row-seq='"+ rowSeq +"']")[0];

        tr.classList.add(this.CONSTANT.TR_CLS_STATE.REMOVE);
        tr.childNodes.forEach(td => {
            switch(td.firstChild.firstChild.tagName){
                case "INPUT":
                    if(td.firstChild.firstChild.type == "checkbox"){
                        break;
                    }
                case "BUTTON":
                    td.firstChild.firstChild.classList.add(this.CONSTANT.TAG_CLS_STATE.REMOVE);
                break;
            }
        });
    }

    //한개의 행 삭제(idx)
    removeRowIdx(rowIdx){
        this._removeRowIdx(rowIdx, this.getIdxSequence(rowIdx));
    }

    //한개의 행 삭제(seq)
    removeRowSeq(rowSeq){
        this._removeRowIdx(this.getSeqIndex(rowSeq), rowSeq);
    }

    //행삭제
    _removeRowIdx(rowIdx, rowSeq){
        this._data.splice(rowIdx, 1);
        this.getElementBodyTable().querySelectorAll("tr[data-row-seq='" + rowSeq + "']")[0].remove();
        this._dataReIndexing();
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

    //데이터 인덱싱
    _dataReIndexing(){
        this._state.seqIndex = [];
        this._data.forEach((item, index) => {
            this._state.seqIndex[item._rowSeq] = index;
        });
    }

    //그리드 생성
    _create(){
        this._headerCreate();
        this._bodyCreate();
        return this;
    }

    //헤더 생성
    _headerCreate(){
        this._headerListCreate();
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
        this._bodyListCreate();
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
        tr.dataset.rowSeq = row._rowSeq;

        //앞키 뒤값
        this.setSeqIndex(row._rowSeq, rIdx);
		this.setIdxSequence(rIdx, row._rowSeq);

        //cell 생성후 태그 연결
        let loaded = [];
        this._field.forEach((field, fIdx) => {
            let result = this._bodyListCellCreate(field, fIdx, row, rIdx);
            tr.appendChild(result.td);
            //행 직후 콜백함수 호출 세팅
            if(this.util.isFunction(field.loaded)){
                loaded.push({fn: field.loaded, tag: result.tag, row: Object.assign({}, row)});
            }
        });
        //행생성후 loaded함수 호출
        loaded.forEach(item => item.fn(item.tag, item.row));

        return tr;
    }

    //바디 생성 - 리스트 - 행 - 셀
    _bodyListCellCreate(field, fieldIdx, row, rowIdx){
        let td = document.createElement("td");
        let div = document.createElement("div");
        let tag = null;
        let elementType = null;
        
        //태그 생성전 엘리먼트 타입 구분
        if(this.isInsert(row._state) || this.isUpdate(row._state)){
            if(this.util.isNotEmpty(field.edit)){
                switch(field.edit.toLowerCase()){
                    case "text": elementType = "text-edit"; break;
                    case "date": elementType = "date-edit"; break;
                    case "dateTime": elementType = "dateTime-edit"; break;
                    default: elementType = field.edit; break;
                }
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
            tag.setAttribute("name", field.name);

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
        //날짜(YYYY-MM-DD)
        case "date":
            div.textContent = this.util.dateFormat(row[field.name]);
            break;
        
        //날짜 입력(YYYY-MM-DD)
        case "date-edit":
            tag = document.createElement("input");
            tag.classList.add("wgrid-input");
            tag.classList.add("wgrid-wth90p");
            tag.setAttribute("maxlength", 10);
            tag.setAttribute("name", field.name);
            tag.dataset.event = "date";

            tag.value = row[field.name];
            div.appendChild(tag);
            break;
        //날짜(YYYY-MM-DD HH:MM:SS)
        case "dateTime":
            break;
        //날짜 입력(YYYY-MM-DD HH:MM:SS)
        case "dateTime-edit":
            break;
        //텍스트(입력)
        case "text-edit":
            tag = document.createElement("input");
            tag.classList.add("wgrid-input");
            tag.classList.add("wgrid-wth90p");
            tag.setAttribute("name", field.name);
            
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

        //빈값이 설정되었으면 적용
        if(elementType == "text" || elementType == "dateTime" || elementType == "date"){
            if(this.util.isEmpty(row[field.name]) && this.util.isNotEmpty(field.emptyText)){
                div.textContent = field.emptyText;
           }
        }

         //태그생성 후 상태에 따른 다른 스타일 적용을 위한 부분
        if(this.util.isNotEmpty(tag)){
            switch(row._state){
                case this.CONSTANT.STATE.SELECT: break;
                case this.CONSTANT.STATE.INSERT:
                    tag.classList.add(this.CONSTANT.TAG_CLS_STATE.INSERT);
                    break;
                case this.CONSTANT.STATE.UPDATE:
                    tag.classList.add(this.CONSTANT.TAG_CLS_STATE.UPDATE);
                    break;
                case this.CONSTANT.STATE.REMOVE:
                    tag.classList.add(this.CONSTANT.TAG_CLS_STATE.REMOVE);
                    break;
            }
        }
        td.appendChild(div);

        //스타일 적용        
        this.util.addElementStyleAttribute(div, "width", field.width);
        this.util.addElementStyleAttribute(div, "textAlign", "center");
        
        return {td, tag};
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
                   this._event[event.target.name].click.body(event, this._data[this.getSeqIndex(this.util.getTrNode(event.target).dataset.rowSeq)]);
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
            let rowSeq = this.util.getTrNode(event.target).dataset.rowSeq;
            //빈값 체크 후
            if(this.util.isNotEmptyChildObjct(this._event, event.target.name, "change", "body")){
                if(this.util.isFunction(this._event[event.target.name].change.body)){
                    //연결된 이벤트 호출(event, row)
                    this._event[event.target.name].change.body(event, this._data[this.getSeqIndex(rowSeq)]);
                }
            }
            //데이터 동기화
            if(event.target.dataset.event === "date"){
                this._data[this.getSeqIndex(rowSeq)][event.target.name] = event.target.value.replace(/-/gi, "")
            }else if(event.target.dataset.event === "dateTime"){
                this._data[this.getSeqIndex(rowSeq)][event.target.name] = event.target.value.replace(/-/gi, "").replace(/:/gi, "")
            }else{
                this._data[this.getSeqIndex(rowSeq)][event.target.name] = event.target.value;
            }          
            event.stopPropagation();
        });

        //헤드 키업 이벤트
        this._element.head.addEventListener("keyup", event => {
            //연결 이벤트 호출
            if(this.util.isNotEmptyChildObjct(this._event, event.target.name, "keyup", "header")){
                if(this.util.isFunction(this._event[event.target.name].change.header)){
                    this._event[event.target.name].keyup.header(event);
                }
            }
            event.stopPropagation();
        });
        //바디 키업 이벤트
        this._element.body.addEventListener("keyup", event => {
            let rowSeq = this.util.getTrNode(event.target).dataset.rowSeq;
            //date 포멧 이벤트
            if(event.target.dataset.event === "date"){
            	event.target.value = event.target.value.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
			}
            //연결 이벤트 호출
            if(this.util.isNotEmptyChildObjct(this._event, event.target.name, "keyup", "body")){
                if(this.util.isFunction(this._event[event.target.name].change.body)){
                    //연결된 이벤트 호출(event, row)
                    this._event[event.target.name].keyup.body(event, this._data[this.getSeqIndex(rowSeq)]);
                }
            }
            //데이터 동기화
            if(event.target.dataset.event === "date"){
                this._data[this.getSeqIndex(rowSeq)][event.target.name] = event.target.value.replace(/-/gi, "")
            }else if(event.target.dataset.event === "dateTime"){
                this._data[this.getSeqIndex(rowSeq)][event.target.name] = event.target.value.replace(/-/gi, "").replace(/:/gi, "")
            }else{
                this._data[this.getSeqIndex(rowSeq)][event.target.name] = event.target.value;
            }
            event.stopPropagation();
        });
    }

    //상태체크 SELECT
    isSelect(state){ return this.CONSTANT.STATE.SELECT === state}
    //상태체크 INSERT
    isInsert(state){ return this.CONSTANT.STATE.INSERT === state}
    //상태체크 SELECT
    isUpdate(state){ return this.CONSTANT.STATE.UPDATE === state}
    //상태체크 REMOVE
    isRemove(state){ return this.CONSTANT.STATE.REMOVE === state}
}
window.wGrid = wGrid;