"use strict";


const name = document.getElementById("name"),
    id = document.getElementById("id"),
    password = document.getElementById("password"),
    confirmPassword = document.getElementById("confirm-password"),
    type = document.getElementsByName("job"),
    registerButton = document.getElementById("button");



registerButton.addEventListener("click", register);

function register() {
    const request = {
        name: name.value,
        id: id.value,
        password: password.value,
        confirmPassword: confirmPassword.value,
        type: type.value,
    };

    console.log(request);


    // fetch('/register', {
    //     method: "POST",
    //     headers: {
    //     "Content-Type": "application/json"
    // },
    //     body: JSON.stringify(request)
    // })
    // .then((res) => res.json())
    // .then((res) => {
    //     if (res.success) {
    //         location.href = "/user";
    //     } else {
    //         alert(res.msg);
    //     }
    // })
    // .catch((e) => {
    //     console.error("error");
    // });
}