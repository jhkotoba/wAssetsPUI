window.wFetch = {
    getHtml(wApageNm){
        return new Promise((resolve, reject) => {
            fetch(PUI.contextPath + "/assets/getHtml?html=" + wApageNm)
                .then(response => response.text())
                .then(html => resolve({data:html, resultCode:"200", message:"success"}))
                .catch(error => resolve({data:null, retrunCode:"500", message:error}));
        });
    },
    getScript(wApageNm){
        return new Promise((resolve, reject) => {
            fetch(PUI.contextPath + "/assets/getScript?script=" + wApageNm)
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
    },

    getSession(){
        return new Promise((resolve, reject) => {
            fetch("/api/member/getSession", {
                method: "POST",
                mode: "same-origin",
                credentials: "include",
                headers: {
                     "Accept": "application/json",
                     "Content-Type": "application/json"
                },
                body: JSON.stringify({})
            })
            .then(response => response.json())
            .then(data => resolve(data));
        });
    }
}