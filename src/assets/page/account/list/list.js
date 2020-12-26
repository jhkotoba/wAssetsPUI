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
        case "acctReg" :
            document.location.href = "/assets/account/register";
            break;
    }
};

//그리드 생성
PUI.FN.createGrid = function(){
    
    //그리드
    PUI.V.wGrid = new wGrid("acctList", {
        field: [
            {title: "계좌사용처", name:"acctTgtCd", width:200, align:"center", codeMapping:PUI.UTL.listToCode(PUI.V.acctTgtCd)},
            {title: "계좌구분", name:"acctDivCd", width:188, align:"left", codeMapping:PUI.UTL.listToCode(PUI.V.acctDivCd)}, 
            {title: "계좌명", name:"acctNm", width:400, align:"left"}, 
            {title: "계좌번호", name:"acctNum", width:240, align:"left"}, 
            {title: "생성일", name:"cratDt", width:100, align:"left"}, 
            {title: "만기일", name:"epyDt", width:100, align:"left"}, 
            {title: "사용여부", name:"useYn", width:80, align:"left", codeMapping:{Y: "사용", N: "미사용"}}
        ],
        option: {
            isInitCreate: {isHeader:true, isBody:true, isFooter:false},
            style: {
                width: 1386,
                height: 594
            }
        },
        event: {
            dblclick: (event, data) => document.location.href = "/assets/account/detail?acctSeq="+ data._rowSeq
        }
    });

    //데이터 조회
    PUI.FT.getFetch("/api/assets/getAccountList")
        .then(response => {
            PUI.V.wGrid.setData({list:response.data, isRefresh:true});
        });
};