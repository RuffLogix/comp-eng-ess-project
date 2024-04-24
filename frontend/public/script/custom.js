document.querySelector("#abandon").addEventListener("click",() => {
    window.location.href = window.location.origin + "/index.html";
})

document.querySelector("#start").addEventListener("click",() => {
    const checkboxes = document.querySelectorAll("input[type=checkbox]");
    if(checkboxes[0].checked && checkboxes[1].checked){
        fetch(`${backendUrl}/api/room/start`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                roomId: localStorage.getItem("roomId"),
            }),
        }).then((res) => res.json()).then((data) => {
            const { status } = data;
    
            if (status !== "success") {
                alert("Failed to start room");
                return;
            }
        });
        window.location.href = window.location.origin + "/game.html";
    }else{
        alert("Players are not ready");
    }
})

document.querySelector(".btn#copy").addEventListener("click",() => {
    navigator.clipboard.writeText(localStorage.getItem("roomId"));
    alert("Party link copied!")
})

document.getElementById("player-checkbox").addEventListener("change", (e) => {
    fetch(`${backendUrl}/api/room/ready`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: localStorage.getItem("username"),
            roomId: localStorage.getItem("roomId"),
        }),
    }).then((res) => res.json()).then((data) => {
        const { status } = data;

        if (status !== "success") {
            alert("Failed to ready room");
            return;
        }
    });
});

function otherPlayerReady() {
    fetch(`${backendUrl}/api/room/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    }).then((res) => res.json()).then((data) => {
        const roomId = localStorage.getItem("roomId");
        const players = data.find((room) => room.id === roomId).players;

        if (data.find((room) => room.id === roomId).status) {
            window.location.href = window.location.origin + "/game.html";
        }

        if (players.length < 2) {
            return;
        }

        const otherPlayer = players.find((player) => player.username !== localStorage.getItem("username"));

        document.querySelector("#friend-checkbox").checked = otherPlayer.ready; 
    });
}

setInterval(otherPlayerReady, 1000);

document.getElementById("abandon-ped").addEventListener("click", () => {
    fetch(`${backendUrl}/api/room/leave`, { 
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: localStorage.getItem("username"),
            roomId: localStorage.getItem("roomId"),
        }),
    }).then((res) => res.json()).then((data) => {
        const { status } = data;

        if (status !== "success") {
            alert("Failed to leave room");
            return;
        }

        window.location.href = window.location.origin + "/index.html";
    });
})

addEventListener("load", () => {
    if (localStorage.getItem("roomId") == null || localStorage.getItem("username") == null) {
        window.location.href = window.location.origin + "/index.html";
    }

    document.querySelector("#text-roomId").innerHTML = localStorage.getItem("roomId");
    document.querySelector("#text-username").innerHTML = localStorage.getItem("username");
})