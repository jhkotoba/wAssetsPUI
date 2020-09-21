window.wRoute = {
    async route(wApageNm){       

        //main 태그에 값 입력
        PUI.element.main.dataset.wApageNm = wApageNm;
        wUtil.setCookie("wApageNm", wApageNm);

        //get HTML
        if(wUtil.isEmpty(PUI.html[wApageNm])){
            //HTML 조회
            let html = await wFetch.getHtml(wApageNm);            
            if(html.resultCode === "200"){                
                PUI.html[wApageNm] = html.data; //HTML 저장                
                PUI.element.main.innerHTML = PUI.html[wApageNm]; //HTML 적용
            }else{
                console.log(html.message);
            }

            //SCRIPT 조회
            let script = await wFetch.getScript(wApageNm);
            if(script.resultCode === "200"){
                wFuntion.init = {};
                PUI.script[wApageNm] = script.data; //스크립트 저장
                window.eval(PUI.script[wApageNm]); //스크립트
                PUI.init[wApageNm] = wFuntion.init; //init 등록함수 저장
            }else{
                console.log(script.message);
            }
        }else{            
            PUI.element.main.innerHTML = PUI.html[wApageNm]; //기존 HTML 활용     
            window.eval(PUI.script[wApageNm]); //스크립트
        }
        wUtil.runFunctionIfNotEmpty(PUI.init[wApageNm]); 
    }
}