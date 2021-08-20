/**
 * 초기세팅
 */
PUI.FN.INIT = async function(){

    //장부유형코드 조회
    let response = await PUI.FT.getFetch("/api/admin/getCodeList?grpCode=LED_TP_CD");
    PUI.V.ledTpcd = response.data;

    //여부(YN) 데이터 세팅
    PUI.V.useYn = {Y: "사용", N: "미사용"};
    PUI.V.saveYn = {Y: "사용", N: "작성중"};
    
    //그리드 생성 호출
    PUI.FN.createGrid();
};

/**
 * 그리드 세팅
 */
PUI.FN.createGrid = function(){

    //그리드
    PUI.V.wGrid = new wGrid("ledgerList", {
        field: [
            {title: "장부번호", element:"text", name:"ledIdx", width:160, align:"left"},
            {title: "장부유형", element:"text", name:"ledTpCd", width:170, align:"center",
                data:{mapping: PUI.UTL.listToCode(PUI.V.ledTpcd)}
            },
            {title: "장부명", element:"text", name:"ledNm", width:190, align:"left", edit:"text"},            
            {title: "사용여부", element:"text", name:"useYn", width:50, align:"center", edit:"text", data:{mapping: PUI.V.useYn}},
            {title: "총액", element:"text", name:"amount", width:50, align:"center", edit:"text"},
            {title: "저장여부", element:"text", name:"saveYn", width:50, align:"center", edit:"text", data:{mapping: PUI.V.saveYn}},
        ],
        option: {
            style: {
                width: 1385,
                height: 566
            },
            row: {
                style:{
                    cursor: "pointer"
                }
            }
        },
        event: {
            click: (event, item) => window.location.href = "/assets/ledger/book?ledIdx=" + item.ledIdx
        }
    });

    //데이터 조회
    PUI.FT.getFetch("/api/assets/getLedgerList")
        .then(response => PUI.V.wGrid.setData({list:response.data}));
};

/**
 * 클릭이벤트
 * @param {event} event 
 */
PUI.EV.CLICK = function(event){
    switch(event.target.id){
    case "ledgerRegister":
        window.location.href = "/assets/ledger/register";
        break;
    }
}