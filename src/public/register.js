"use strict";


const name = document.getElementById("name"),
    id = document.getElementById("id"),
    password = document.getElementById("password"),
    confirmPassword = document.getElementById("confirm-password"),
    typeNode = document.getElementsByName("job"),
    registerButton = document.getElementById("button");

let type = "";




registerButton.addEventListener("click", register);

function register() {

    typeNode.forEach((node)=>{
        if(node.checked){
            type = node.value;
        }
    })

    const request = {
        name: name.value,
        id: id.value,
        password: password.value,
        confirmPassword: confirmPassword.value,
        type: type,
    };

    fetch('/register', {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
    },
        body: JSON.stringify(request)
    })
    .then((res) => res.json())
    .then((res) => {
        if (res.success) {
            location.href = "/login";
        } else {
            alert(res.msg);
        }
    })
    .catch((e) => {
        console.error("error");
    });
}