"use strict";

const email = document.getElementById("email");
const password = document.getElementById("password");
const loginButton = document.querySelector("#button");

loginButton.addEventListener("click", login);

function login() {

    if(password.value === ""){
        alert("비밀번호를 입력해주세요");
        return;
    }

    const request = {
        email: email.value,
        password: password.value,
    };
    fetch('/login', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(request)
    })
    .then((res)=>res.json())
    .then((res)=>{
        if(res.success){
            console.log(res.userInfo.type);
            if(res.userInfo.type === "student"){
                location.href = "/user";
            }else{
                location.href = "/manager";
            }
        }else{
            alert(res.message); 
        }
    })
    .catch((e)=>{
        console.error(e);
    });
}