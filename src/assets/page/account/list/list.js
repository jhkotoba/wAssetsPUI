//초기세팅
PUI.FN.INIT = async function(){

    //계좌사용처, 계좌구분 세팅
    let response = await PUI.FT.getFetch("/api/admin/getCodeList?grpCode=ACCT_TGT_CD,ACCT_DIV_CD");
    PUI.V.acctTgtCd = response.data.filter(item => item.grpCode === "ACCT_TGT_CD");
    PUI.V.acctDivCd = response.data.filter(item => item.grpCode === "ACCT_DIV_CD");

    //그리드 생성 호출
    PUI.FN.createGrid();
};

//클릭이벤트
PUI.EV.CLICK = function(event){
    switch(event.target.id){
        case "acctDtlReg" :
            document.location.href = "/assets/account/register";
            break;
    }
};

//그리드 생성
PUI.FN.createGrid = function(){
    
    //그리드
    PUI.V.wGrid = new wGrid("acctList", {
        field: [
            {element:"controller-checkbox", name: "check", width:30, align:"center"},
            {title: "계좌사용처", element:"text", name:"acctTgtCd", width:210, align:"center", codeMapping:PUI.UTL.listToCode(PUI.V.acctTgtCd)},
            {title: "계좌구분", element:"text", name:"acctDivCd", width:170, align:"left", codeMapping:PUI.UTL.listToCode(PUI.V.acctDivCd)}, 
            {title: "계좌명", element:"text", name:"acctNm", width:330, align:"left"}, 
            {title: "계좌번호", element:"text", name:"acctNum", width:200, align:"left"}, 
            {title: "생성일", element:"text", name:"cratDt", width:100, align:"left"}, 
            {title: "만기일", element:"text", name:"epyDt", width:100, align:"left"}, 
            {title: "사용여부", element:"text", name:"useYn", width:65, align:"left", codeMapping:{Y: "사용", N: "미사용"}},
            {title: "상세정보", element:"controller-button", name:"detail", width:80, 
                button:{
                    title: "보기",
                    click: (event, item) => {
                        if(item.data.acctSeq){
                            document.location.href = "/assets/account/detail?acctSeq="+ item.data.acctSeq
                        }
                    }
                }
            }
        ],
        option: {
            isInitCreate: {isHeader:true, isBody:true, isFooter:false},
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
            break;
        case "acctRst":
            PUI.V.wGrid.reset();
            break;
        case "acctDtlReg":
            document.location.href = "/assets/account/register";
            break;

    }
}