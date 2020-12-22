//초기세팅
PUI.FN.INIT = async function(){

    //계좌사용처, 계좌구분 세팅
    let response = await PUI.FT.getFetch("/api/admin/getCodeList?grpCode=ACCT_TGT_CD,ACCT_DIV_CD");
    PUI.V.acctTgtCd = response.data.filter(item => item.grpCode === "ACCT_TGT_CD");
    PUI.V.acctDivCd = response.data.filter(item => item.grpCode === "ACCT_DIV_CD");

    //사용여부
    PUI.V.useYn = {Y: "사용", N: "미사용"};

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
            {title: "계좌사용처", name:"acctTgtCd", width:200, align:"center", codeMapping:PUI.V.acctTgtCd},
            {title: "계좌구분", name:"acctDivCd", width:188, align:"left", codeMapping:PUI.V.acctDivCd}, 
            {title: "계좌명", name:"acctNm", width:400, align:"left"}, 
            {title: "계좌번호", name:"acctNum", width:240, align:"left"}, 
            {title: "생성일", name:"cratDt", width:100, align:"left"}, 
            {title: "만기일", name:"epyDt", width:100, align:"left"}, 
            {title: "사용여부", name:"useYn", width:80, align:"left", codeMapping:PUI.V.useYn}
        ],
        option: {
            isInitCreate: {isHeader:true, isBody:true, isFooter:false},
            style: {
                width: 1386,
                height: 594
            }
        }
    });

    //데이터 조회
    PUI.FT.getFetch("/api/assets/getAccountList")
        .then(response => PUI.V.wGrid.setData({list:response.data, isRefresh:true}));
};

// PUI.FN.INIT = async () => {
    
//     //계좌사용처코드
//     PUI.V.ACCT_TGT_CD = {};
//     let list = await wFetch.getFetch("/api/admin/getCodeList?grpCode=ACCT_TGT_CD");
//     list.forEach(item => PUI.V.ACCT_TGT_CD[item.code] = item.codeNm);

//     //계좌구분코드
//     PUI.V.ACCT_DIV_CD = {};
//     list = await wFetch.getFetch("/api/admin/getCodeList?grpCode=ACCT_DIV_CD");
//     list.forEach(item => PUI.V.ACCT_DIV_CD[item.code] = item.codeNm);

//     //사용여부
//     PUI.V.USE_YN = {Y: "사용", N: "미사용"};

//     //그리드 세팅
//     PUI.FN.settingGrid();
// }

// //그리드 세팅
// PUI.FN.settingGrid = () => {
//     PUI.V.grid = new wGrid("acctList", {
//         field: [
//             {title: "계좌사용처", name:"acctTgtCd", width:200, align:"center", codeMapping:PUI.V.ACCT_TGT_CD},
//             {title: "계좌구분", name:"acctDivCd", width:188, align:"left", codeMapping:PUI.V.ACCT_DIV_CD}, 
//             {title: "계좌명", name:"acctNm", width:400, align:"left"}, 
//             {title: "계좌번호", name:"acctNum", width:240, align:"left"}, 
//             {title: "생성일", name:"cratDt", width:100, align:"left"}, 
//             {title: "만기일", name:"epyDt", width:100, align:"left"}, 
//             {title: "사용여부", name:"useYn", width:80, align:"left", codeMapping:PUI.V.USE_YN}
//         ],
//         option: {
//             isInitCreate: {isHeader:true, isBody:true, isFooter:false},
//              style: {
//                  width: 1386,
//                  height: 594
//              }
//         }
//     });   

//     //계좌목록 조회
//     wFetch.getFetch("/api/assets/getAccountList")
//         .then(response => PUI.V.grid.setData({list:response.data, isRefresh:true}));
// };

// //클릭 이벤트 switch
// PUI.FN.click = event => {
//     switch(event.target.id){
//         case "acctReg" :
//             wRoute.route("ACCT_REG");
//             break;
//     }
// }

// //더블클릭 이벤트 switch
// PUI.FN.dblclick = event => {
//     //wRoute.route("ACCT_MOD");
// }