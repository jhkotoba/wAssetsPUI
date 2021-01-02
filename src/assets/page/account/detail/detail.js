//초기세팅
PUI.FN.INIT = async function(){

    let acctSeq = new URLSearchParams(location.search).get("acctSeq");
    if(PUI.UTL.isEmpty(acctSeq)) window.location.href = "/assets";

    //계좌사용처, 계좌구분 세팅
    let response = null;
    response = await PUI.FT.getFetch("/api/admin/getCodeList?grpCode=ACCT_TGT_CD,ACCT_DIV_CD");
    PUI.V.acctTgtCd = response.data.filter(item => item.grpCode === "ACCT_TGT_CD");
    PUI.V.acctDivCd = response.data.filter(item => item.grpCode === "ACCT_DIV_CD");

    let input, label = null;
    let acctTgt = document.getElementById("acctTgtCd");
    let acctDiv = document.getElementById("acctDivCd");

    //계좌사용처 생성
    PUI.V.acctTgtCd.forEach((itme, index) => {          
        //라디오버튼 생성
        input = document.createElement("input");
        input.value = itme.code;
        PUI.UTL.setAttributes(input, {name: "acctTgtCd", type: "radio", id: itme.code});        
        acctTgt.appendChild(input);

        //라벨 생성
        label = document.createElement("label");
        label.setAttribute("for", itme.code);
        label.textContent =  itme.codeNm;
        acctTgt.appendChild(label);
    });

    //계좌구분
    PUI.V.acctDivCd.forEach((itme, index) => {
        //라디오버튼 생성
        input = document.createElement("input");
        input.value = itme.code;
        PUI.UTL.setAttributes(input, {name: "acctDivCd", type: "radio", id: itme.code});        
        acctDiv.appendChild(input);

        //라벨 생성
        label = document.createElement("label");
        label.setAttribute("for", itme.code);
        label.textContent =  itme.codeNm;
        acctDiv.appendChild(label);
    });

    //계좌정보 조회
    try{
        response = await PUI.FT.getFetch("/api/assets/getAccount?acctSeq="+acctSeq);
        if(response.resultCode === "0000"){
            PUI.V.account = response.data;
            document.getElementById(PUI.V.account.acctTgtCd).checked = true;
            document.getElementById(PUI.V.account.acctDivCd).checked = true;
            document.getElementById("acctNm").value = PUI.V.account.acctNm;
            document.getElementById("acctNum").value = PUI.V.account.acctNum;
            document.getElementById("use"+PUI.V.account.useYn).checked = true;
            document.getElementById("cratDt").value = PUI.V.account.cratDt;
            if(PUI.V.account.epyDtUseYn === PUI.GV.Y){
                document.getElementById("epyDtUseYn").checked = true;
                document.getElementById("epyDt").value = PUI.V.account.epyDt;
            }
            document.getElementById("remark").value = PUI.V.account.remark;
        }else{
            alert("계좌정보가 없습니다.");
            document.location.href = "/assets/account/list";
        }
    }catch(error){
        alert("error: " + error);
        document.location.href = "/assets/account/list";
    }
};

//클릭이벤트
PUI.EV.CLICK = function(event){
    switch(event.target.id){
        case "register" :
            PUI.FN.accountRegister(event);
            break;
        case "cancel" :
            if(confirm("계좌수정을 취소 하시겠습니까?")){
                window.location.href = "/assets/account/list";
            }
            break;
        case "epyDtUseYn" :
            let epyDt = document.getElementById("epyDt");
            if(event.target.checked){
                epyDt.value = "";
                epyDt.disabled = false;
            }else{
                epyDt.value = "9999-12-31";
                epyDt.disabled = true;
            }
            break;
    }
}

//keyup 이벤트 switch
PUI.EV.KEYUP = event => {
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
PUI.EV.CHANGE = event => {
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

//계좌수정
PUI.FN.accountModify = function(event){
    let param = PUI.UTL.getParams([
        {target:"acctTgtCd", type:"raido", title:"사용처", valid:["notEmpty"]},
        {target:"acctDivCd", type:"raido", title:"계좌구분", valid:["notEmpty"]},
        {target:"acctNm", type:"input", title:"계좌명", valid:["notEmpty"]},
        {target:"acctNum", type:"input", title:"계좌번호", valid:["notEmpty", "accountNumber"]},
        {target:"useYn", type:"raido", title:"사용구분", valid:["notEmpty"]},
        {target:"cratDt", type:"input", title:"생성일", valid:["notEmpty", "date"]},        
        {target:"epyDtUseYn", type:"check"},
        {target:"epyDt", type:"input"},        
        {target:"fontClor", type:"input"},
        {target:"bkgdClor", type:"input"},        
        {target:"remark", type:"input"}
    ], {
        isValid: true, isAlert: true, isFocus: true
    });
    
    if(param.isValid){
        if(PUI.UTL.isNotEmpty(param.data.fontClor) && PUI.UTL.isNotEmpty(param.data.bkgdClor) &&
            param.data.fontClor === param.data.bkgdClor){
            alert("글자색과 배경색이 동일합니다.");
        }else if(confirm("수정하시겠습니까?")){
            param.data.cratDt = param.data.cratDt.replace(/-/gi, "");
            param.data.epyDt = param.data.epyDt.replace(/-/gi, "");
            PUI.FT.postFetch("/api/assets/saveAccount" , param.data)
                .then(response => {
                    if(response.resultCode === "0000"){
                        alert("수정하였습니다.");
                        window.location.href = "/assets/account/list";
                    }else{
                        alert("ERROR CODE::" + response.resultCode);
                    }
                });
        }
    }
}
