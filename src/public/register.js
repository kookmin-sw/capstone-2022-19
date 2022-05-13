"use strict";


const name = document.getElementById("name"),
    email = document.getElementById("email"),
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

    if(password.value != confirmPassword.value){

        console.log(password.value);
        console.log(confirmPassword.value);
        alert("비밀번호가 일치하지 않습니다.");
        return;

    }else{
        const request = {
            name: name.value,
            email: email.value,
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
            console.log(res.success);
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

    
}