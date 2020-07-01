import { wUtil } from "/resources/common/script/wUtil.js";
import { wFetch } from "/resources/common/script/wFetch.js";
import { wRoute } from "/resources/common/script/wRoute.js";

//wAssetsPUI 전역 저장소
window.wAssets = {
    element: {
        //<nav> 태그
        nav: [...document.getElementsByTagName("nav")][0],
        //<main> 태그
        main: [...document.getElementsByTagName("main")][0],
    },    
    //각 페이지 html
    html: {},
    script: {},
    //전역 데이터 저장소
    repository: {}
};
//함수 정의
window.wFuntion = {init: function(){}};
//유틸함수 정의
window.wUtil = wUtil;
window.wFetch = wFetch;

//초기화면 세팅
wRoute.route("MAIN");

//nav 클릭이벤트
wAssets.element.nav.addEventListener("click", event => {
    wRoute.route(event.target.dataset.menuCode);
});