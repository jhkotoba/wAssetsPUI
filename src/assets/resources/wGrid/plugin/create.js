/**
 * wGird 생성
 */
export const CRT = {

    //wGrid 내부상수 세팅 
    createConstant(){
        return {
            STATE: {
                SELECT: "SELECT",
                INSERT: "INSERT",
                UPDATE: "UPDATE",
                REMOVE: "REMOVE"
            },
            TR_CLS_STATE: {
                SELECT: "",
                INSERT: "wgrid-insert-tr",
                UPDATE: "wgrid-update-tr",
                REMOVE: "wgrid-remove-tr"
            },
            TAG_CLS_STATE:{
                SELECT: "",
                INSERT: "wgrid-insert-tag",
                UPDATE: "wgrid-update-tag",
                REMOVE: "wgrid-remove-tag"
            },
            EMPTY: "EMPTY",
            EVENT_LIST: ["click", "change"]
        }

    },

    //wGrid 옵션 세팅
    createOption(paramater){
        let option = {           
            grid: {
                style:{
                    width: 1000, 
                    height: 500  
                }
            },
            head: {

            },            
            row: {
                style:{                    
                    cursor: "inherit" 
                }
            },
            cell: {

            }
        }

        if(paramater.option){
            if(paramater.option.grid){
                if(paramater.option.grid.style){
                    if(paramater.option.grid.style.width){
                        option.grid.style.width = paramater.option.grid.style.width;
                    }
                    if(paramater.option.grid.style.height){
                        option.grid.style.height = paramater.option.grid.style.height;
                    }
                }
            }
            if(paramater.option.row){
                if(paramater.option.row.style){
                    if(paramater.option.row.style.cursor){
                        option.row.style.cursor = paramater.option.row.style.cursor;
                    }
                }
            }
        }

        return option;
    }
}