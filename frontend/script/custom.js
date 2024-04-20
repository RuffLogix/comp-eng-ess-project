document.querySelector("#abandon").addEventListener("click",() => {
    window.location.href = window.location.origin + "/frontend/index.html";
})
document.querySelector("#start").addEventListener("click",() => {
    const checkboxes = document.querySelectorAll("input[type=checkbox]");
    if(checkboxes[0].checked && checkboxes[1].checked){
        //Enter the game idk what to do
        console.log("Entering the game...");
    }else{
        alert("Players are not ready");
    }
})
document.querySelector(".btn#copy").addEventListener("click",() => {
    navigator.clipboard.writeText(window.location.href);
    alert("Party link copied!")
})
// console.log(document.querySelector("input[type=checkbox]"))