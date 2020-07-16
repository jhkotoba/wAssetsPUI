//페이지 초기화
wFuntion.init = () => () => {
    wFuntion.createGrid();   
}

//클릭 이벤트
wFuntion.click = event => {
    switch(event.target.id){
    case "srhBtn": wFuntion.srhBtnClick(event); break;
    case "regBtn": wFuntion.regBtnClick(event); break;
    }
};

//조회 클릭이벤트
wFuntion.srhBtnClick = event => {
    alert("srhBtn");
};

//등록 클릭이벤트
wFuntion.regBtnClick = event => {
    alert("regBtn");
};

wFuntion.createGrid = () => {
    new wGrid("ledgerMgt", {
        field: [
            {title: "종류", name:"ledMgt", width:100, align:"center"},
            {title: "가계부명", name:"ledNm", width:264, align:"left"},
            {title: "사용자", name:"userId", width:100, align:"center"},
            {title: "현재금액", name:"curAmt", width:100, align:"right"},
            {title: "한달수입", name:"monIncmAmt", width:100, align:"right"},
            {title: "한달지출", name:"monExpsAmt", width:100, align:"right"},
            {title: "일년수입", name:"yearIncmAmt", width:100, align:"right"},
            {title: "일년지출", name:"yearExpsAmt", width:100, align:"right"},
            {title: "공개여부", name:"pblcYn", width:100, align:"center"},
            {title: "건수", name:"ledRcdCnt", width:100, align:"right"},
            {title: "최신등록일시", name:"newRegDttm", width:100, align:"center"},
        ],
        option: {
            isInstantCreate: true,
             style: {
                 width: 1386,
                 height: 594
             }
        },
        /*TEST DATA*/
        data: [
            {ledMgt: "상세", ledNm: "테스트가계부1", userId: "jh", curAmt: 25000,
                monIncmAmt: 5000, monExpsAmt: 2000, yearIncmAmt: 100000, yearExpsAmt: 30000, pblcYn: "Y", 
                ledRcdCnt: 424, newRegDttm: new Date().getTime()},
            {ledMgt: "간의", ledNm: "테스트가계부2", userId: "jh", curAmt: 5000,
                monIncmAmt: 500, monExpsAmt: 200, yearIncmAmt: 10000, yearExpsAmt: 3000, pblcYn: "Y", 
                ledRcdCnt: 1424, newRegDttm: new Date().getTime()}
        ]
    });
};

