import { wUtil } from "/resources/common/script/wUtil.js";
import { wFetch } from "/resources/common/script/wFetch.js";
import { wRoute } from "/resources/common/script/wRoute.js";
import { wGrid } from "/resources/wGrid/wGrid.js";

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
    //각 페이지 script
    script: {}, 
    //각 페이지 init
    init: {},
    //전역 데이터 저장소
    repository: {}
};
//함수 정의
window.wFuntion = {init: function(){}};

//유틸함수 정의
window.wUtil = wUtil;

//fetch유틸 정의
window.wFetch = wFetch;

//그리드 정의
window.wGrid = wGrid;

//초기화면 세팅
//쿠키/세션체크할 예정
wRoute.route("MAIN");

//nav 클릭이벤트
wAssets.element.nav.addEventListener("click", event => {
    wRoute.route(event.target.dataset.menuCode);
    event.stopPropagation();
});

//main 이벤트 - click
wAssets.element.main.addEventListener("click", event => {
    wUtil.runFunctionIfNotEmpty(wFuntion.click, event);
    event.stopPropagation();
});
