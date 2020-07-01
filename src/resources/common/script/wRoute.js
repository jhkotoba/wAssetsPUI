export let wRoute = {
    async route(pageNm){
        //get HTML
        if(wUtil.isEmpty(wAssets.html[pageNm])){
            //HTML           
            let html = await wFetch.getHtml(pageNm);            
            if(html.resultCode === "200"){
                wAssets.html[pageNm] = html.data;
                wAssets.element.main.innerHTML = wAssets.html[pageNm];
            }else{
                console.log(html.message);
            }

            //SCRIPT           
            let script = await wFetch.getScript(pageNm);
            if(script.resultCode === "200"){
                wAssets.script[pageNm] = script.data;
                window.wFuntion = {init: function(){}}
                eval(wAssets.script[pageNm]);
                wUtil.runFunctionIfNotEmpty(wFuntion.init);
            }else{
                console.log(script.message);
            }
        }else{
            wAssets.element.main.innerHTML = wAssets.html[pageNm];
            window.wFuntion = {init: function(){}}
            eval(wAssets.script[pageNm]);
            wUtil.runFunctionIfNotEmpty(wFuntion.init);
        }
    }
}