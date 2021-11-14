/**
 * 초기세팅
 */
PUI.FN.INIT = async function(){

    // 장부유형 조회
    let ledTpResp = await PUI.FT.getFetch("/api/admin/getCodeList?grpCode=LED_TP_CD&uprCode=ASSETS");
    PUI.V.ledTpList = ledTpResp.data;
    PUI.V.ledTpNm = PUI.UTL.listToCode(ledTpResp.data);    

    // 장부인덱스 해당 정보 조회
    let searchParams = new URL(location.href).searchParams;
    if(searchParams.has("ledIdx")){
        // 장부조회
        let ledIdxResp = await PUI.FT.getFetch("/api/assets/getLedger?ledIdx="+searchParams.get("ledIdx"));
        // 저장된 장부인 경우 저장된 데이터 표시
        if(ledIdxResp.resultCode == "0000"){
            //조회한 장부정보 데이터 적용 호출
            PUI.FN.dataDisplay(ledIdxResp.data);
        }else window.history.back();
    }else{
        // 장부유형 라디오 생성
        PUI.UTL.appendCodeRadio(document.getElementById("ledTp"), PUI.V.ledTpList, "ledTpCd");
    }

    // 가계부 분류 그리드 세팅
    PUI.FN.createClsfy();
    
};

/**
 * 가계부 분류 그리드 생성
 */
PUI.FN.createClsfy = function(){
    let clsfyMst = {
        fields:[
            {element:"checkbox", name: "check", width:30, align:"center",  edit: "checkbox"},
            {element:"text-edit", name:"acctNum", width:185, align:"left"}
        ],
        option: {
            style: {width: 700, height: 300},
            head: { show: false},
            body: { state: { use: false }}
        }
    }

    PUI.V.mstGrid = new wGrid("clsfyMst", clsfyMst);
    PUI.V.mstGrid.refresh();

    

    


    
   
}

/**
 * 클릭 이벤트
 * @param {event} event 
 */
 PUI.EV.CLICK = function(event){

    switch(event.target.id){
    // 장부 전체저장 & 저장완료
    case "regist":
        PUI.FN.regist(event);
        break;
    // 가계부 분류 마스터 - 추가
    case "clsfyMstAdd":
        PUI.V.mstGrid.appendRow();
        break;
    }
}

/**
 * 조회한 장부정보 데이터 적용
 * @param {object} data 
 */
// PUI.FN.dataDisplay = function(data){
//     //장부명
//     ledNm.value = data.ledNm;
//     //장부유형
//     ledTp.textContent = PUI.V.ledTpNm[data.ledTpCd];
//     //비고
//     ledRmk.value = data.ledRmk;

//     switch(data.ledTpCd){    
//     case "CASH_BOOK":
//         break;
//     case "SIMP_CASH_BOOK":
//         break;
//     }
// };

/**
 * 장부 기본정보 저장
 * @param {event} event 
 */
// PUI.FN.basicSave = function(event){

//     //유효성 검사 - 장부명
//     if(PUI.UTL.simpleValidation(ledNm.value, ["EMPTY"]) == false){
//        alert("장부명을 입력해주세요.");
//        ledNm.focus();
//        return;
//     //유효성 검사 - 장부유형
//     }else if(document.querySelectorAll("input[name='ledTp']:checked").length === 0){
//         alert("장부유형을 선택해주세요.");
//         return;
//     }

//     if("CASH_BOOK" == document.querySelectorAll("input[name='ledTp']:checked")[0].value){
//         alert("현재 개발중 입니다.");
//         return;
//     }

//     //기본정보 저장
//     if(confirm("저장 하시겠습니까?")){
//         PUI.FT.postFetch("/api/assets/applyBasicLedger" , {
//             ledNm: ledNm.value,
//             ledTpCd: document.querySelectorAll("input[name='ledTp']:checked")[0].value,
//             ledRmk: ledRmk.value
//         })
//         .then(response => {
//             if(response.resultCode === "0000"){
//                 alert("저장하였습니다.");
//                 window.location.href = "/assets/ledger/list";
//             }else{
//                 alert("ERROR CODE::" + response.resultCode);
//             }
//         });
//     }
// }

/**
 * 장부 전제저장 
 * @param {event} event 
 */
PUI.FN.regist = function(event){

    // 유효성 검사 - 장부명
    if(PUI.UTL.simpleValidation(ledNm.value, ["EMPTY"]) == false){
       alert("장부명을 입력해주세요.");
       ledNm.focus();
       return;
    // 유효성 검사 - 장부유형
    }else if(document.querySelectorAll("input[name='ledTpCd']:checked").length === 0){
        alert("장부유형을 선택해주세요.");
        return;
    }

    // 장부유형
    let ledTp = document.querySelectorAll("input[name='ledTpCd']:checked")[0].value;

    //장부 저장
    if(confirm("저장 하시겠습니까?")){
        PUI.FT.postFetch("/api/assets/registLedger" , {
            ledNm: ledNm.value,
            ledTpCd: ledTp,
            ledRmk: ledRmk.value
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
 * 체인지 이벤트
 * @param {event} event 
 */
PUI.EV.CHANGE = function(event){
    //장부유형 선택에 따라서 항목 표시/비표시
    if(event.target.name == "ledTpCd"){
        let ledTpCd = document.querySelectorAll("input[name='ledTpCd']:checked");
        document.getElementsByName("ledContent").forEach(el => el.style.display = "none");
        switch(ledTpCd[0].value){
        case "CASH_BOOK":
            //가계부 분류
            document.getElementById("ledClsfy").style.display = "block";
            //가계부 계좌
            document.getElementById("ledAcct").style.display = "block";
            break;
        case "SIMP_CASH_BOOK":
            break;
        }
    }
}