//메뉴생성
PUI.FN.createMenu = function(menuList){
    let ul, li, div, a = null;
    let nav = document.getElementsByTagName("nav")[0];

    //1레벨 메뉴 생성
    ul = document.createElement("ul");
    menuList.filter(menu => menu.menuLv == 1).forEach(menu => {
        li = document.createElement("li");
        li.classList.add("dropdown");
        li.dataset.menuCd = menu.menuCd;
        if(PUI.UTL.isNotEmpty(menu.pageCd)) li.dataset.pageCd = menu.pageCd;

        a = document.createElement("a");
        a.textContent = menu.menuNm;

        div = document.createElement("div");
        div.classList.add("dropdown-content");

        li.appendChild(a);
        li.appendChild(div);
        ul.appendChild(li);
    });   

    //2레벨 메뉴 생성
    menuList.filter(menu => menu.menuLv == 2).forEach(menu => {
        for(let element of ul.childNodes){
            if(element.dataset.menuCd === menu.menuUprCd){
                a = document.createElement("a");
                a.dataset.menuCd = menu.menuCd;
                a.textContent = menu.menuNm;
                element.firstChild.nextSibling.appendChild(a);
                if(PUI.UTL.isNotEmpty(menu.pageCd)){
                    a.dataset.pageCd = menu.pageCd;
                }
            }
        }
    });

    nav.appendChild(ul);
}

//메뉴코드 조회
if(PUI.UTL.getCookie("SESSION_TOKEN") && window.sessionStorage.getItem("menuList")){
    PUI.FN.createMenu(JSON.parse(window.sessionStorage.getItem("menuList")));
}else{
    PUI.FT.getFetch("/api/admin/getMenuCodeList?mduTpCd=ASSETS").then(response => {
        if(response.resultCode === "0000"){
            window.sessionStorage.setItem("menuList", JSON.stringify(response.data));
            PUI.FN.createMenu(response.data);
        }
    });
}

// //메뉴생성
// PUI.FT.getFetch("/api/admin/getMenuCodeList?mduTpCd=ASSETS").then(menu =>{
//     console.log("menu:", menu);
// });



 //초기화면 세팅
//  PUI.initialize = () => {
    
//     //쿠키체크 페이지 조회
//     // if(wUtil.isCookie("wApageNm")){
//     //     let wApageNm = wUtil.getCookie("wApageNm");
//     //     if(wApageNm == "undefined"){
//     //         wUtil.removeCookie("wApageNm");
//     //         wRoute.route("MAIN");
//     //     }else{
//     //         wRoute.route(wUtil.getCookie("wApageNm"));
//     //     }
//     // }else{
//     //     wRoute.route("MAIN");
//     // }

//     //페이지 표시
//     //wRoute.route(null);

    
//     //nav 클릭이벤트
//     PUI.element.nav.addEventListener("click", event => {
//         wRoute.route(event.target.dataset.pageCd);
//         event.stopPropagation();
//     });
    
//     //main 이벤트 - click
//     PUI.element.main.addEventListener("click", event => {
//         UTIL.runFunctionIfNotEmpty(PUI.FN.click, event);
//         event.stopPropagation();
//     });

//     //main 이벤트 - dbClick
//     PUI.element.main.addEventListener("dblclick", event => {
//         UTIL.runFunctionIfNotEmpty(PUI.FN.dblclick, event);
//         event.stopPropagation();
//     });

//     //main 이벤트 - change
//     PUI.element.main.addEventListener("change", event => {
//         UTIL.runFunctionIfNotEmpty(PUI.FN.change, event);
//         event.stopPropagation();
//     });

//     //main 이벤트 - keyup
//     PUI.element.main.addEventListener("keyup", event => {
//         UTIL.runFunctionIfNotEmpty(PUI.FN.keyup, event);
//         event.stopPropagation();
//     });
    
//     //메뉴생성
//     PUI.FN.createMenu = async () => {
//         let menuList = await wFetch.getFetch("/api/admin/getMenuCodeList?mduTpCd=ASSETS");

//         let ul, li, div, a = null;
    
//         //1레벨 메뉴 생성
//         ul = document.createElement("ul");
//         menuList.filter(menu => menu.menuLv == 1).forEach(menu => {
//             li = document.createElement("li");
//             li.classList.add("dropdown");
//             li.dataset.menuCd = menu.menuCd;
//             if(UTIL.isNotEmpty(menu.pageCd)) li.dataset.pageCd = menu.pageCd;
    
//             a = document.createElement("a");
//             a.textContent = menu.menuNm;
    
//             div = document.createElement("div");
//             div.classList.add("dropdown-content");
    
//             li.appendChild(a);
//             li.appendChild(div);
//             ul.appendChild(li);
//         });
    
//         //2레벨 메뉴 생성
//         menuList.filter(menu => menu.menuLv == 2).forEach(menu => {
//             for(element of ul.childNodes){
//                 if(element.dataset.menuCd === menu.menuUprCd){
//                     a = document.createElement("a");
//                     a.dataset.menuCd = menu.menuCd;
//                     a.textContent = menu.menuNm;
//                     element.firstChild.nextSibling.appendChild(a);
//                     if(UTIL.isNotEmpty(menu.pageCd)){
//                         a.dataset.pageCd = menu.pageCd;
//                     }
//                 }
//             }
//         });
    
//         PUI.element.nav.appendChild(ul);
//     };
//     PUI.FN.createMenu();
//  }