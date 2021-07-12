//초기세팅
PUI.FN.INIT = async function(){

    

    //달력생성
    //PUI.V.datepicker = new wDatepicker();
    //그리드 생성 호출
    PUI.FN.createGrid();
};

//그리드 생성
PUI.FN.createGrid = function(){

    let useYn = {Y: "사용", N: "미사용"};
    
    //그리드
    PUI.V.wGrid = new wGrid("ledList", {
        field: [
            {title: "장부번호", element:"text", name:"ledIdx", width:160, align:"left"},
            {title: "장부유형", element:"text", name:"ledTpCd", width:170, align:"center"},
            {title: "장부명", element:"text", name:"ledNm", width:190, align:"left", edit:"text"},            
            {title: "사용여부", element:"text", name:"useYn", width:50, align:"center", edit:"text"},
            {title: "총액", element:"text", name:"amount", width:50, align:"center", edit:"text"}
        ],
        option: {
            style: {
                width: 1385,
                height: 566
            }
        }
    });

    //데이터 조회
    // PUI.FT.getFetch("/api/ledger/getLedgerList")
    //     .then(response => PUI.V.wGrid.setData({list:response.data}));
};

//클릭 이벤트
PUI.EV.CLICK = function(event){
    switch(event.target.id){
    case "ledReg":
        window.location.href = "/assets/ledger/register";
        break;
    }
}