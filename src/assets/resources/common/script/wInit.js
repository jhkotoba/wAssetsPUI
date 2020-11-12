//wAssetsPUI 전역 저장소
window.PUI = {
    element: {
        //<nav> 태그
        nav: [...document.getElementsByTagName("nav")][0],
        //<main> 태그
        main: [...document.getElementsByTagName("main")][0]
    },
    //각 페이지 html
    html: {},
    //각 페이지 script
    script: {}, 
    //각 페이지 init
    init: {},
    //세션정보
    session: {},   
    contextPath: contextPath,
    //전역변수
    RV: {},
    //페이지내 변수 저장공간
    V: {},
    //페이지내 함수
    FN: {INIT: function(){}}
    
};