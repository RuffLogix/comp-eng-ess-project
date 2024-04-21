function usernameCheck(){
    const username = document.querySelector("#username").value;
    if (username.length != 0 && username != null) {
        return true
    }else{
        alert("Please enter your username");
        return false;
    }
}

function partIdCheck() {
    const partyId = document.querySelector("#joinId").value;
    if (partyId.length !== 0 && partyId !== null) {
        return true;
    }else{
        alert('Please enter "Ped Id"')
        return false;
    }    
}

// Create a new room
document.querySelector("#createPed").addEventListener("click",() => {
    if(usernameCheck()){
        let username = document.querySelector("#username").value;
        fetch(`${backendUrl}/api/room/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
            }),
        }).then((res) => res.json()).then((data) => {
            const { roomId, status } = data;

            if (status !== "success") {
                alert("Failed to create room");
                return;
            }
            
            localStorage.setItem("roomId", roomId);
            localStorage.setItem("username", username);

            window.location.href = window.location.origin + "/frontend/custom.html";
        });
    }
});

// Join an existing room
document.querySelector("#join").addEventListener("click",() => {
    if(usernameCheck() && partIdCheck()){
        let username = document.querySelector("#username").value;
        let roomId = document.querySelector("#joinId").value;

        fetch(`${backendUrl}/api/room/join`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                roomId: roomId,
            }),
        }).then((res) => res.json()).then((data) => {
            const { roomId, status } = data;

            if (status !== "success") {
                alert("Failed to join room");
                return;
            }

            localStorage.setItem("roomId", roomId);
            localStorage.setItem("username", username);

            window.location.href = window.location.origin + "/frontend/custom.html";
        });
    }
});

addEventListener("load", () => {
    localStorage.clear();
})