//wAssetsPUI 전역 저장소
window.PUI = {
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
    //세션정보
    session: {},
    //전역 데이터 저장소
    repository: {},
    contextPath: contextPath
};
//함수 정의
window.wFuntion = {init: function(){}};