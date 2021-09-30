// export class wGridcreate {

//     //생성자
//     constructor(self, util){
        
//         //그리드 this
//         this.self = self;

//         //유틸
//         this.util = util;

//         return this;
//     }

//     /**
//      * 그리드 생성
//      * @param {object} paramater 
//      */
//     grid(paramater){

//         //변수 정의
//         let th = null, div = null, tag = null;

//         //헤드영역 생성
//         for(let i=0; i<paramater.fields.length; i++){

//             let field = paramater.fields[i];

//             //태그생성
//             th = document.createElement("th");
//             div = document.createElement("div");

//             //헤더 테이블 내용 생성
//             if(field.title){
//                 //제목이 있는 경우 태그타입을 무시하고 제목 표시
//                 div.textContent = field.title;           
//             }else if(field.element == "checkbox"){
//                 //체크박스 생성
//                 tag = document.createElement("input");
//                 tag.setAttribute("type", "checkbox");
//                 tag.setAttribute("name", field.name);
//                 div.appendChild(tag);
//             }else if(field.element == "button"){
//                 //버튼생성
//                 tag = document.createElement("button");
//                 tag.classList.add("wgrid-btn");
//                 tag.setAttribute("name", field.name);
//                 tag.textContent = field.button.title;
//                 div.appendChild(tag);
//             }else{
//                 //제목적용
//                 tag = document.createElement("span");
//                 tag.textContent = field.title;
//                 div.appendChild(tag);
//             }

//             //스타일 적용
//             field.width ? div.style.width = field.width + "px": field.width;
//             div.style.textAlign = "center";

//             //태그연결
//             th.appendChild(div);
//             this.self.element.headTr.appendChild(th);
//         }

//         //헤드 클래스 적용
//         this.element.head.classList.add("wgrid-div-header");
//         this.element.headTb.classList.add("wgrid-table-header");
        
//         //헤드 태그연결
//         this.element.headTb.appendChild(this.element.headTr);
//         this.element.head.appendChild(this.element.headTb);
//         this.element.target.appendChild(this.element.head);

//     }
   





// }


// /**
//  * create 
//  */
// export const create = {

//     /**
//      * 그리드 생성
//      * @param {object} paramater 
//      */
//     createGrid(paramater){
//         //변수 정의
//         let th = null, div = null, tag = null;

//         //헤드영역 생성
//         for(let i=0; i<paramater.fields.length; i++){

//             let field = paramater.fields[i];

//             //태그생성
//             th = document.createElement("th");
//             div = document.createElement("div");

//             //헤더 테이블 내용 생성
//             if(field.title){
//                 //제목이 있는 경우 태그타입을 무시하고 제목 표시
//                 div.textContent = field.title;           
//             }else if(field.element == "checkbox"){
//                 //체크박스 생성
//                 tag = document.createElement("input");
//                 tag.setAttribute("type", "checkbox");
//                 tag.setAttribute("name", field.name);
//                 div.appendChild(tag);
//             }else if(field.element == "button"){
//                 //버튼생성
//                 tag = document.createElement("button");
//                 tag.classList.add("wgrid-btn");
//                 tag.setAttribute("name", field.name);
//                 tag.textContent = field.button.title;
//                 div.appendChild(tag);
//             }else{
//                 //제목적용
//                 tag = document.createElement("span");
//                 tag.textContent = field.title;
//                 div.appendChild(tag);
//             }

//             //스타일 적용
//             field.width ? div.style.width = field.width + "px": field.width;
//             div.style.textAlign = "center";

//             //태그연결
//             th.appendChild(div);
//             this.element.headTr.appendChild(th);
//         }

//         //헤드 클래스 적용
//         this.element.head.classList.add("wgrid-div-header");
//         this.element.headTb.classList.add("wgrid-table-header");
        
//         //헤드 태그연결
//         this.element.headTb.appendChild(this.element.headTr);
//         this.element.head.appendChild(this.element.headTb);
//         this.element.target.appendChild(this.element.head);

//         //그리드 필드 생성 호출
//         this.createFields(this);
//     },

//     /**
//      * 그리드 필드목록 생성
//      */
//     createFields(){
//         //ROW 생성
//         for(let i=0; i<this.data.length; i++){

//             //ROW 생성
//             let row = this.data[i];
//             this.element.bodyTb.appendChild(create.createField(this, row));
//         }

//         //바디 클래스 적용
//         this.element.body.classList.add("wgrid-div-body");        
//         this.element.bodyTb.classList.add("wgrid-table-body");

//         //태그 연결
//         this.element.body.appendChild(this.element.bodyTb);
//         this.element.target.appendChild(this.element.body);
//     },

//     /**
//      * 그리드 필드 생성
//      * @param {object} row 
//      */
//     createField(row, i){

//         let tr = null, td = null, tag = null, option = null, div = null;
//         let loaded = [], type = null;

//         //ROW 생성
//         tr = document.createElement("tr");
//         tr.dataset.rowSeq = row._rowSeq;

//         //인덱스, 시퀀스 세팅
//         console.log(this);
//         this.state.seqIndex[row._rowSeq] = i;
//         this.state.idxSequence[i] = row._rowSeq;
        
//         //CELL 생성            
//         for(let j=0; j<this.fields.length; j++){

//             let cell = this.fields[j];

//             //태그생성
//             td = document.createElement("td");
//             div = document.createElement("div");

//             //태그 생성전 엘리먼트 타입 구분
//             if(row._state == this.constant.STATE.INSERT || row._state == this.constant.STATE.UPDATE){
//                 if(cell.edit){
//                     if(cell.edit == "text") type = "text-edit";
//                     else if(cell.edit == "date") type = "date-edit";
//                     else if(cell.edit == "dateTime") type = "dateTime-edit";
//                     else type = cell.edit;
//                 }else{
//                     type = cell.edit;
//                 }
//             }else{
//                 type = cell.element;
//             }

//             //태그 생성
//             if(type == "checkbox"){
//                 //체크박스 생성
//                 tag = document.createElement("input");
//                 tag.setAttribute("type", "checkbox");
//                 tag.setAttribute("name", cell.name);
//                 div.appendChild(tag);
//                 tag.dataset.sync = "checkbox";
//             }else if(type == "button"){
//                 //버튼 생성
//                 tag = document.createElement("button");
//                 tag.classList.add("wgrid-btn");
//                 tag.setAttribute("name", cell.name);
//                 tag.textContent = cell.text;
//                 div.appendChild(tag);
//             }else if(type == "select"){
//                 //셀릭트박스 생성
//                 tag = document.createElement("select");
//                 tag.classList.add("wgrid-select");            
//                 tag.classList.add("wgrid-wth100p");
//                 tag.setAttribute("name", cell.name);
//                 tag.dataset.sync = "select";

//                 //초기 빈값이 존재할 경우 추가
//                 if(cell.data && cell.data.select && cell.data.select.empty){
//                     option = document.createElement("option");
//                     option.textContent = cell.data.select.empty;
//                     tag.appendChild(option);
//                 }
//                 //셀릭트박스 옵션태그 추가
//                 if(cell.data && cell.data.select && cell.data.select.list){
//                     cell.data.select.list.forEach(item => {
//                         option = document.createElement("option");
//                         option.value = item[cell.data.select.value ? cell.data.select.value : "value"];
//                         option.textContent = item[cell.data.select.text ? cell.data.select.text : "text"];

//                         if(option.value == row[cell.name]){
//                             option.selected = true;
//                         }

//                         tag.appendChild(option);
//                     });
//                 }
//                 div.appendChild(tag);
//             }else if(type == "date"){
//                 //날짜표시
//                 let dateContent = create._dateFormat(row[cell.name], this.option.grid.format.date);
//                 div.textContent = dateContent;
//             }else if(type == "date-edit"){
//                 //날짜 입력박스 표시
//                 tag = document.createElement("input");
//                 tag.classList.add("wgrid-input");
//                 tag.classList.add("wgrid-wth90p");
//                 tag.setAttribute("maxlength", 10);
//                 tag.setAttribute("name", cell.name);
//                 tag.dataset.sync = "date";
//                 tag.value = row[cell.name];
//                 div.appendChild(tag);
//             }else if(type == "dateTime"){
//                 /* 개발중 */
//             }else if(type == "dateTime-edit"){
//                 /* 개발중 */
//             }else if(type == "text" || !type){
//                 tag = document.createElement("span");
//                 tag.setAttribute("name", cell.name);
//                 //코드맵핑
//                 if(cell.data && cell.data.mapping){
//                     tag.textContent = cell.data.mapping[row[cell.name]];
//                 }else{
//                     tag.textContent = row[cell.name];
//                 }
//                 div.appendChild(tag);
//             }else if(type == "text-edit"){
//                 //입력내용 표시
//                 tag = document.createElement("input");
//                 tag.classList.add("wgrid-input");
//                 tag.classList.add("wgrid-wth90p");
//                 tag.setAttribute("name", cell.name);
//                 tag.dataset.sync = "text";
//                 tag.value = row[cell.name];
//                 div.appendChild(tag);
//             }

//             //텍스트, 날짜데이터가 비어있고 비어있을경우 표시하는 값이 정해지면 표시
//             if((type == "text" || type == "dateTime" || type == "date") 
//                 && !row[cell.name] && cell.emptyText){                    
//                 //정의된 빈값 표시
//                 div.textContent = cell.emptyText;
//             }

//             //그리드 상태값에 따른 색상변경
//             if(tag){
//                 switch(row._state){
//                 case this.constant.STATE.SELECT: break;
//                 case this.constant.STATE.INSERT:
//                     tag.classList.add(this.constant.TAG_CLS_STATE.INSERT);
//                     break;
//                 case this.constant.STATE.UPDATE:
//                     tag.classList.add(this.constant.TAG_CLS_STATE.UPDATE);
//                     break;
//                 case this.constant.STATE.REMOVE:
//                     tag.classList.add(this.constant.TAG_CLS_STATE.REMOVE);
//                     break;
//                 }
//             }

//             //태그연결
//             td.appendChild(div);
//             tr.appendChild(td);

//             //행 직후 콜백함수 호출 세팅
//             if(cell.loaded){
//                 loaded.push({loaded: cell.loaded, element: tag, row: Object.assign({}, row)});
//             } 

//             //스타일 적용
//             cell.width ? div.style.width = cell.width + "px" : cell.width;
//             div.style.align = cell.align ? cell.align : "center";
//         }
        
//         //ROW 커서 옵션 적용
//         if(this.option.row && this.option.row.style && this.option.row.style.cursor){                
//             tr.style.cursor = this.option.row.style.cursor;
//         }

//         //ROW 생성후 loaded함수 호출
//         loaded.forEach(item => item.loaded(item.element, item.row));

//         return tr;
//     },

    

//     /**
//      * 데이터 날짜 포멧 내부함수
//      * @param {string/number} value 
//      * @param {string} format 
//      */
//     _dateFormat(value, format){
    
//         //YYYYMMDD형식으로 진입시 YYYY-MM-DD로 변환
//         if(typeof value == "string" && value.length == 8){
//             value = value.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
//         //YYYYMMDDHHMMSS형식으로 진이시 YYYY-MM-DD HH:MM:SS로 변환
//         }else if(typeof value == "string" && value.length == 14){
//             value = value.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1-$2-$3 $4:$5:$6');
//         }

//         //날짜객체 생성
//         let date = new Date(value);
//         //포멧 세팅
//         format = format ? format : "YYYY-MM-DD";
//         format = format.toUpperCase();

//         let year = date.getFullYear();
//         let month = date.getMonth() < 11 ? "0" + (date.getMonth()+1) : (date.getMonth() + 1);
//         let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
//         let hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
//         let minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
//         let second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
                
//         if(format == "YYYY-MM-DD"){
//             return year + "-" + month + "-" + day;
//         }else if(format == "YYYY-MM-DD HH:MM"){
//             return year + "-" + month + "-" + day + " " + hour + ":" + minute;
//         }else if(format == "YYYY-MM-DD HH:MM:SS"){
//             return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
//         }else{
//             return "";
//         }
//     }

// }