//초기화면 세팅
wFuntion.init = () => {
    let input, label;

    wUtil.blindShow();
    PUI.v.fetchCnt = 0;
    PUI.v.wApageNm = wUtil.getCookie("wApageNm");

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
        case "epyDtUseYn" :
            wFuntion.epyDtUseYnClick(event);
            break;
        case "cancel" :
            wRoute.route(PUI.v.wApageNm);
            break;
        case "save" : 
            wFuntion.saveClick(event);
            break;
    }
}

//만기일 클릭 이벤트
wFuntion.epyDtUseYnClick = event => {
    let epyDt = document.getElementById("epyDt");
    if(event.target.checked){
        epyDt.value = "";
        epyDt.disabled = false;
    }else{
        epyDt.value = "9999-12-31";
        epyDt.disabled = true;
    }
}

//저장
wFuntion.saveClick = event => {
    let param = wUtil.getParams([
        {name:"useTgt"},
        {name:"acctType"},
        {id:"acctNum", vali:["notEmpty", "accountNumber"]},
        {id:"cratDt", vali:["notEmpty", "date"]},
        {id:"epyDtUseYn"},
        {id:"epyDt", vali:["notEmpty", "date"]},
        {id:"rmk"}
    ]);
    
    if(param.isVali){
        if(confirm("저장하시겠습니까?")){
            console.log("save");
        }
    }else{
        alert(param.msg);
        param.target.focus();
    }
}