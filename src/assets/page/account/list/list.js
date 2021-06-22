//초기세팅
PUI.FN.INIT = async function(){

    //계좌사용처, 계좌구분 세팅
    let response = await PUI.FT.getFetch("/api/admin/getCodeList?grpCode=ACCT_TGT_CD,ACCT_DIV_CD");
    PUI.V.acctTgtCd = response.data.filter(item => item.grpCode === "ACCT_TGT_CD");
    PUI.V.acctDivCd = response.data.filter(item => item.grpCode === "ACCT_DIV_CD");

    //검색항목 계좌사용처 항목추가
    PUI.UTL.appendCodeOptions(document.getElementById("acctTgtCd"), PUI.V.acctTgtCd);
    //검색항목 계좌구분 항목추가
    PUI.UTL.appendCodeOptions(document.getElementById("acctDivCd"), PUI.V.acctDivCd);
    //달력생성
    PUI.V.datepicker = new wDatepicker();
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
                            //헤드 체크박스 클릭시 바디 체크박스 전체선택 & 전체해제 (기본상태만)
                            PUI.V.wGrid
                                .getElementBody()
                                .querySelectorAll("input[name=" + event.target.name + "]")
                                .forEach(check => {
                                    if(PUI.UTL.isEmpty(PUI.UTL.getTrNode(check).classList.value)){
                                        if(event.target.checked){
                                            check.checked = true;
                                        }else{
                                            check.checked = false;
                                        }
                                    }
                                });
                        },
                        body: (event, item) => {

                            //신규행 체크상태에서 체크 해제시 확인 후 행 삭제
                            switch(item._state){
                            case "INSERT":
                                if(confirm("신규행 작성을 삭제 하시겠습니까?")){
                                    PUI.V.wGrid.removeRowSeq(item._rowSeq);
                                }else{
                                    event.target.checked = !event.target.checked;
                                    return;
                                }
                                break;
                            case "UPDATE":
                                if(PUI.V.wGrid.isChangeDataRowSeq(item._rowSeq)){
                                    if(!confirm("변경사항이 있습니다. 취소하시겠습니까?")){
                                        return;
                                    }
                                }
                                PUI.V.wGrid.cancelStateRowSeq(item._rowSeq);
                                break;
                            case "REMOVE":
                                PUI.V.wGrid.cancelStateRowSeq(item._rowSeq);
                                break;
                            }
                            
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
                },
                loaded: (element, item) => {
                    if(item._state == "INSERT" || item._state == "UPDATE"){
                        element.checked = true;
                    }
                }
            },
            {title: "계좌사용처", element:"text", name:"acctTgtCd", width:160, align:"left", edit:"select",
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
            {title: "계좌명", element:"text", name:"acctNm", width:190, align:"left", edit:"text"}, 
            {title: "계좌번호", element:"text", name:"acctNum", width:185, align:"left", edit:"text"}, 
            {title: "글자색", element:"text", name:"fontClor", width:40, align:"left"},
            {title: "배경색", element:"text", name:"bkgdClor", width:40, align:"left"},
            {title: "생성일", element:"date", name:"cratDt", width:120, align:"left", edit:"date", loaded: PUI.FN.createCalendarBtn}, 
            {title: "만기일여부", element:"text", name:"epyDtUseYn", width:75, align:"left", edit:"select",
                data: {
                    mapping: useYn,
                    select: {list: useYnList}
                },
                event: {
                    change: {
                        body: (event, item) => {
                            if(item._state == "INSERT" || item._state == "UPDATE"){
                                let epyDt = PUI.UTL.getTrNode(event.target).querySelectorAll("input[name='epyDt']")[0];
                                if(event.target.value == "Y"){
                                    epyDt.disabled = false;
                                    epyDt.nextSibling.disabled = false;
                                }else{
                                    epyDt.value = "";
                                    epyDt.disabled = true;
                                    epyDt.nextSibling.disabled = true;
                                }
                            }
                        }
                    }
                },
                loaded: (element, item) => {
                    if(item._state == "INSERT" || item._state == "UPDATE"){
                        let epyDt = PUI.UTL.getTrNode(element).querySelectorAll("input[name='epyDt']")[0];
                        if(element.value == "Y"){
                            epyDt.disabled = false;
                        }else{
                            epyDt.value = "";
                            epyDt.disabled = true;
                        }
                    }
                }
            }, 
            {title: "만기일", element:"date", name:"epyDt", width:120, align:"left", edit:"date", emptyText:"-", loaded: PUI.FN.createCalendarBtn}, 
            {title: "사용여부", element:"text", name:"useYn", width:75, align:"left", edit:"select",
                data:{
                    mapping: useYn,
                    select: {list: useYnList}
                }
            },
            {title: "순번", element:"text", name:"acctOdr", width:50, align:"center", edit:"text"}
        ],
        option: {
            style: {
                width: 1385,
                height: 566
            }
        }
    });

    //데이터 조회
    PUI.FT.getFetch("/api/assets/getAccountList", {isBlind:true})
    .then(response => {
        PUI.V.wGrid.setData({list:response.data.sort((a, b) => a.acctOdr - b.acctOdr), isRefresh:true});
    });
};

//클릭 이벤트
PUI.EV.CLICK = function(event){
    let chkList = [];
    switch(event.target.id){
        //행추가
        case "acctAdd":
            PUI.V.wGrid.prependNewRow();
            PUI.V.wGrid.getElementHeadTableRow()
                .querySelectorAll("input[name=check]")[0]
                .checked = false;
            break;
        //체크된 행 수정상태
        case "acctMod":
            PUI.V.wGrid.getNameCheckedNodes("check")
                .forEach(check => {
                    let tr = PUI.UTL.getTrNode(check);
                    if(tr.classList.value == ""){
                        chkList.push(tr.dataset.rowSeq);
                    }
                });
            PUI.V.wGrid.modifyStateRowSeqs(chkList);
            break;
        //체크된 행 삭제상태
        case "acctDel":
            PUI.V.wGrid.getNameCheckedNodes("check")
                .forEach(check => {
                    let tr = PUI.UTL.getTrNode(check);
                    if(tr.classList.value == ""){
                        chkList.push(tr.dataset.rowSeq);
                    }
                });
            PUI.V.wGrid.removeStateRowSeqs(chkList);
            break;
        //목록 초기상태로 리셋
        case "acctRst":
            PUI.FT.getFetch("/api/assets/getAccountList", {isBlind:true})
            .then(response => {
                PUI.V.wGrid.setData({list:response.data.sort((a, b) => a.acctOdr - b.acctOdr), isRefresh:true});
            });
            break;        
        //변경사항 저장
        case "acctReg":
            PUI.FN.applyAccount();
            break;
        
        case "acctTest":
            console.log("==============================");
            PUI.V.datepicker.open();
            break;

    }
}

//계좌 수정, 삭제, 추가
PUI.FN.applyAccount = function(){

    //변경사항 데이터 가져오기(신규, 수정, 삭제)
    let applyData = PUI.V.wGrid.getApplyData();

    //변경사항 체크
    if(applyData.length === 0){
        alert("변경항목이 없습니다.");
        return;
    }

    //유효성검사
    let valid = {};
    applyData.forEach(item => {
        if(valid.isValid == false) return;
        for(let key in item){
            if(valid.isValid == false) break;
            switch(key){
                case "acctOdr": valid = PUI.UTL.valid(item[key], key, ["EMPTY", "NUMBER"]); break;
                case "acctDivCd": valid = PUI.UTL.valid(item[key], key, ["EMPTY"]); break;
                case "acctNm": valid = PUI.UTL.valid(item[key], key, ["EMPTY"]); break;
                case "acctNum": valid = PUI.UTL.valid(item[key], key, ["EMPTY"]); break;
                case "acctTgtCd": valid = PUI.UTL.valid(item[key], key, ["EMPTY"]); break;
                case "cratDt": valid = PUI.UTL.valid(item[key], key, ["DATE_YYYYMMDD"]); break;
                case "epyDt":
                    if(item.epyDtUseYn == "Y"){
                        valid = PUI.UTL.valid(item[key], key, ["DATE_YYYYMMDD"]);
                    }
                break;
                case "acctOdr": valid = PUI.UTL.valid(item[key], key, ["EMPTY", "NUMBER"]); break;
            }

            if(valid.isValid == false){
                valid.item = item;
            }else{
                valid.item = {};
            }
        }
    });

    //유효성 검사
    if(valid.isValid == false){
        PUI.UTL.tooltip(
            PUI.V.wGrid.getCellElement(valid.item._rowSeq, valid.key), 
            PUI.UTL.getValidMessage(valid.validType),
            3000
        );
    }else{
        if(confirm("적용하시겠습니까?")){
            PUI.FT.postFetch("/api/assets/applyAccount" , applyData)
            .then(response => {
                if(response.resultCode == "0000"){
                    alert("적용하였습니다.");                    
                }else{
                    alert("ERROR CODE::" + response.resultCode);
                }
            });
        }
    }
}

//그리드 달력 버튼 생성 함수
PUI.FN.createCalendarBtn = function(element, item){
    //상태가 신규저장, 수정인 상태만
    if(item._state == "INSERT" || item._state == "UPDATE"){
        //달력 버튼 생성
        let button = document.createElement("button");
        button.classList.add("btn-calendar");
        button.addEventListener("click", event => {
            //달력 OPEN
            PUI.V.datepicker.open({
                event: event,
                //달력 선택시 날짜 반환
                selected: dateString => {
                    //태그 값 반영
                    element.value = dateString;
                    //데이터 값 반영
                    item.cratDt = dateString;
                }
            });
        });
        //스타일 수정
        element.classList.remove("wgrid-wth90p");
        element.classList.add("w80px");
        //달력open 버튼 추가
        element.parentNode.appendChild(button);
    }
}