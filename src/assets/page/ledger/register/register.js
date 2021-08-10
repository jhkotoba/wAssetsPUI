/**
 * 초기세팅
 */
PUI.FN.INIT = async function(){

    //장부유형 조회
    let response = await PUI.FT.getFetch("/api/admin/getCodeList?grpCode=LED_TP_CD&uprCode=ASSETS");
    PUI.V.ledgerTypeList = response.data;

    //장부유형 라디오 생성
    PUI.UTL.appendCodeRadio(document.getElementById("ledgerType"), PUI.V.ledgerTypeList, "ledgerType");

    //장부인덱스 해당 정보 조회
    let searchParams = new URL(location.href).searchParams; 
    if(searchParams.has("ledIdx")){
        response = await PUI.FT.getFetch("/api/assets/getLedger?ledIdx="+searchParams.get("ledIdx"));
        console.log("response:", response);
    }
};

/**
 * 클릭 이벤트
 * @param {event} event 
 */
PUI.EV.CLICK = function(event){
    switch(event.target.id){
    //장부 기본정보 저장
    case "basicSave": 
        PUI.FN.basicSave(event);
        break;
    //장부 전체저장 & 저장완료
    case "allSave":
        PUI.FN.allSave(event);
        break;
    }
}

/**
 * 체인지 이벤트
 * @param {event} event 
 */
PUI.EV.CHANGE = function(event){
    //장부유형 선택에 따라서 항목 표시/비표시
    if(event.target.name == "ledgerType"){
        let ledTpCd = document.querySelectorAll("input[name='ledgerType']:checked");
        document.getElementsByName("ledgerContent").forEach(el => el.style.display = "none");
        switch(ledTpCd[0].value){
        case "CASH_BOOK":
            //가계부 세목
            document.getElementById("ledgerItems").style.display = "block";
            //가계부 계좌
            document.getElementById("ledgerAccount").style.display = "block";
            break;
        case "SIMP_CASH_BOOK":
            break;
        }
    }
}

/**
 * 장부 기본정보 저장
 * @param {event} event 
 */
PUI.FN.basicSave = function(event){

    //유효성 검사 - 장부명
    if(PUI.UTL.simpleValidation(ledgerName.value, ["EMPTY"]) == false){
       alert("장부명을 입력해주세요.");
       ledgerName.focus();
       return;
    //유효성 검사 - 장부유형
    }else if(document.querySelectorAll("input[name='ledgerType']:checked").length === 0){
        alert("장부유형을 선택해주세요.");
        return;
    }

    if("CASH_BOOK" == document.querySelectorAll("input[name='ledgerType']:checked")[0].value){
        alert("현재 개발중 입니다.");
        return;
    }

    //기본정보 저장
    if(confirm("저장 하시겠습니까?")){
        PUI.FT.postFetch("/api/assets/applyBasicLedger" , {
            ledNm: ledgerName.value,
            ledTpCd: document.querySelectorAll("input[name='ledgerType']:checked")[0].value,
            ledRmk: ledgerRemark.value
        })
        .then(response => {
            if(response.resultCode === "0000"){
                alert("저장하였습니다.");
                window.location.href = "/assets/ledger/list";
            }else{
                alert("ERROR CODE::" + response.resultCode);
            }
        });
    }
}

/**
 * 장부 전제저장 
 * @param {event} event 
 */
PUI.FN.allSave = function(event){

}