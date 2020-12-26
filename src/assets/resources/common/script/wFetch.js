/**
 * fetch 유틸화
 */
export const wFetch = {
    //세션체크
    isSession: async () => {
        let session = await this.getSession();
        if(PUI.UTL.isEmpty(session)){
            return false;
        }else{
            return session.loginYn == "Y";
        }
    },

    //세션조회
    getSession: () => {
        return new Promise((resolve, reject) => {
            fetch("/api/member/getSession", {
                method: "POST",
                mode: "same-origin",
                credentials: "include",
                headers: {
                     "Accept": "application/json",
                     "Content-Type": "application/json"
                },
                body: "{}"
            })
            .then(response => response.json())
            .then(data => resolve(data));
        });
    },

    //GET
    getFetch(url){
        return new Promise((resolve, reject) => {
            fetch(url, {
                credentials: "same-origin"
            })
            .then(response => response.json())
            .then(data => resolve(data));
        });
    },

    //POST
    postFetch(url, param){
        return new Promise((resolve, reject) => {
            fetch(url, {
                method: "POST",
                mode: "same-origin",
                credentials: "include",
                headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json"
                },
                body: JSON.stringify(param)
            })
            .then(response => response.json())
            .then(data => resolve(data));
        });
    }
}