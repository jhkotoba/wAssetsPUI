/**
 * wGrid
 * @author JeHoon 
 * @version 0.4.0
 */
export class wGrid {

    //생성자
    constructor(targetId, args){
        console.log("wGrid.constructor");

        //그리드 상태값
        this._state = {
            curSeq: 0,  //현재 시퀀스
            createState: 0, //그리드 생성상태 (0:미생성, 1:데이터 생성, 2:화면태그 생성)
            seqIndex: {}, //데이터 맵 key sequence value index
            idxSequence: {}  //데이터 맵 key index value sequence
        };

        //엘린먼트
        this._element = {
            id: targetId,   //타켓 id
            target: document.getElementById(targetId) //타겟
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
        }

        //그리드 인자값 디폴트(예시)
        this.args = {
            data: [],
            option: {
                isCreate: false, 
                isHeaderCreate: true,
                isBodyCreate: true,
                isFooterCreate: true,
                gridMode: "LIST" //list, thum
            }
        }

        //그리드 인자값 세팅
        this._data = this.args.data; //args.data;
        this._option = this.args.option; //args.option;

        //그리드 클래스 세팅
        //this._element.target.classList.add("wgrid-field");

        //isCreate true이면 dataCreate() 실행
        if(this._option.isCreate === true) this.dataCreate();
        return this;
    }

    //데이터 set
    setData(list){
        this._data = list;
    }
    
    //데이터 추가
    appendData(list){

    }

    //그리드 생성
    create(){
        console.log("wGrid.create");
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
        console.log("wGrid._headerCreate");
        switch(this._option.gridMode){
            case "LIST": this._headerListCreate(); break;
            case "THUM": this._headerThumCreate(); break;
        }
    }

    //헤더 생성 - 리스트
    _headerListCreate(){
        console.log("wGrid._headerListCreate");

    }

    //헤더 생성 - 섬네일
    _headerThumCreate(){
        console.log("wGrid._headerThumCreate");
    }

    //바디 생성
    _bodyCreate(){
        console.log("wGrid._bodyCreate");
        switch(this._option.gridMode){
            case "LIST": this._bodyListCreate(); break;
            case "THUM": this._bodyThumCreate(); break;
        }
    }

    //바디 생성 - 리스트
    _bodyListCreate(){
        console.log("wGrid._bodyListCreate");
    }

    //바디 생성 - 섬네일
    _bodyThumCreate(){
        console.log("wGrid._bodyThumCreate");
    }

    //풋터 생성
    _footerCreate(){
        console.log("wGrid._footerCreate");
        switch(this._option.gridMode){
            case "LIST": this._footerListCreate(); break;
            case "THUM": this._footerThumCreate(); break;
        }
    }

    //풋터 생성 - 리스트
    _footerListCreate(){
        console.log("wGrid._footerListCreate");
    }

    //풋터 생성 - 섬네일
    _footerThumCreate(){
        console.log("wGrid._footerThumCreate");
    }
}