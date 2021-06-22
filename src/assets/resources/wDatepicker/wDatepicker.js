/**
 * wDatepicker
 * @author JeHoon 
 * @version 0.3.0
 */
class wDatepicker {
    constructor(option){

        this.CONST = {
            // attrName: {
            //     day: "_wcalenderDay"
            // },
            char: {
                week: ["일", "월", "화", "수", "목", "금", "토"]
            }
        };

        //엘리멘트 생성
        this.element = {};
        this.element.calender = {};

        //백그라운드
        this.element.background = document.createElement("div");
        this.element.background.classList.add("wdatepicker");
        this.element.background.setAttribute("name", "wDatepicker");

        //달력 배경
        //this.element.calender = document.createElement("div");
        //this.element.calender.classList.add("wdatepicker-calender");

        //데이터
        this._selectedDate = null;

        //콜백
        this._callback = {};

        this._isOpen = false;

        //이벤트 생성
        this.element.background.addEventListener("click", event => {
            let day = event.target.dataset.day;
            let type = event.target.dataset.type;
            let element = this.element.background;
            console.log("day:", day);
            console.log("type:", type);

            switch(type){
            
            case "inner" :
                while(element.hasChildNodes()){
                    element.removeChild(element.firstChild);
                }
                if(typeof this._callback.selected == "function"){
                    this._callback.selected(day);
                }
                this._isOpen = false;
                break;
            case "outer" : 
            case "arrow" :
                while(element.hasChildNodes()){
                    element.removeChild(element.firstChild);
                }   
                let calender = this._createCalender(new Date(day));
                element.appendChild(calender);

                let body = document.getElementsByTagName("body")[0];
                body.appendChild(element);
                break;
            default:
                break;
            }

            event.stopPropagation();
        }, false);
    }

    open(option){

        console.log("option:", option);


        if(this._isOpen) return;

        //option.event.pageX
        //option.event.pageY
       // pageX: 1058
       // pageY: 235      
       // div.style.top = (window.pageYOffset + element.getBoundingClientRect().top - 42) + "px";
		//div.style.left = (window.pageYOffset + element.getBoundingClientRect().left) + "px";

        //offsetX
        //offsetY

        let calender = null;
        let element = this.element.background;

        //option.event.target.getBoundingClientRect().top

        element.style.top = (window.pageYOffset + option.event.target.getBoundingClientRect().top + 30) + "px";
        element.style.left = (window.pageYOffset + option.event.target.getBoundingClientRect().left - 250) + "px";

        //문자열로 받은경우
        if(typeof option === "string"){
            this._selectedDate = new Date(date);
        }else{
            this._selectedDate = new Date();
        }
        calender = this._createCalender(this._selectedDate, option.event);

        element.appendChild(calender);
        let body = document.getElementsByTagName("body")[0];
        body.appendChild(element);

        this._isOpen = true;

        //this.element.background.classList.add("on");

        if(option != null){
            if(typeof option.opened == "function"){
                option.opened();
            }
            if(typeof option.selected == "function"){
                this._callback.selected = option.selected;
            }
        }
    }

    //해당 년, 월의 달력생성
    //이전에 생성했으면 불러오고 신규면 생성
    _createCalender(date){
        //오늘 날짜
        let todate = new Date();
        let today = todate.getDate();

        //선택한 날짜의 년도
        let year = date.getFullYear();
        //선택한 날짜의 월
        let month = date.getMonth();

        //기존 생성한 달력 엘리먼트가 있으면 가져오기
        let calender = this._getCreatedCalender(year, month);
        if(calender == null || calender == undefined){
            console.log("create");

            //날짜변수
            let week, text, day = null;
            let loofCount = 0;
            let dayNumber = 1;
            let nextStartDay = 1;

            //선택한 달의 마지막 날짜
            let lastDay = new Date(year, month+1, 0).getDate();
            //선택한 달의 이전달의 마지막 날짜
            let prevLastDay = new Date(month > 0 ? year : year-1, month > 0 ? month : 0, 0).getDate();
            //선택한 달의 첫일 시작요일
            let startWeek = new Date(year, month, 1, 0,0,0,0).getDay();
            //선택한 달의 첫시작일
            let prevStartDay = prevLastDay - startWeek;

            //달력 전체영역
            let calenderArea = document.createElement("div");
            calenderArea.classList.add("wdatepicker-area");

            //달력 상단영역
            let calenderHeader = document.createElement("div");
            calenderHeader.classList.add("wdatepicker-header");
            
            let yearMonth = document.createElement("div");

            let prevArrow = document.createElement("div");
            prevArrow.textContent = "<";
            prevArrow.dataset.day = this._convertDate(month == 0 ? year - 1 : year, month == 0 ? 12 : month, 1);
            prevArrow.classList.add("arrow");
            prevArrow.dataset.type = "arrow";

            let nextArrow = document.createElement("div");
            nextArrow.textContent = ">";
            nextArrow.dataset.day = this._convertDate(month == 11 ? year + 1 : year, month == 11 ? 1 : month + 2, 1);
            nextArrow.classList.add("arrow");
            nextArrow.dataset.type = "arrow";

            yearMonth.textContent = year + "년 " + (month + 1) + "월";
            yearMonth.classList.add("year-month");
            calenderHeader.appendChild(prevArrow);
            calenderHeader.appendChild(yearMonth);
            calenderHeader.appendChild(nextArrow);
            calenderArea.appendChild(calenderHeader);

            //달력 중단영역
            let calenderBody = document.createElement("div");
            calenderBody.classList.add("wdatepicker-body");

            //달력 주 영역
            week = document.createElement("div");
            this.CONST.char.week.forEach(weekText => {
                text = document.createElement("div");
                text.classList.add("week-text");
                text.textContent = weekText;
                week.appendChild(text);
            });
            calenderBody.appendChild(week);
            
            //달력생성 (주 단위)
            for(let i=0; i<6; i++){
                week = document.createElement("div");

                //달력생성 (일 단위)
                for(let j=0; j<7; j++){
                    day = document.createElement("div");
                    //day.classList.add("wdatepicker-day");
                    //day.classList.add("wday");
                    
                    //이전달
                    if(prevStartDay < prevLastDay){
                        day.textContent = prevStartDay;
                        day.classList.add("outer");
                        day.dataset.type = "outer";
                        day.dataset.day = this._convertDate(month == 0 ? year - 1 : year, month == 0 ? 11 : month, prevStartDay);
                        prevStartDay++;
                    //이번달
                    }else if(loofCount >= startWeek && dayNumber <= lastDay){
                        day.textContent = dayNumber;
                        day.dataset.day = this._convertDate(year, month + 1, dayNumber);
                        day.dataset.type = "inner";
                        dayNumber++;
                    //다음달
                    }else{
                        day.textContent = nextStartDay;
                        day.classList.add("outer");
                        day.dataset.type = "outer";
                        day.dataset.day = this._convertDate(month == 11 ? year + 1 : year, month == 11 ? 1 : month + 2, nextStartDay);
                        nextStartDay++;
                    }
                    loofCount++;
                    week.appendChild(day);
                }
                calenderBody.appendChild(week);
            }
            calenderArea.appendChild(calenderBody);

            //생성한 달력 엘리먼트 저장
            if(!this.element.calender[year]){
                this.element.calender[year] = {};
            }
            this.element.calender[year][month] = calenderArea;
            
            return calenderArea;
        }else{
            console.log("recycle");
            return calender;
        }
    }

    /**
     * 년도, 월, 일 데이터를 받아서 YYYY-MM-DD로 반환(내부함수)
     * @param {*} year  년도
     * @param {*} month 월
     * @param {*} day   일
     */
    _convertDate(year, month, day){
        //YYYY-MM-DD 형식으로 변환해서 반환
        return String(year) + "-" + (month < 10 ? "0" + month : month) + "-" + (day < 10 ? "0" + day : day);
    }
    
    /**
     * 기존 생성한 달력 엘리먼트가 있으면 가져오기(내부함수)
     * @param {*} year  년도
     * @param {*} month 월
     * @returns 
     */
    _getCreatedCalender(year, month){
        //년도 찾기
        if(this.element.calender[year]){
            //월 찾기
            if(this.element.calender[year][month]){
                //저장된 년도, 월 엘리멘트 반환
                return this.element.calender[year][month];
            }else{
                return null;
            }
        }else{
            return null;
        }
    }

    /**
     * 달력 닫기 함수
     * @param {*} object.callback 달력 종료 후 콜백함수가 있으면 함수 호출
     */
    close(object){

        //달력 엘리멘트 삭제
        let element = document.getElementsByName("wDatepicker")[0];
        if(element != null || element != undefined){
            element.remove();
        }

        //콜백함수 체크, 존재시 호출
        if(object != null && typeof object.callback == "function"){
            object.callback(result);
        }
    }
}
window.wDatepicker = wDatepicker;