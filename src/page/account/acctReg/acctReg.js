//초기화면 세팅
wFuntion.init = () => {
    let input, label;

    wUtil.blindShow();
    PUI.v.fetchCnt = 0;

    //계좌사용처코드 조회 및 세팅    
    wFetch.getFetch("/api/admin/getCodeList?grpCode=ACCT_TGT_CD").then(list => {
        PUI.v.acctTpCdList = list;        

        let useTgt = document.getElementById("useTgt");
        list.forEach((code, index) => {
            //라디오버튼 생성
            input = document.createElement("input");
            input.value = code.code;         
            wUtil.setAttributes(input, {name: "useTgt", type: "radio", id: code.code});
            if(index === 0){ input.checked = true; }
            useTgt.appendChild(input);

            //라벨 생성
            label = document.createElement("label");
            label.setAttribute("for", code.code);
            label.textContent =  code.codeNm;
            useTgt.appendChild(label);
        });
        input = null;      
    }).then(wFuntion.isInitFetchEnd);

    //계좌구분코드 조회 및 세팅
    wFetch.getFetch("/api/admin/getCodeList?grpCode=ACCT_DIV_CD").then(list => {
        PUI.v.acctType = list;

        let acctType = document.getElementById("acctType");
        list.forEach((code, index) => {
            //라디오버튼 생성
            input = document.createElement("input");
            input.value = code.code;         
            wUtil.setAttributes(input, {name: "acctType", type: "radio", id: code.code});
            if(index === 0){ input.checked = true; }
            acctType.appendChild(input);

            //라벨 생성
            label = document.createElement("label");
            label.setAttribute("for", code.code);
            label.textContent =  code.codeNm;
            acctType.appendChild(label);
        });
        input = null;


    })
    .then(wFuntion.isInitFetchEnd);
};

//init end 체크
wFuntion.isInitFetchEnd = () =>{
    PUI.v.fetchCnt = PUI.v.fetchCnt+1;
    if(PUI.v.fetchCnt > 1){
        wUtil.blindHide();
    }
}

//클릭 이벤트 switch
wFuntion.click = event => {
    switch(event.target.id){
        case "epyDtUseYn":
            wFuntion.epyDtUseYnClick(event);
        break;
    }
}

//만기일 클릭 이벤트
wFuntion.epyDtUseYnClick = event => {
    let epyDt = document.getElementById("epyDt");
    if(event.target.checked){
        epyDt.disabled = false;
    }else{
        epyDt.value = "";
        epyDt.disabled = true;
    }
}
//클릭 이벤트
// wFuntion.click = event => {    
//     //사용대상 라디오체크 클릭
//     if(event.target.tagName === "INPUT" && event.target.type === "radio" && event.target.parentNode.id === "useTgt"){
//         wFuntion.createAcctType(event.target.value);
//     }
// };

// //계좌구분 라디오버튼 생성
// wFuntion.createAcctType = (value) => {    
//     let acctType = document.getElementById("acctType");
//     wUtil.childEmpty("acctType");

//     PUI.v.acctType.forEach((code, index) => {
//         if(code.uprCode === value){

//             let input, label;
//             //라디오버튼 생성
//             input = document.createElement("input");
//             input.value = code.code;         
//             wUtil.setAttributes(input, {name: "acctType", type: "radio", id: code.code});
//             if(index === 0){ input.checked = true; }
//             acctType.appendChild(input);

//             //라벨 생성
//             label = document.createElement("label");
//             label.setAttribute("for", code.code);
//             label.textContent =  code.codeNm;
//             acctType.appendChild(label);
//         }
//     });
// };

 