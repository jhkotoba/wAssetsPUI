//메뉴생성
PUI.FN.createMenu = function(menuList){
    let ul, li, div, a = null;
    let nav = document.getElementsByTagName("nav")[0];

    //1레벨 메뉴 생성
    ul = document.createElement("ul");
    menuList.filter(menu => menu.menuLv == 1).forEach(menu => {
        li = document.createElement("li");
        li.classList.add("dropdown");
        li.dataset.menuUrl = menu.menuUrl;
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
            if(menu.menuUrl.includes(element.dataset.menuUrl)){
                a = document.createElement("a");
                a.href = "/assets" + menu.menuUrl;
                a.textContent = menu.menuNm;
                element.firstChild.nextSibling.appendChild(a);
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