//초기세팅
PUI.FN.INIT = async function(){

    //계좌사용처, 계좌구분 세팅
    let response = await PUI.FT.getFetch("/api/admin/getCodeList?grpCode=ACCT_TGT_CD,ACCT_DIV_CD");
    PUI.V.acctTgtCd = response.data.filter(item => item.grpCode === "ACCT_TGT_CD");
    PUI.V.acctDivCd = response.data.filter(item => item.grpCode === "ACCT_DIV_CD");

    //그리드 생성 호출
    PUI.FN.createGrid();
};



//그리드 생성
PUI.FN.createGrid = function(){

    let useYn = {Y: "사용", N: "미사용"};
    let useYnList = [{value:"Y", text:"사용"}, {value:"N", text:"미사용"}];
    
    //그리드
    PUI.V.wGrid = new wGrid("acctList", {
        field: [
            {element:"checkbox", name: "check", width:30, align:"center",  edit: "checkbox",           
                event: {
                    change:{
                        header: event => {
                            //헤드 체크박스 클릭시 바디 체크박스 전체선택 & 전체해제
                            PUI.V.wGrid
                                .getElementBody()
                                .querySelectorAll("input[name=" + event.target.name + "]")
                                .forEach(check => {
                                    if(event.target.checked){
                                        check.checked = true;
                                    }else{
                                        check.checked = false;
                                    }
                                });
                        },
                        body: (event, item) => {
                            //바디 체크박스 전체 체크(전체 체크시 헤더 체크박스 선택, 전체가 아닐경우 해제)
                            let isCheck = true;
                            let check = null;
                            let checks = PUI.V.wGrid
                                .getElementBody()
                                .querySelectorAll("input[name=" + event.target.name + "]");
                            for(check of checks){
                                if(check.checked == false){
                                    isCheck = false;
                                    break;
                                }
                            }
                            
                            //바디 체크박스 전체 선택시 헤드체크박스 선택 / 반대인경우 해제
                            check = PUI.V.wGrid
                                .getElementHeadTableRow()
                                .querySelectorAll("input[name=" + event.target.name + "]")[0];
                            if(isCheck){
                                check.checked = true;
                            }else{
                                check.checked = false;
                            }
                        }
                    }
                }
            },
            {title: "계좌사용처", element:"text", name:"acctTgtCd", width:175, align:"left", edit:"select",
                data:{
                    mapping: PUI.UTL.listToCode(PUI.V.acctTgtCd),
                    select: {list: PUI.V.acctTgtCd, value: "code", text: "codeNm", empty:"선택"}
                }
            },
            {title: "계좌구분", element:"text", name:"acctDivCd", width:170, align:"center", edit:"select",
                data:{
                    mapping: PUI.UTL.listToCode(PUI.V.acctDivCd),
                    select: {list: PUI.V.acctDivCd, value: "code", text: "codeNm", empty:"선택"}
                },
            }, 
            {title: "계좌명", element:"text", name:"acctNm", width:280, align:"left", edit:"text"}, 
            {title: "계좌번호", element:"text", name:"acctNum", width:200, align:"left", edit:"text"}, 
            {title: "생성일", element:"date", name:"cratDt", width:100, align:"left", edit:"date"}, 
            {title: "만기일여부", element:"text", name:"epyDtUseYn", width:75, align:"left", edit:"select",
                data: {
                    mapping: useYn,
                    select: {list: useYnList}
                },
                event: {
                    change: {
                        body: event => {
                            let epyDt = PUI.UTL.getTrNode(event.target).querySelectorAll("input[name='epyDt']")[0];
                            if(event.target.value == "Y"){
                                epyDt.disabled = false;
                            }else{
                                epyDt.value = "";
                                epyDt.disabled = true;
                            }
                        }
                    }
                }
            }, 
            {title: "만기일", element:"date", name:"epyDt", width:100, align:"left", edit:"date"}, 
            {title: "사용여부", element:"text", name:"useYn", width:75, align:"left", edit:"select",
                data:{
                    mapping: useYn,
                    select: {list: useYnList}
                }
            },
            {title: "상세정보", element:"button", name:"detail", width:80, text:"보기",
                event:{
                    click:{
                        body: (event, item) => {
                            if(item.acctSeq){
                                document.location.href = "/assets/account/detail?acctSeq="+ item.acctSeq
                            }
                        }
                    }
                }
            }
        ],
        option: {
            style: {
                width: 1385,
                height: 566
            }
        }
    });

    //데이터 조회
    PUI.FT.getFetch("/api/assets/getAccountList")
    .then(response => {
        PUI.V.wGrid.setData({list:response.data, isRefresh:true});
    });
};

//클릭 이벤트
PUI.EV.CLICK = function(event){
    switch(event.target.id){
        case "acctAdd":
            PUI.V.wGrid.appendNewRow();
            PUI.V.wGrid.getElementHeadTableRow()
                .querySelectorAll("input[name=check]")[0]
                .checked = false;
            break;
        case "acctRst":
            PUI.V.wGrid.reset();
            break;
        case "acctDtlReg":
            document.location.href = "/assets/account/register";
            break;

    }
}