PUI.FN.INIT = () => {
    //데이터 조회
    PUI.FN.getData();

    //그리드 세팅
    PUI.FN.settingGrid();

    //화면시작
    //PUI.FN.startPage();
}

//데이터 조회
PUI.FN.getData = async () => {
    let list = await wFetch.getFetch("/api/assets/getAccountList");
    console.log("list:", list);
};

//그리드 세팅
PUI.FN.settingGrid = () => {
    PUI.V.grid = new wGrid("acctList", {
        field: [
            {title: "계좌사용처", name:"acctTgtNm", width:200, align:"center"},
            {title: "계좌구분", name:"acctDivNm", width:188, align:"left"}, 
            {title: "계좌명", name:"acctNm", width:400, align:"left"}, 
            {title: "계좌번호", name:"acctNum", width:240, align:"left"}, 
            {title: "생성일", name:"cratDt", width:100, align:"left"}, 
            {title: "만기일", name:"epyDt", width:100, align:"left"}, 
            {title: "사용여부", name:"useYn", width:80, align:"left"}
        ],
        option: {
            isInstantCreate: true,
             style: {
                 width: 1386,
                 height: 594
             }
        }
        //TEST DATA
        //data: [],
        //data: [
        //    {acctTgtNm: "국민은행", acctDivNm:"저축예금", acctNm:"국민은행통장", acctNum:"6544-4418", cratDt:"2020-01-01", epyDt: "2030-01-01", useYn: "Y"},
        //    {acctTgtNm: "카카오페이", acctDivNm:"캐시", acctNm:"카카오페이", acctNum:"010-1111-1123", cratDt:"2020-01-01", epyDt: null, useYn: "Y"},
        //]
    });

    //await wFetch.getFetch("/api/admin/getCodeList?grpCode=ACCT_DIV_CD").then(list => {

    PUI.V.grid.setData();
};

//클릭 이벤트 switch
PUI.FN.click = event => {
    switch(event.target.id){
        case "acctReg" :
            wRoute.route("ACCT_REG");
            break;
    }
}