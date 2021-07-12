//초기세팅
PUI.FN.INIT = async function(){

    //장부유형 조회
    let response = await PUI.FT.getFetch("/api/admin/getCodeList?grpCode=LED_TP_CD&uprCode=ASSETS");
    PUI.V.ledTpCd = response.data;
    
    //장부유형 라디오 생성
    PUI.UTL.appendCodeRadio(document.getElementById("ledTpCd"), PUI.V.ledTpCd, "ledTpCd");

    // //계좌사용처, 계좌구분 세팅
    // let response = await PUI.FT.getFetch("/api/admin/getCodeList?grpCode=ACCT_TGT_CD,ACCT_DIV_CD");
    // PUI.V.acctTgtCd = response.data.filter(item => item.grpCode === "ACCT_TGT_CD");
    // PUI.V.acctDivCd = response.data.filter(item => item.grpCode === "ACCT_DIV_CD");

    // let input, label = null;
    // let acctTgt = document.getElementById("acctTgtCd");
    // let acctDiv = document.getElementById("acctDivCd");

    // //계좌사용처 생성
    // PUI.V.acctTgtCd.forEach((itme, index) => {          
    //     //라디오버튼 생성
    //     input = document.createElement("input");
    //     input.value = itme.code;
    //     PUI.UTL.setAttributes(input, {name: "acctTgtCd", type: "radio", id: itme.code});        
    //     acctTgt.appendChild(input);

    //     //라벨 생성
    //     label = document.createElement("label");
    //     label.setAttribute("for", itme.code);
    //     label.textContent =  itme.codeNm;
    //     acctTgt.appendChild(label);
    // });

    // //계좌구분
    // PUI.V.acctDivCd.forEach((itme, index) => {
    //     //라디오버튼 생성
    //     input = document.createElement("input");
    //     input.value = itme.code;
    //     PUI.UTL.setAttributes(input, {name: "acctDivCd", type: "radio", id: itme.code});        
    //     acctDiv.appendChild(input);

    //     //라벨 생성
    //     label = document.createElement("label");
    //     label.setAttribute("for", itme.code);
    //     label.textContent =  itme.codeNm;
    //     acctDiv.appendChild(label);
    // });
};

//클릭이벤트
PUI.EV.CLICK = function(event){
 
}

//클릭이벤트
PUI.EV.CHANGE = function(event){

    //장부유형 선택에 따라서 항목 표시/비표시
    if(event.target.name == "ledTpCd"){
        let ledTpCd = document.querySelectorAll("input[name='ledTpCd']:checked");
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