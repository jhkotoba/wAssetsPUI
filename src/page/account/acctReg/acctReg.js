//초기화면 세팅
PUI.FN.INIT = () => {
    let input, label;

    wUtil.blindShow();
    PUI.V.fetchCnt = 0;    

    //계좌사용처코드 조회 및 세팅
    wFetch.getFetch("/api/admin/getCodeList?grpCode=ACCT_TGT_CD").then(list => {
        PUI.V.acctTpCdList = list;

        let useTgt = document.getElementById("useTgt");
        list.forEach((code, index) => {
            //라디오버튼 생성
            input = document.createElement("input");
            input.value = code.code;
            wUtil.setAttributes(input, {name: "acctTgtCd", type: "radio", id: code.code});
            if(index === 0){ input.checked = true; }
            useTgt.appendChild(input);

            //라벨 생성
            label = document.createElement("label");
            label.setAttribute("for", code.code);
            label.textContent =  code.codeNm;
            useTgt.appendChild(label);
        });
        input = null;
    }).then(PUI.FN.isInitFetchEnd);

    //계좌구분코드 조회 및 세팅
    wFetch.getFetch("/api/admin/getCodeList?grpCode=ACCT_DIV_CD").then(list => {
        PUI.V.acctType = list;

        let acctType = document.getElementById("acctType");
        list.forEach((code, index) => {
            //라디오버튼 생성
            input = document.createElement("input");
            input.value = code.code;
            wUtil.setAttributes(input, {name: "acctDivCd", type: "radio", id: code.code});
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
    .then(PUI.FN.isInitFetchEnd);
};

//init end 체크
PUI.FN.isInitFetchEnd = () =>{
    PUI.V.fetchCnt = PUI.V.fetchCnt+1;
    if(PUI.V.fetchCnt > 1){
        wUtil.blindHide();
    }
}

//클릭 이벤트 switch
PUI.FN.click = event => {
    switch(event.target.id){
        case "epyDtUseYn" :
            PUI.FN.epyDtUseYnClick(event);
            break;
        case "cancel" :
            if(confirm("계좌등록을 취소 하시겠습니까?")){
                wRoute.route("ACCT_LIST");
            }
            break;
        case "save" : 
            PUI.FN.saveClick(event);
            break;
    }
}

//만기일 클릭 이벤트
PUI.FN.epyDtUseYnClick = event => {
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
PUI.FN.saveClick = event => {
    let param = wUtil.getParams([
        {name:"acctTgtCd"},
        {name:"acctDivCd"},
        {id:"acctNum", title:"계좌번호", valid:["notEmpty", "accountNumber"]},
        {id:"acctNm", title:"계좌명", valid:["notEmpty"]},
        {id:"cratDt", title:"생성일", valid:["notEmpty", "date"]},
        {id:"epyDtUseYn"},
        {id:"epyDt"},
        {id:"fontClor"},
        {id:"bkgdClor"},
        {name:"useYn"},
        {id:"rmk"}
    ]);
    
    if(param.isValid){
        if(wUtil.isNotEmpty(param.data.fontClor) && wUtil.isNotEmpty(param.data.bkgdClor) &&
            param.data.fontClor === param.data.bkgdClor){
            alert("글자색과 배경색이 동일합니다.");
        }else if(confirm("저장하시겠습니까?")){
            param.data.cratDt = param.data.cratDt.replace(/-/gi, "");
            param.data.epyDt = param.data.epyDt.replace(/-/gi, "");
            wFetch.postFetch("/api/assets/saveAccount" , param.data)
                .then(response => {
                    if(response.resultCode === "0000"){
                        alert("저장하였습니다.");
                    }else{
                        alert("ERROR CODE::" + response.resultCode);
                    }
                });
        }
    }else{
        alert(param.msg);
        param.target.focus();
    }
}

//keyup 이벤트 switch
PUI.FN.keyup = event => {
    switch(event.target.id){
        case "fontClor":
        case "bkgdClor":
            let regex = /^#(?:[0-9a-f]{3}){1,2}$/i;
            let element = document.getElementById(event.target.id + "Dsp");    
            if(regex.test(event.target.value)){
                element.style.background = event.target.value;
            }else{
                element.style.background = "";
            }
        break;
    }
}

//change 이벤트 switch
PUI.FN.change = event => {
    switch(event.target.id){
        case "fontClor":
        case "bkgdClor":
            let regex = /^#(?:[0-9a-f]{3}){1,2}$/i;            
            if(!regex.test(event.target.value)){
                event.target.value = "";
            }
        break;
    }
}