import { wGlobal } from "./wGlobal.js"
import { wRoute } from "./wRoute.js"
import { wFetch } from "./wFetch.js"
import { wUtil } from "./wUtil.js"

/**
 * 웹 공통 유틸
 */
window.PUI = {
    // element: {
    //     //<nav> 태그
    //     nav: [...document.getElementsByTagName("nav")][0],
    //     //<main> 태그
    //     main: [...document.getElementsByTagName("main")][0]
    // },
    // //각 페이지 html
    // html: {},
    // //각 페이지 script
    // script: {}, 
    // //각 페이지 init
    // init: {},
    // //세션정보
    // session: {},
    // //전역변수
    // RV: {},
    // //페이지내 변수 저장공간
    // V: {},
    // //페이지내 함수
    // //FN: {INIT: function(){}}
   
    //전역상수
    GV: wGlobal,    
    //route
    RUT: wRoute,
    //유틸리티
    UTL: wUtil,
    //fetch
    FT: wFetch,
    //화면 엘리먼트
    EL: {},
    //전역변수
    V:{},
    //등록함수
    FN:{}

};