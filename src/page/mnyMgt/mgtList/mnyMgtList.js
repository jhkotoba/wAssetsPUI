//====================== init ==========================
//페이지 초기화
wFuntion.init = arge => {    
    wFuntion.createGrid();
}

//====================== event ==========================
//클릭 이벤트
wFuntion.click = event => {
    switch(event.target.id){
    case "srhBtn": wFuntion.srhBtnClick(event); break;
    case "regBtn": wFuntion.regBtnClick(event); break;
    }
};

//조회 클릭이벤트
wFuntion.srhBtnClick = event => {  
    alert("TEST");
};

//등록 클릭이벤트
wFuntion.regBtnClick = event => {
    //wRoute.route("MNY_LIST_REG");
};

//====================== grid ==========================
//그리드 생성
wFuntion.createGrid = () => {
    PUI.grid = new wGrid("mnyList", {
        field: [
            {title: "자금유형", name:"mnyTp", width:100, align:"center"},
            {title: "자금명", name:"mnyNm", width:264, align:"left"},           
        ],
        option: {
            isInstantCreate: true,
             style: {
                 width: 1386,
                 height: 594
             }
        },
        //TEST DATA
        //data: [],
        data: [
            {mnyTp: "가게부", mnyNm:"가계부1"},
            {mnyTp: "간의가게부", mnyNm:"간의가계부1"}
        ]
    });
};

