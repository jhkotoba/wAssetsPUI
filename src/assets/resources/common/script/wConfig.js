import { wGlobal } from "./wGlobal.js"
import { wFetch } from "./wFetch.js"
import { wUtil } from "./wUtil.js"

/**
 * 웹 공통 유틸
 */
window.PUI = {
    //전역상수
    GV: wGlobal,
    //유틸리티
    UTL: wUtil,
    //fetch
    FT: wFetch,
    //화면 엘리먼트
    EL: {},
    //전역변수
    V:{},
    //등록함수
    FN:{},
    //공통이벤트
    EV:{}
};

//클릭이벤트
PUI.GV.MAIN.addEventListener("click", event => PUI.UTL.runFunctionIfNotEmpty(PUI.EV.CLICK, event));
//더블클릭이벤트
PUI.GV.MAIN.addEventListener("dblclick", event => PUI.UTL.runFunctionIfNotEmpty(PUI.EV.DBCLICK, event));
//변경이벤트
PUI.GV.MAIN.addEventListener("change", event => PUI.UTL.runFunctionIfNotEmpty(PUI.EV.CHANGE, event));
//키업이벤트
PUI.GV.MAIN.addEventListener("keyup", event => PUI.UTL.runFunctionIfNotEmpty(PUI.EV.KEYUP, event));
//초기실행
window.addEventListener('DOMContentLoaded', () => PUI.UTL.runFunctionIfNotEmpty(PUI.FN.INIT));
