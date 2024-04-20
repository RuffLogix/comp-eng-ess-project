function usernameCheck(){
    var username = document.querySelector("#username").value;
    if(username.length != 0 && username != null){
        // Redirect to another page within the same directory
        return true
    }else{
        alert("Please enter your username");
        return false;
    }
}
function partIdCheck(){
    const partyId = document.querySelector("#joinId").value;
            if(partyId.length != 0 & partyId != null){
                // go to party Id session
                console.log("Joining Session ( under developing )")
                // window.location.href = window.location.origin + "/frontend/custom.html";
            }else{
                alert('Please enter "Ped Id"')
            }
}
document.querySelector("#createPed").addEventListener("click",() => {
    if(usernameCheck()){
        window.location.href = window.location.origin + "/frontend/custom.html";
    }
});
document.querySelector("#join").addEventListener("click",() => {
    if(usernameCheck()){
        partIdCheck();
    }
})
// console.log(username.length)