//페이지 초기화
wFuntion.init = () => () => {
    wFuntion.createGrid();   
}

//이벤트 등록
wFuntion.event = () => {
    return {
        click: event => wFuntion.click(event)
    }
};

//클릭이벤트
wFuntion.click = event => {
    if(event.target.id === "srhBtn"){
        alert("srhBtn");
    }
};

wFuntion.createGrid = () => {
    let ledGrid = new wGrid("ledgerMgt");
    ledGrid.create();
};

