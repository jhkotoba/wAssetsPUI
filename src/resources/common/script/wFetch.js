export let wFetch = {

    getHtml(pageNm){
        return new Promise((resolve, reject) => {
            fetch("/p/wAssets/getHtml?html=" + pageNm)
                .then(response => response.text())
                .then(html => resolve({data:html, resultCode:"200", message:"success"}))
                .catch(error => resolve({data:null, retrunCode:"500", message:error}));
        });
    },
    getScript(pageNm){
        return new Promise((resolve, reject) => {
            fetch("/p/wAssets/getScript?script=" + pageNm)
                .then(response => response.text())
                .then(script => resolve({data:script, resultCode:"200", message:"success"}))
                .catch(error => resolve({data:null, retrunCode:"500", message:error}));
        });
    }
}