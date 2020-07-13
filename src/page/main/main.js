// //페이지 초기화
// wFuntion.init = () => {
//     return () => {
//         console.log("main.js init");
//     }
// }

wFuntion.init = () => () => {
    console.log("main.js init");
}