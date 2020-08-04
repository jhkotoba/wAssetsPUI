window.wRoute = {
    async route(pageNm){

        //main 태그에 값 입력
        wAssets.element.main.dataset.pageNm = pageNm;
        wUtil.setCookie("pageNm", pageNm);

        //get HTML
        if(wUtil.isEmpty(wAssets.html[pageNm])){
            //HTML 조회
            let html = await wFetch.getHtml(pageNm);            
            if(html.resultCode === "200"){                
                wAssets.html[pageNm] = html.data; //HTML 저장                
                wAssets.element.main.innerHTML = wAssets.html[pageNm]; //HTML 적용
            }else{
                console.log(html.message);
            }

            //SCRIPT 조회
            let script = await wFetch.getScript(pageNm);
            if(script.resultCode === "200"){                
                wAssets.script[pageNm] = script.data; //스크립트 저장                
                Function(wAssets.script[pageNm]); //스크립트
                wAssets.init[pageNm] = wFuntion.init; //init 등록함수 저장
            }else{
                console.log(script.message);
            }
        }else{            
            wAssets.element.main.innerHTML = wAssets.html[pageNm]; //기존 HTML 활용     
            Function(wAssets.script[pageNm]); //스크립트
        }
        wUtil.runFunctionIfNotEmpty(wAssets.init[pageNm])();       
    }
}