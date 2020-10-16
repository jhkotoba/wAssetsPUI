//====================== init ==========================
//페이지 초기화
PUI.FN.INIT = arge => {    
    PUI.FN.createGrid();
}

//====================== event ==========================
//클릭 이벤트
PUI.FN.click = event => {
    switch(event.target.id){
    case "srhBtn": PUI.FN.srhBtnClick(event); break;
    case "regBtn": PUI.FN.regBtnClick(event); break;
    }
};

//조회 클릭이벤트
PUI.FN.srhBtnClick = event => {  
    alert("TEST");
};

//등록 클릭이벤트
PUI.FN.regBtnClick = event => {
    //wRoute.route("MNY_LIST_REG");
};

//====================== grid ==========================
//그리드 생성
PUI.FN.createGrid = () => {
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

