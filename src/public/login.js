"use strict";

const id = document.getElementById("id");
const password = document.getElementById("password");
const loginButton = document.querySelector("#button");

loginButton.addEventListener("click", login);

function login() {
    const request = {
        id: id.value,
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
            location.href = "/user";
        }else{
            alert(res.msg); 
        }
    })
    .catch((e)=>{
        console.error("error");
    });
}