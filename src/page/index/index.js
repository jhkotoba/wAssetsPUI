 //세션체크
 wFetch.getSession().then(session => {
    if(session.isLogin){
        //페이지 세팅
        PUI.userId = session.userId;
        wFuntion.init();
    }else{
        //로그인페이지 이동
        window.location.href = "/member/login?rtnUrl=" + window.location.href;
    }
 });
 
 //초기화면 세팅
 wFuntion.init = () => {
    
    //쿠키체크 페이지 조회
    if(wUtil.isCookie("wApageNm")){
        let wApageNm = wUtil.getCookie("wApageNm");
        if(wApageNm == "undefined"){
            wUtil.removeCookie("wApageNm");
            wRoute.route("MAIN");
        }else{
            wRoute.route(wUtil.getCookie("wApageNm"));
        }
    }else{
        wRoute.route("MAIN");
    }
    
    //nav 클릭이벤트
    PUI.element.nav.addEventListener("click", event => {
        wRoute.route(event.target.dataset.pageCd);
        event.stopPropagation();
    });
    
    //main 이벤트 - click
    PUI.element.main.addEventListener("click", event => {
        wUtil.runFunctionIfNotEmpty(wFuntion.click, event);
        event.stopPropagation();
    });

    //main 이벤트 - change
    PUI.element.main.addEventListener("change", event => {
        wUtil.runFunctionIfNotEmpty(wFuntion.change, event);
        event.stopPropagation();
    });

    //main 이벤트 - keyup
    PUI.element.main.addEventListener("keyup", event => {
        wUtil.runFunctionIfNotEmpty(wFuntion.keyup, event);
        event.stopPropagation();
    });
    
    //메뉴생성
    wFuntion.createMenu = async () => {
        let menuList = await wFetch.getFetch("/api/admin/getMenuCodeList?mduTpCd=ASSETS");

        let ul, li, div, a = null;
    
        //1레벨 메뉴 생성
        ul = document.createElement("ul");
        menuList.filter(menu => menu.menuLv == 1).forEach(menu => {
            li = document.createElement("li");
            li.classList.add("dropdown");
            li.dataset.menuCd = menu.menuCd;
            if(wUtil.isNotEmpty(menu.pageCd)) li.dataset.pageCd = menu.pageCd;
    
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
            for(element of ul.childNodes){
                if(element.dataset.menuCd === menu.menuUprCd){
                    a = document.createElement("a");
                    a.dataset.menuCd = menu.menuCd;
                    a.textContent = menu.menuNm;
                    element.firstChild.nextSibling.appendChild(a);
                    if(wUtil.isNotEmpty(menu.pageCd)){
                        a.dataset.pageCd = menu.pageCd;
                    }
                }
            }
        });
    
        PUI.element.nav.appendChild(ul);
    };
    wFuntion.createMenu();
 }



