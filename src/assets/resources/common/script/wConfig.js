import { wFetch } from "./wFetch.js"
import { wUtil } from "./wUtil.js"

/**
 * 웹 공통 유틸
 */
window.PUI = {
    //유틸리티
    UTL: wUtil,
    //fetch
    FT: wFetch,
    //정의변수
    GV: {},
    EL: {
        BODY: document.getElementsByTagName("body")[0],
        MAIN: document.getElementsByTagName("main")[0]
    },
    //전역변수
    V:{},
    //정의함수
    GFN:{
        BLIND:{
            ON: () => document.querySelector(".blind").classList.add("on"),
            OFF: () => document.querySelector(".blind").classList.remove("on")
        }
    },
    //등록함수
    FN:{},
    //공통이벤트
    EV:{}
};

//클릭이벤트
PUI.EL.MAIN.addEventListener("click", event => PUI.UTL.runFunctionIfNotEmpty(PUI.EV.CLICK, event));
//더블클릭이벤트
PUI.EL.MAIN.addEventListener("dblclick", event => PUI.UTL.runFunctionIfNotEmpty(PUI.EV.DBCLICK, event));
//변경이벤트
PUI.EL.MAIN.addEventListener("change", event => PUI.UTL.runFunctionIfNotEmpty(PUI.EV.CHANGE, event));
//키업이벤트
PUI.EL.MAIN.addEventListener("keyup", event => PUI.UTL.runFunctionIfNotEmpty(PUI.EV.KEYUP, event));
//초기실행
window.addEventListener('DOMContentLoaded', () => PUI.UTL.runFunctionIfNotEmpty(PUI.FN.INIT));
