window.wFetch = {
    getHtml(pageNm){
        return new Promise((resolve, reject) => {
            fetch(wAssets.contextPath + "/wAssets/getHtml?html=" + pageNm)
                .then(response => response.text())
                .then(html => resolve({data:html, resultCode:"200", message:"success"}))
                .catch(error => resolve({data:null, retrunCode:"500", message:error}));
        });
    },
    getScript(pageNm){
        return new Promise((resolve, reject) => {            
            fetch(wAssets.contextPath + "/wAssets/getScript?script=" + pageNm)
                .then(response => response.text())
                .then(script => resolve({data:script, resultCode:"200", message:"success"}))
                .catch(error => resolve({data:null, retrunCode:"500", message:error}));
        });
    },

    getFetch(url){
        return new Promise((resolve, reject) => {
            fetch(url)
                .then(response => response.json())
                .then(data => resolve(data));
        });
    }
}