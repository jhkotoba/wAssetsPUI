import { util } from "./plugin/util.js";
import { construct } from "./plugin/construct.js";


/**
 * wGrid
 * @author JeHoon 
 * @version 0.10.3
 */
class wGrid {

    // 생성자
    constructor(targetId, paramater){

        this.self = this;

        // 데이터 변수 생성 
        this.data = [];

        // 그리드 편집시 데이터 변수
        this.originData = {};
        
        // 필드저장
        this.fields = paramater.fields;

        // 유틸저장
        this.util = util.getUtils();

        // 외부 이벤트 연결
        this.outerEvent = paramater.event;

        // 엘리멘트 생성
        this.element = construct.createElement(targetId);

        // 그리드 상태값 생성
        this.state = construct.createState();

        // 상수세팅
        this.constant = construct.createConstant();

        // 옵션세팅
        this.option = construct.createOption(paramater);

        // 그리드 스타일세팅
        construct.settingGrid(this.element, paramater);

        // 내부 이벤트 생성        
        this.innerEvent = construct.createEvent(this, paramater);

        // 그리드 생성
        this.create();

        return this;
    }

    /**
     * 그리드 생성
     */
    create = function(){
        // 헤더 생성
        this.createHead();
        // 바디 생성
        this.createBody();
    }

    /**
     * 그리드 헤더 생성
     */
    createHead = function(){
        // 변수 정의
        let th = null, div = null, tag = null;

        // 헤드영역 생성
        for(let i=0; i<this.fields.length; i++){

            let field = this.fields[i];

            // 태그생성
            th = document.createElement("th");
            div = document.createElement("div");

            // 헤더 테이블 내용 생성
            if(field.title){
                // 제목이 있는 경우 태그타입을 무시하고 제목 표시
                div.textContent = field.title;           
            }else if(field.element == "checkbox"){
                // 체크박스 생성
                tag = document.createElement("input");
                tag.setAttribute("type", "checkbox");
                tag.setAttribute("name", field.name);
                div.appendChild(tag);
            }else if(field.element == "button"){
                // 버튼생성
                tag = document.createElement("button");
                tag.classList.add("wgrid-btn");
                tag.setAttribute("name", field.name);
                tag.textContent = field.button.title;
                div.appendChild(tag);
            }else{
                // 제목적용
                tag = document.createElement("span");
                tag.textContent = field.title;
                div.appendChild(tag);
            }

            // 스타일 적용
            field.width ? div.style.width = field.width + "px": field.width;
            div.style.textAlign = "center";

            // 태그연결
            th.appendChild(div);
            this.element.headTr.appendChild(th);
        }

        // 헤드 클래스 적용
        this.element.head.classList.add("wgrid-div-header");
        this.element.headTb.classList.add("wgrid-table-header");
        
        // 헤드 태그연결
        this.element.headTb.appendChild(this.element.headTr);
        this.element.head.appendChild(this.element.headTb);
        this.element.target.appendChild(this.element.head);
    }

    /**
     * 그리드 바디 생성
     */
    createBody = function(){

        // ROW 생성
        for(let i=0; i<this.data.length; i++){
            this.element.bodyTb.appendChild(
                this.createRow(this.data[i], i)
            );
        }

        // 바디 클래스 적용
        this.element.body.classList.add("wgrid-div-body");        
        this.element.bodyTb.classList.add("wgrid-table-body");

        // 태그 연결
        this.element.body.appendChild(this.element.bodyTb);
        this.element.target.appendChild(this.element.body);
    }

    /**
     * 그리드 바디 행 생성
     * @param {object} row 
     * @param {number} idx 
     */
    createRow = function(row, idx){

        // ROW 생성
        let tr = document.createElement("tr");
        tr.dataset.rowSeq = row._rowSeq;

        // 앞키 뒤값
        this.setSeqIndex(row._rowSeq, idx);
		this.setIdxSequence(idx, row._rowSeq);

        // 행 엘리먼트 인덱싱
        this.setSeqRowElement(row._rowSeq, tr);

        // CELL 생성        
        let loaded = [];
        for(let i=0; i<this.fields.length; i++){            
            tr.appendChild(this.createCell(row, idx, this.fields[i], i, loaded));
        }

        // ROW 커서 옵션 적용
        if(this.option.row && this.option.row.style && this.option.row.style.cursor){                
            tr.style.cursor = this.option.row.style.cursor;
        }

        // ROW 생성후 loaded함수 호출
        loaded.forEach(item => item.loaded(item.element, item.row));
        return tr;
    }

    /**
     * 그리드 바디 행 셀 생성
     * @param {object} row 
     * @param {number} rIdx 
     * @param {object} cell 
     * @param {number} cIdx 
     * @param {object} loaded 그리드 하나의 생성이 진행이 완료된 후 콜백함수 저장 리스트
     * @returns 
     */
    createCell = function(row, rIdx, cell, cIdx, loaded){

        // 생성할 태그 타입, 생성할 태그 변수들
        let type = null, tag = null, td = null, div = null, option = null; 

        // 태그생성
        td = document.createElement("td");
        div = document.createElement("div");

        // 태그 생성전 엘리먼트 타입 구분
        if(row._state == this.constant.STATE.INSERT || row._state == this.constant.STATE.UPDATE){
            if(cell.edit){
                if(cell.edit == "text") type = "text-edit";
                else if(cell.edit == "date") type = "date-edit";
                else if(cell.edit == "dateTime") type = "dateTime-edit";
                else type = cell.edit;
            }else{
                type = cell.edit;
            }
        }else{
            type = cell.element;
        }

        // 태그 생성
        if(type == "checkbox"){
            // 체크박스 생성
            tag = document.createElement("input");
            tag.setAttribute("type", "checkbox");
            tag.setAttribute("name", cell.name);
            div.appendChild(tag);
            tag.dataset.sync = "checkbox";
        }else if(type == "button"){
            // 버튼 생성
            tag = document.createElement("button");
            tag.classList.add("wgrid-btn");
            tag.setAttribute("name", cell.name);
            tag.textContent = cell.text;
            div.appendChild(tag);
        }else if(type == "select"){
            // 셀릭트박스 생성
            tag = document.createElement("select");
            tag.classList.add("wgrid-select");            
            tag.classList.add("wgrid-wth100p");
            tag.setAttribute("name", cell.name);
            tag.dataset.sync = "select";

            // 초기 빈값이 존재할 경우 추가
            if(cell.data && cell.data.select && cell.data.select.empty){
                option = document.createElement("option");
                option.textContent = cell.data.select.empty;
                tag.appendChild(option);
            }

            // 셀릭트박스 옵션태그 추가
            if(cell.data && cell.data.select && cell.data.select.list){
                cell.data.select.list.forEach(item => {
                    option = document.createElement("option");
                    option.value = item[cell.data.select.value ? cell.data.select.value : "value"];
                    option.textContent = item[cell.data.select.text ? cell.data.select.text : "text"];

                    if(option.value == row[cell.name]){
                        option.selected = true;
                    }

                    tag.appendChild(option);
                });
            }
            div.appendChild(tag);
        // 날짜표시
        }else if(type == "date"){
            tag = document.createElement("span");
            tag.textContent = row[cell.name];
            div.appendChild(tag);
        }else if(type == "date-edit"){
            // 날짜 입력박스 표시
            tag = document.createElement("input");
            tag.classList.add("wgrid-input");
            tag.classList.add("wgrid-wth90p");
            tag.setAttribute("maxlength", 10);
            tag.setAttribute("name", cell.name);
            tag.dataset.sync = "date";
            tag.value = row[cell.name];
            div.appendChild(tag);
        }else if(type == "dateTime"){
            /* 개발중 */
        }else if(type == "dateTime-edit"){
            /* 개발중 */
        }else if(type == "text" || !type){
            tag = document.createElement("span");
            tag.setAttribute("name", cell.name);
            // 코드맵핑
            if(cell.data && cell.data.mapping){
                tag.textContent = cell.data.mapping[row[cell.name]];
            }else{
                tag.textContent = row[cell.name];
            }
            div.appendChild(tag);
        }else if(type == "text-edit"){
            // 입력내용 표시
            tag = document.createElement("input");
            tag.classList.add("wgrid-input");
            tag.classList.add("wgrid-wth90p");
            tag.setAttribute("name", cell.name);
            tag.dataset.sync = "text";
            tag.value = row[cell.name];
            div.appendChild(tag);
        }

        // 텍스트, 날짜데이터가 비어있고 비어있을경우 표시하는 값이 정해지면 표시
        if((cell.emptyText && type == "text" || type == "dateTime" || type == "date") 
            && !row[cell.name]){                    
            // 정의된 빈값 표시
            div.textContent = cell.emptyText;
        }

        // 그리드 상태값에 따른 색상변경
        if(tag){
            switch(row._state){
            case this.constant.STATE.SELECT: break;
            case this.constant.STATE.INSERT:
                tag.classList.add(this.constant.TAG_CLS_STATE.INSERT);
                break;
            case this.constant.STATE.UPDATE:
                tag.classList.add(this.constant.TAG_CLS_STATE.UPDATE);
                break;
            case this.constant.STATE.REMOVE:
                tag.classList.add(this.constant.TAG_CLS_STATE.REMOVE);
                break;
            }
        }
        
        // 셀 엘리먼트 인덱싱
        this.setSeqCellElement(row._rowSeq, cell.name, tag);

        // 태그연결
        td.appendChild(div);

        // 행 직후 콜백함수 호출 세팅
        if(cell.loaded){
            loaded.push({loaded: cell.loaded, element: tag, row: Object.assign({}, row)});
        } 

        // 스타일 적용
        cell.width ? div.style.width = cell.width + "px" : cell.width;
        div.style.align = cell.align ? cell.align : "center";

        return td;
    }

    /**
     * 그리드 데이터 가져오기
     * @returns 
     */
    getData = () => this.data;

    /**
     * 데이서 추가
     * @param {object} paramater 
     */
    setData = function(paramater){

        // 데이터를 그리드에 삽입
        for(let i=0; i<paramater.list.length; i++){

            let item = paramater.list[i];

            // 기본 데이터 세팅
            item._rowSeq = this.getNextSeq();
            item._state = this.constant.STATE.SELECT;
        }

        // 데이터 저장
        this.data = paramater.list;

        // 필드 새로고침
        if(paramater.isRefresh) this.refresh();
    }

    /**
     * 그리드 새로고침 (필드부분 재생성)
     */
    refresh = function(){
        // 필드 비우기
        while(this.element.bodyTb.hasChildNodes()){
            this.element.bodyTb.removeChild(this.element.bodyTb.firstChild);
        }
        // 필드 재생성
        this.data.forEach((row, rIdx) => this.element.bodyTb.appendChild(this.createRow(row, rIdx)));
    }

    /**
     * 신규행 추가
     * @returns 
     */
    createNewRow = function(){

        // 신규행 ROW 데이터 세팅
        let row = {
            _rowSeq: this.getNextSeq(),
            _state: this.constant.STATE.INSERT
        };

        // 필드값 세팅
        for(let i=0; i<this.fields.length; i++){            
            let item = this.fields[i];            
            row[item.name] = "";

            // 해당 행에 셀렉트박스 데이터가 있는 경우, 셀렉트박스 empty값이 없거나 false일 경우
            if(item.data && item.data.select 
                && (!item.data.select.empty || item.data.select === false)
                && item.data.select.list.length > 0){

                if(item.data.select.value){
                    row[item.name] = item.data.select.list[0][item.data.select.value];
                }else{
                    row[item.name] = item.data.select.list[0].value;
                }
            }
        }

        // 신규 데이터 추가
        this.data.push(row);

        // 신규행 추가
        let tr = this.createRow(row, this.data.length-1);
        tr.classList.add(this.constant.TR_CLS_STATE.INSERT);

        return tr;
    }

    /**
     * 시퀀스와 컬럼명으로 해당 좌표 구함
     * @param {string/number} rowSeq 
     * @param {string} name 
     * @returns 
     * @deprecated getSeqCellElement 를 사용
     */
    getCellElement(rowSeq, name){
        let tr = this.getElementBodyTable()
            .querySelectorAll("tr[data-row-seq='"+ rowSeq +"']")[0];
        return tr.querySelectorAll("[name='" + name + "']")[0];
    }

    /**
     * 그리드 시퀀스 값으로 데이터 인덱스 구하기
     * @param {string/number} rowSeq 
     * @returns 
     */
    getDataRowSeq = rowSeq => this.data[this.getSeqIndex(rowSeq)];
    
    /**
     * 그리드 인자의 인덱스에 해당되는 데이터 가져오기
     * @param {number} index 
     * @returns 
     */
    getDataIndex = index => this.data[index];

    /**
     * 상태가 조회(SELECT)인 데이터 가져오기
     * @returns 
     */
    getSelectData = () => this.data.filter(item => this.isSelect(item._state));

    /**
     * 상태가 추가(INSERT)인 데이터 가져오기
     * @returns 
     */
    getInsertData = () => this.data.filter(item => this.isInsert(item._state))

    /**
     * 상태가 수정(UPDATE)인 데이터 가져오기
     * @returns 
     */
    getUpdateData = () => this.data.filter(item => this.isUpdate(item._state));

    /**
     * 상태가 삭제(DELETE)인 데이터 가져오기
     * @returns 
     */
    getDeleteData = () => this.data.filter(item => this.isDelete(item._state));
    
    /**
     * 상태가 변경(INSERT, UPDATE, DELETE)인 데이터 가져오기
     * @returns 
     */
    getApplyData = () => this.data.filter(item => !this.isSelect(item._state));

    /**
     * 현재 시퀀스 가져오기
     * @returns 
     */
    getCurSeq = () => this.state.curSeq;

    /**
     * 다음시퀀스 가져오기(시퀀스 증가)
     * @returns 
     */
    getNextSeq = () => ++this.state.curSeq;

    /**
     * 그리드 타켓 엘리멘트 가져오기
     * @returns 
     */
    getElementTarget = () => this.element.target;

    /**
     * 그리드 헤드 엘리먼트 가져오기
     * @returns 
     */
    getElementHead = () => this.element.head;

    /**
     * 그리드 헤드 테이블 엘리먼트 가져오기
     * @returns 
     */
    getElementHeadTable = () => this.element.headTb;

    /**
     * 그리드 헤드 행 엘리먼트 가져오기
     * @returns 
     */
    getElementHeadTableRow = () => this.element.headTr;

    /**
     * 그리드 바디 엘리먼트 가져오기
     * @returns 
     */
    getElementBody = () => this.element.body;

    /**
     * 그리드 바디 테이블 엘리먼트 가져오기
     * @returns
     */
    getElementBodyTable = () => this.element.bodyTb;
    
    /**
     * key:sequence value: index 인덱싱 push
     * @param {string} sequence 
     * @param {string} index 
     */
	setSeqIndex = (sequence, index) => this.state.seqIndex[sequence] = index;
		
    /**
     * 시퀀스번호로 데이터의 index 가져오기
     * @param {string} sequence 
     * @returns 
     */
	getSeqIndex = sequence => this.state.seqIndex[sequence];
		
    /**
     * key:index value: sequence 인덱싱 push
     * @param {string} index 
     * @param {string} sequence 
     */
	setIdxSequence = (index, sequence) => this.state.idxSequence[index] = sequence;
		
    /**
     * index로 시퀀스번호 가져오기
     * @param {string} index 
     * @returns 
     */
	getIdxSequence = (index) => this.state.idxSequence[index];

    /**
     * 그리드 행 엘리먼트 인덱싱
     * @param {string} sequence 
     * @param {element} element 
     * @returns 
     */
    setSeqRowElement = (sequence, element) => this.state.seqRowElement[sequence] = element;

    /**
     * 그리드 행 엘리먼트 가져오기
     * @param {*} sequence 
     * @returns 
     */
     getSeqRowElement = sequence => this.state.seqRowElement[sequence];

    /**
     * 그리드 셀 엘리먼트 인덱싱
     * @param {string} sequence 
     * @param {string} name 
     * @param {element} element 
     * @returns 
     */
    setSeqCellElement(sequence, name, element) {
        if(!this.state.seqCellElement[sequence]) this.state.seqCellElement[sequence] = {};
        this.state.seqCellElement[sequence][name] = element;
    }

    /**
     * 그리드 셀 엘리먼트 가져오기
     * @param {string/number} sequence 
     * @param {string} name 
     * @returns 
     */
    getSeqCellElement = (sequence, name) => this.state.seqCellElement[sequence][name];
   
    /**
     * 신규행 추가(위에서)
     */
    prependRow = () => this.element.bodyTb.insertBefore(this.createNewRow(), this.element.bodyTb.firstChild);

    /**
     * 신규행 추가(아래에서)
     */
    appendRow = () => this.element.bodyTb.appendChild(this.createNewRow());

    /**
     * name값으로 체크된 체크박스 찾아서 가져오기
     * @param {string} name 
     * @returns 
     * @deprecated getCheckedElement로 대체
     */
    getNameCheckedNodes = (name) => this.getElementBodyTable()
        .querySelectorAll("input[type='checkbox'][name='"+name+"']:checked");

    /**
     * rowSeq 값으로 행 엘리먼트 가져오기
     * @param {string/number} rowSeq 
     * @returns 
     */    
    getRowElementRowSeq = rowSeq => this.state.seqRowElement[rowSeq];

     /**
     * name값으로 체크된 체크박스된 엘리먼트 가져오기
     * @param {string} name 
     * @returns
     */
    getCheckedElement = name => Object.entries(this.state.seqCellElement)
        .filter(f => f[1][name].checked == true)
        .flatMap(fm => fm[1][name])

    /**
     * name값으로 body 체크박스 전체 선택/해제
     * @param {string} name 
     * @param {boolean} bool 
     * @returns 
     */
    setAllChecked = (name, bool) => Object.entries(this.state.seqCellElement)
        .flatMap(fm => fm[1][name])
        .forEach(check => check.checked = bool)

    /**
     * name값으로 체크된 체크박스 seq(list)번호 가져오기
     * @param {string} name 
     * @returns 
     */
    getNameCheckedSeqs = (name) => {
        let seqList = [];
        this.getCheckedElement(name)
            .forEach(check => {
                seqList.push(Number(this.util.getTrNode(check).dataset.rowSeq));
            });
        return seqList;
    }

    /**
     * name값으로 체크된 체크박스 행 데이터(itemList) 가져오기
     * @param {string} name 
     * @returns 
     */
    getNameCheckedItems = name => {
        let itemList = [];
        this.getCheckedElement(name)
            .forEach(check => {
                itemList.push(this.getDataIndex(this.getSeqIndex(this.util.getTrNode(check).dataset.rowSeq)));
            });
        return Object.assign([], itemList);
    }

    /**
     * 행의 변경상태를 체크 (index)
     * @param {number} rowIdx 
     * @returns 
     */
    isModifyDataRowIdx(rowIdx){
        return this.isModifyData(rowIdx, this.getIdxSequence(rowIdx));
    }

    /**
     * 행의 변경상태를 체크 (sequence)
     * @param {string/number} rowSeq 
     * @returns 
     */
    isModifyDataRowSeq(rowSeq){
        return this.isModifyData(this.getSeqIndex(rowSeq), rowSeq);
    }
    
    /**
     * 행의 변경상태를 체크
     * @param {number} rowIdx 
     * @param {string/number} rowSeq 
     * @returns 
     */
    isModifyData(rowIdx, rowSeq){
        let result = false;
        for(let key in this.data[rowIdx]){
            if(key.indexOf("_") != 0 
                && this.data[rowIdx][key] != this.originData[rowSeq][key]){
                result = true;
                break;
            }
        }
        return result;
    }

    /**
     * 행의 상태를 취소(삭제, 편집상태를 취소)
     * @param {number} rowIdx 
     */
    cancelStateRowIdx(rowIdx){
        this.cancelStateRow(rowIdx, this.getIdxSequence(rowIdx));
    }

    /**
     * 행의 상태를 취소(삭제, 편집상태를 취소)
     * @param {number} rowSeq 
     */
    cancelStateRowSeq(rowSeq){
        this.cancelStateRow(this.getSeqIndex(rowSeq), rowSeq);
    }

    /**
     * 행의 상태를 취소(삭제, 편집상태를 취소)
     * @param {number} rowIdx 
     * @param {number} rowSeq 
     */
    cancelStateRow(rowIdx, rowSeq){
        var cancelTr = null;
        var cancelTag = null;

        // 변경할 행 엘리먼트
        let tr = this.getRowElementRowSeq(rowSeq);
        
        switch(this.data[rowIdx]._state){
            // 편집상태 취소(편집의 경우 행 재생성)
            case this.constant.STATE.UPDATE:
                
                // 원본 데이터로 돌림
                for(let key in this.originData[rowSeq]){
                    this.data[rowIdx][key] = this.originData[rowSeq][key];
                }
                delete this.originData[rowSeq];

                // 데이터 상태 조회로 변경
                this.data[rowIdx]._state = this.constant.STATE.SELECT;

                // 자식노드 비우기
                this.util.childElementEmpty(tr);

                // cell 생성후 태그 연결
                let loaded = [];
                this.fields.forEach((field, fIdx) => {
                    let result = this._bodyListCellCreate(field, fIdx, this.data[rowIdx], rowIdx);
                    tr.appendChild(result.td);
                    // 셀 행 직후 콜백함수 호출 세팅
                    if(this.util.isFunction(field.loaded)){
                        loaded.push({fn: field.loaded, tag: result.tag, row: Object.assign({}, this.data[rowIdx])});
                    }
                });
                // 행생성후 loaded함수 호출
                loaded.forEach(item => item.fn(item.tag, item.row));

                // 취소할 상태값 저장
                cancelTr = this.constant.TR_CLS_STATE.UPDATE;
                cancelTag = this.constant.TAG_CLS_STATE.UPDATE;
                break;
            // 삭제상태 취소
            case this.constant.STATE.REMOVE:

                // 데이터 상태 조회로 변경
                this.data[rowIdx]._state = this.constant.STATE.SELECT;
                
                // 취소할 상태값 저장
                cancelTr = this.constant.TR_CLS_STATE.REMOVE;
                cancelTag = this.constant.TAG_CLS_STATE.REMOVE;
                break;
            }
    
            // ROW스타일 row 태그 스타일 삭제            
            tr.classList.remove(cancelTr);

            // 행 자식노드의 태그의 스타일(클래스) 삭제
            for(let remove of tr.getElementsByClassName(this.constant.TAG_CLS_STATE.REMOVE)){
                remove.classList.remove(cancelTag);
            }
    }

    /**
     * 행 편집모드로 변경 (rowIdxList)
     * @param {Array} rowIdxList 
     */
    modifyStateRowIdxs(rowIdxList){
        rowIdxList.forEach(idx => this.modifyStateRowIdx(idx));
    }

    /**
     * 행 편집모드로 변경(rowSeqList)
     * @param {Array} rowSeqList 
     */
    modifyStateRowSeqs(rowSeqList){
        rowSeqList.forEach(req => this.modifyStateRowSeq(req));
    }

    /**
     * 행 편집모드로 변경 (rowIdx)
     * @param {number} rowIdx 
     */
    modifyStateRowIdx(rowIdx){
        this.modifyStateRow(rowIdx, this.getIdxSequence(rowIdx));
    }
    
    /**
     * 행 편집모드로 변경(seq)
     * @param {string/number} rowSeq 
     */
    modifyStateRowSeq(rowSeq){
        this.modifyStateRow(this.getSeqIndex(rowSeq), rowSeq);
    }

    // 행 편집모드로 변경   
    modifyStateRow(rowIdx, rowSeq){

        // 편집할 행 엘리먼트
        let tr = this.getRowElementRowSeq(rowSeq);
       
        // 편집모드 변경전 본래값 저장
        this.originData[rowSeq] = {};
        for(let key in this.data[rowIdx]){
            this.originData[rowSeq][key] = this.data[rowIdx][key];
        }        

        // 데이터 행상태 값 변경
        this.data[rowIdx]._state = this.constant.STATE.UPDATE;

        // 자식노드 비우기
        this.util.childElementEmpty(tr);

        // cell 생성후 태그 연결
        let loaded = [];
        this.fields.forEach((field, fIdx) => {
            let result = this._bodyListCellCreate(field, fIdx, this.data[rowIdx], rowIdx);
            tr.appendChild(result.td);
            // 셀 행 직후 콜백함수 호출 세팅
            if(this.util.isFunction(field.loaded)){
                loaded.push({fn: field.loaded, tag: result.tag, row: Object.assign({}, this.data[rowIdx])});
            }
        });
        // 행생성후 loaded함수 호출
        loaded.forEach(item => item.fn(item.tag, item.row));

        tr.classList.add(this.constant.TR_CLS_STATE.UPDATE);
        tr.childNodes.forEach(td => {
            switch(td.firstChild.firstChild.tagName){
                case "INPUT":
                    if(td.firstChild.firstChild.type == "checkbox"){
                        break;
                    }
                case "BUTTON":
                case "SELECT":
                    td.firstChild.firstChild.classList.add(this.constant.TAG_CLS_STATE.UPDATE);
                break;
            }
        });
    }

    // 여러행 삭제상태 변환(idx[])
    removeStateRowIdxs(rowIdx){
        rowIdx.forEach(idx => this.removeStateRowIdx(idx));
    }

    // 여러행 삭제상태 변환(seq[])
    removeStateRowSeqs(rowSeq){
        rowSeq.forEach(req => this.removeStateRowSeq(req));
    }
    
    // 한행 삭제상태 변환(idx)
    removeStateRowIdx(rowIdx){
        this._removeStateRow(rowIdx, this.getIdxSequence(rowIdx));
    }

    // 한행 삭제상태 변환(seq)
    removeStateRowSeq(rowSeq){
        this._removeStateRow(this.getSeqIndex(rowSeq), rowSeq);
    }

    // 한행 삭제상태 변환
    _removeStateRow(rowIdx, rowSeq){
        this.data[rowIdx]._state = this.constant.STATE.REMOVE;

        let tr = this.getElementBodyTable()
            .querySelectorAll("tr[data-row-seq='"+ rowSeq +"']")[0];

        tr.classList.add(this.constant.TR_CLS_STATE.REMOVE);
        tr.childNodes.forEach(td => {
            switch(td.firstChild.firstChild.tagName){
                case "INPUT":
                    if(td.firstChild.firstChild.type == "checkbox"){
                        break;
                    }
                case "BUTTON":
                    td.firstChild.firstChild.classList.add(this.constant.TAG_CLS_STATE.REMOVE);
                break;
            }
        });
    }

    // 한개의 행 삭제(idx)
    removeRowIdx(rowIdx){
        this._removeRowIdx(rowIdx, this.getIdxSequence(rowIdx));
    }

    // 한개의 행 삭제(seq)
    removeRowSeq(rowSeq){
        this._removeRowIdx(this.getSeqIndex(rowSeq), rowSeq);
    }

    // 행삭제
    _removeRowIdx(rowIdx, rowSeq){
        this.data.splice(rowIdx, 1);
        this.getElementBodyTable().querySelectorAll("tr[data-row-seq='" + rowSeq + "']")[0].remove();
        this._dataReIndexing();
    }



    // 데이터 인덱싱
    _dataReIndexing(){
        this.state.seqIndex = [];
        this.data.forEach((item, index) => {
            this.state.seqIndex[item._rowSeq] = index;
        });
    }

    // 그리드 생성
    _create(){
        // this._headerCreate();
        this._bodyCreate();
        return this;
    }

    // 헤더 생성
    _headerCreate(){
        this._headerListCreate();
    }

    // 헤더 생성 - 리스트
    _headerListCreate(){
        let th, div, tag = null;
        this.fields.forEach(field => {
            // 태그생성
            th = document.createElement("th");
            div = document.createElement("div");
            
            switch(field.element){

                // 헤더 - 체크박스
                case "checkbox" :
                    // 타이틀이 있는경우 체크박스 무시
                    if(field.title){                        
                        div.textContent = field.title;                       
                    }else{
                        // 체크박스 속성
                        tag = document.createElement("input");
                        tag.setAttribute("type", "checkbox");
                        tag.setAttribute("name", field.name);
                        div.appendChild(tag);
                    }
                    break;

                // 헤더 - 버튼
                case "button" :
                    // 타이틀이 있는경우 버튼 무시
                    if(field.title){                        
                        div.textContent = field.title;     
                    }else{
                        // 버튼속성
                        tag = document.createElement("button");
                        tag.classList.add("wgrid-btn");
                        tag.setAttribute("name", field.name);
                        tag.textContent = field.button.title;
                        
                        // 버튼이벤트(사용자 정의)
                        if(typeof field.click === "function"){
                            tag.addEventListener("click", event => {
                                field.event.click(event, {isBody:false});
                                event.stopPropagation();
                            });
                        }
                        div.appendChild(tag);
                    }
                    break;

                // 헤더 - 디폴트(텍스트)
                case "text":
                default :
                    // 제목적용
                    tag = document.createElement("span");
                    tag.textContent = field.title;
                    div.appendChild(tag);
                    break;
            }

            // 스타일 적용             
            this.util.addStyleAttribute(div, "width", field.width);
            this.util.addStyleAttribute(div, "textAlign", "center");

            // 태그연결
            th.appendChild(div);
            this.element.headTr.appendChild(th);
        });

        // 클래스 적용
        this.element.head.classList.add("wgrid-div-header");        
        this.element.headTb.classList.add("wgrid-table-header");

        // 태그연결
        this.element.headTb.appendChild(this.element.headTr);
		this.element.head.appendChild(this.element.headTb);
        this.element.target.appendChild(this.element.head);
    }

    // 바디 생성
    _bodyCreate(){
        this._bodyListCreate();
    }

    // 바디 생성 - 리스트
    _bodyListCreate(){
        this.data.forEach((row, rIdx) => {
            this.element.bodyTb.appendChild(this._bodyListRowCreate(row, rIdx));
        });
        
        // 스타일, 클래스 적용
        this.element.body.classList.add("wgrid-div-body");
        this.element.bodyTb.classList.add("wgrid-table-body");        
        
        // 태그 연결
        this.element.body.appendChild(this.element.bodyTb);
        this.element.target.appendChild(this.element.body);
    }

    // 바디 생성 - 리스트 - 행
    _bodyListRowCreate(row, rIdx){
        let tr = document.createElement("tr");
        tr.dataset.rowSeq = row._rowSeq;

        // 앞키 뒤값
        this.setSeqIndex(row._rowSeq, rIdx);
		this.setIdxSequence(rIdx, row._rowSeq);

        // 엘리먼트 인덱싱        
        //this.setSeqRowElement(row._rowSeq, tr);

        // cell 생성후 태그 연결
        let loaded = [];
        this.fields.forEach((field, fIdx) => {
            let result = this._bodyListCellCreate(field, fIdx, row, rIdx);
            tr.appendChild(result.td);
            // 행 직후 콜백함수 호출 세팅
            if(this.util.isFunction(field.loaded)){
                loaded.push({fn: field.loaded, tag: result.tag, row: Object.assign({}, row)});
            }
        });
        // 행생성후 loaded함수 호출
        loaded.forEach(item => item.fn(item.tag, item.row));

        if(this.option.row && this.option.row.style && this.option.row.style.cursor){            
            util.addStyleAttribute(tr, "cursor", this.option.row.style.cursor);
        }
        return tr;
    }

    // 바디 생성 - 리스트 - 행 - 셀
    _bodyListCellCreate(field, fieldIdx, row, rowIdx){
        let td = document.createElement("td");
        let div = document.createElement("div");
        let tag = null;
        let elementType = null;
        
        // 태그 생성전 엘리먼트 타입 구분
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

        // 엘리먼트 분기
        switch(elementType){
        // 바디 - 체크박스
        case "checkbox":
            tag = document.createElement("input");
            tag.setAttribute("type", "checkbox");
            tag.setAttribute("name", field.name);
            div.appendChild(tag);
            tag.dataset.sync = "checkbox";
            break;
        
        // 버튼
        case "button":

            // 버튼속성
            tag = document.createElement("button");
            tag.classList.add("wgrid-btn");
            tag.setAttribute("name", field.name);

            // 버튼명
            tag.textContent = field.text;

            // 버튼이벤트
            if(typeof field.event.click === "function"){
                tag.addEventListener("click", event => {
                    field.event.click(event, {isBody:true, row:row, index:rowIdx});
                    event.stopPropagation();
                });
            }
            div.appendChild(tag);
            break;

        // 셀렉트박스
        case "select":

            // 셀릭트박스 생성
            tag = document.createElement("select");
            tag.classList.add("wgrid-select");            
            tag.classList.add("wgrid-wth100p");
            tag.setAttribute("name", field.name);
            tag.dataset.sync = "select";

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
        // 날짜(YYYY-MM-DD)
        case "date":
            div.textContent = this.util.dateFormat(row[field.name]);
            break;
        
        // 날짜 입력(YYYY-MM-DD)
        case "date-edit":
            tag = document.createElement("input");
            tag.classList.add("wgrid-input");
            tag.classList.add("wgrid-wth90p");
            tag.setAttribute("maxlength", 10);
            tag.setAttribute("name", field.name);
            // tag.dataset.event = "date";
            tag.dataset.sync = "date";

            tag.value = row[field.name];
            div.appendChild(tag);
            break;
        // 날짜(YYYY-MM-DD HH:MM:SS)
        case "dateTime":
            break;
        // 날짜 입력(YYYY-MM-DD HH:MM:SS)
        case "dateTime-edit":
            break;
        // 텍스트(입력)
        case "text-edit":
            tag = document.createElement("input");
            tag.classList.add("wgrid-input");
            tag.classList.add("wgrid-wth90p");
            tag.setAttribute("name", field.name);
            tag.dataset.sync = "text";
            
            tag.value = row[field.name];
            div.appendChild(tag);
            break;

        // 바디 - 디폴트(텍스트)
        case "text":
        default:
            tag = document.createElement("span");
            tag.setAttribute("name", field.name);
            // 코드맵핑
            if(this.util.isNotEmpty(field.data) && this.util.isNotEmpty(field.data.mapping)){
                tag.textContent = field.data.mapping[row[field.name]];
            }else{
                tag.textContent = row[field.name];
            }
            div.appendChild(tag);
            break;
        }

        // 빈값이 설정되었으면 적용
        if(elementType == "text" || elementType == "dateTime" || elementType == "date"){
            if(this.util.isEmpty(row[field.name]) && this.util.isNotEmpty(field.emptyText)){
                tag = document.createElement("span");
                tag.setAttribute("name", field.name);
                tag.textContent = field.emptyText;
                div.appendChild(tag);
            }
        }

         // 태그생성 후 상태에 따른 다른 스타일 적용을 위한 부분
        if(this.util.isNotEmpty(tag)){
            switch(row._state){
                case this.constant.STATE.SELECT: break;
                case this.constant.STATE.INSERT:
                    tag.classList.add(this.constant.TAG_CLS_STATE.INSERT);
                    break;
                case this.constant.STATE.UPDATE:
                    tag.classList.add(this.constant.TAG_CLS_STATE.UPDATE);
                    break;
                case this.constant.STATE.REMOVE:
                    tag.classList.add(this.constant.TAG_CLS_STATE.REMOVE);
                    break;
            }
        }
        td.appendChild(div);

        // 스타일 적용        
        this.util.addStyleAttribute(div, "width", field.width);
        this.util.addStyleAttribute(div, "textAlign", "center");
        
        return {td, tag};
    }

    // 그리드 이벤트 세팅
    _createEvent(){        

        console.log("::this.fields::", this.fields);

        // 필드 이벤트 세팅
        this.fields.forEach(item => {
            // 빈값이면 통과
            if(this.util.isEmpty(item.event)){
                return;
            }
            // 이벤트 종류만큼 루프
            ["click", "change"].forEach(evNm => {
                if(this.util.isNotEmpty(item.event[evNm])){                    
                    this.innerEvent[item.name] = {};
                    this.innerEvent[item.name][evNm] = {};
                    // 헤더
                    if(this.util.isFunction(item.event[evNm].header)){
                        this.innerEvent[item.name][evNm]["header"] = item.event[evNm].header;
                    }
                    // 바디
                    if(this.util.isFunction(item.event[evNm].body)){
                        this.innerEvent[item.name][evNm]["body"] = item.event[evNm].body;
                    }
                }
            });
        });

        // 헤드 클릭이벤트
        this.element.head.addEventListener("click", event => {
             // 빈값 체크 후
            if(this.util.isNotEmptyChildObjct(this.innerEvent, event.target.name, "click", "header")){
                if(this.util.isFunction(this.innerEvent[event.target.name].click.header)){
                    this.innerEvent[event.target.name].click.header(event);
                }
            }
            event.stopPropagation();
        });
        // 바디 클릭이벤트        
        this.element.body.addEventListener("click", event => {
			// 빈값 체크 후
            if(this.util.isNotEmptyChildObjct(this.innerEvent, event.target.name, "click", "body")){
                if(this.util.isFunction(this.innerEvent[event.target.name].click.body)){
                    // 연결된 이벤트 호출(event, row)
                    this.innerEvent[event.target.name].click.body(event, this.data[this.getSeqIndex(this.util.getTrNode(event.target).dataset.rowSeq)]);
                }
            }
            // 외부 이벤트 정의
            if(this.outerEvent){
                if(this.outerEvent.click){
                    this.outerEvent.click(event, this.data[this.getSeqIndex(this.util.getTrNode(event.target).dataset.rowSeq)]);
                }
            }
            event.stopPropagation();
        });

        // 헤드 체인지이벤트
        this.element.head.addEventListener("change", event => {
            // 빈값 체크 후
            if(this.util.isNotEmptyChildObjct(this.innerEvent, event.target.name, "change", "header")){
                if(this.util.isFunction(this.innerEvent[event.target.name].change.header)){
                    this.innerEvent[event.target.name].change.header(event);
                }
            }
            event.stopPropagation();
        });
        // 바디 체인지이벤트        
        this.element.body.addEventListener("change", event => {
            let rowSeq = this.util.getTrNode(event.target).dataset.rowSeq;
            // 빈값 체크 후
            if(this.util.isNotEmptyChildObjct(this.innerEvent, event.target.name, "change", "body")){
                if(this.util.isFunction(this.innerEvent[event.target.name].change.body)){
                    // 연결된 이벤트 호출(event, row)
                    this.innerEvent[event.target.name].change.body(event, this.data[this.getSeqIndex(rowSeq)]);
                }
            }
            // 데이터 동기화
            if(event.target.dataset.sync === "date"){
                this.data[this.getSeqIndex(rowSeq)][event.target.name] = event.target.value.replace(/-/gi, "")
            }else if(event.target.dataset.sync === "dateTime"){
                this.data[this.getSeqIndex(rowSeq)][event.target.name] = event.target.value.replace(/-/gi, "").replace(/:/gi, "")
            }else{
                this.data[this.getSeqIndex(rowSeq)][event.target.name] = event.target.value;
            }          
            event.stopPropagation();
        });

        // 헤드 키업 이벤트
        this.element.head.addEventListener("keyup", event => {
            // 연결 이벤트 호출
            if(this.util.isNotEmptyChildObjct(this.innerEvent, event.target.name, "keyup", "header")){
                if(this.util.isFunction(this.innerEvent[event.target.name].change.header)){
                    this.innerEvent[event.target.name].keyup.header(event);
                }
            }
            event.stopPropagation();
        });
        // 바디 키업 이벤트
        this.element.body.addEventListener("keyup", event => {
            let rowSeq = this.util.getTrNode(event.target).dataset.rowSeq;
            // date 포멧 이벤트
            if(event.target.dataset.sync === "date"){
            	event.target.value = event.target.value.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
			}
            // 연결 이벤트 호출
            if(this.util.isNotEmptyChildObjct(this.innerEvent, event.target.name, "keyup", "body")){
                if(this.util.isFunction(this.innerEvent[event.target.name].change.body)){
                    // 연결된 이벤트 호출(event, row)
                    this.innerEvent[event.target.name].keyup.body(event, this.data[this.getSeqIndex(rowSeq)]);
                }
            }
            // 데이터 동기화
            if(event.target.dataset.sync === "date"){
                this.data[this.getSeqIndex(rowSeq)][event.target.name] = event.target.value.replace(/-/gi, "")
            }else if(event.target.dataset.sync === "dateTime"){
                this.data[this.getSeqIndex(rowSeq)][event.target.name] = event.target.value.replace(/-/gi, "").replace(/:/gi, "")
            }else{
                this.data[this.getSeqIndex(rowSeq)][event.target.name] = event.target.value;
            }
            event.stopPropagation();
        });
    }

    // 상태체크 SELECT
    isSelect(state){ return this.constant.STATE.SELECT === state}
    // 상태체크 INSERT
    isInsert(state){ return this.constant.STATE.INSERT === state}
    // 상태체크 SELECT
    isUpdate(state){ return this.constant.STATE.UPDATE === state}
    // 상태체크 REMOVE
    isRemove(state){ return this.constant.STATE.REMOVE === state}
}
window.wGrid = wGrid;
