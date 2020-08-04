//초기화면 세팅
if(wUtil.isCookie("pageNm")){
    let pageNm = wUtil.getCookie("pageNm");
    if(pageNm == "undefined"){
        wUtil.removeCookie("pageNm");
        wRoute.route("MAIN");
    }else{
        wRoute.route(wUtil.getCookie("pageNm"));
    }
}else{
    wRoute.route("MAIN");
} 

//nav 클릭이벤트
wAssets.element.nav.addEventListener("click", event => {    
    wRoute.route(event.target.dataset.menuCd);
    event.stopPropagation();
});

//main 이벤트 - click
wAssets.element.main.addEventListener("click", event => {
    wUtil.runFunctionIfNotEmpty(wFuntion.click, event);
    event.stopPropagation();
});

//메뉴생성
wFuntion.createMenu = async () => {
    let menuList = await wFetch.getFetch("/api/admin/getMenuCodeList?mduTpCd=ASSETS");
    let ul, li, div, a = null;

    ul = document.createElement("ul");
    menuList.filter(menu => menu.menuLv == 1).forEach(menu => {
        li = document.createElement("li");
        li.classList.add("dropdown");
        li.dataset.menuCd = menu.menuCd;

        a = document.createElement("a");
        a.textContent = menu.menuNm;

        div = document.createElement("div");
        div.classList.add("dropdown-content");

        li.appendChild(a);
        li.appendChild(div);
        ul.appendChild(li);
    });

    menuList.filter(menu => menu.menuLv == 2).forEach(menu => {        
        for(element of ul.childNodes){
            if(element.dataset.menuCd === menu.menuUprCd){
                a = document.createElement("a");
                a.dataset.menuCd = menu.menuCd;
                a.textContent = menu.menuNm;
                element.firstChild.nextSibling.appendChild(a);
            }
        }
    });

    wAssets.element.nav.appendChild(ul);
};
wFuntion.createMenu();