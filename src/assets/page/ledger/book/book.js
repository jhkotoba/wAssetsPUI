/**
 * 초기세팅
 */
PUI.FN.INIT = async function(){

    //장부idx체크
    let srhParam = new URL(location.href).searchParams;
    if(srhParam.has("ledIdx") == false){
        alert("잘못된 값입니다.");
        window.history.back();
    }

    //전역변수 등록
    PUI.V.ledIdx = srhParam.get("ledIdx");

    //장부정보 조회
    let response = await PUI.FT.getFetch("/api/assets/getLedger?ledIdx=" + PUI.V.ledIdx);
    PUI.V.ledger = response.data;

    ledgerPath.textContent = PUI.V.ledger.ledNm;
    ledgerTitle.textContent = "■ " + PUI.V.ledger.ledNm;    

    //그리드 생성 호출
    PUI.FN.createGrid();
};

/**
 * 그리드 세팅
 */
 PUI.FN.createGrid = function(){

    //그리드
    PUI.V.wGrid = new wGrid("book", {
        fields: [
            {title: "일시", element:"text", name:"recDttm", width:160, align:"center"},
            {title: "내용", element:"text", name:"content", width:190, align:"center"}, 
            {title: "금액", element:"text", name:"money", width:50, align:"center"}            
        ],
        option: {
            style: {
                width: 1385,
                height: 566
            }
        }
    });
};

/**
 * 클릭이벤트
 * @param {event} event 
 */
 PUI.EV.CLICK = function(event){

    switch(event.target.id){
    case "btnBookSetup":
        window.location.href = "/assets/ledger/regist?ledIdx=" + PUI.V.ledIdx;
        break;
    }
}
