"use strict";

const users = require("../public/data/userdata");
const config = require("./config");
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');
const { doc, setDoc } = require('firebase/firestore');


const firebase = config.firebase;
const database = config.database;
const auth = getAuth();


const output = {

    home: (req, res) => {
        res.render("login");
    },
    login: (req, res) => {
        res.render("login");
    },
    user: (req, res) => {
        res.render("user");
    },
    manager: (req, res) => {
        res.render("manager");
    },
    register: (req, res) => {
        res.render("register")
    }
};


const process = {
    login: (req, res) => {
        const id = req.body.id;
        const password = req.body.password;
        const response = {};

        if (users.id.includes(id)) {
            const idx = users.id.indexOf(id);
            if (users.password[idx] === password) {
                response.success = true;
                return res.json(response);
            }
        }

        response.success = false;
        response.msg = "로그인 실패";
        return res.json(response);
    },

    register: (req, res) => {

        const response = {};
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        const type = req.body.type;


        createUserWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                const currentUser = {
                    id: userCredential.user.uid,
                    email: email,
                    name: name,
                    type: type,
                }
                


                try {
                    await setDoc(doc(database, "users", userCredential.user.uid), {
                        name: name,
                        email: email,
                        type: type
                    });
                  } catch (e) {
                    console.error("Error adding document: ", e);
                  }


                // DB유저 정보 저장
                // database.collection('users').doc(currentUser.id).set({
                //     name: currentUser.name,
                //     email: currentUser.email,
                //     type: currentUser.type
                // }).then(function () {
                //     console.log('fbDB에 유저정보 추가 성공');
                // }).catch(function (error) {
                //     console.log(error.code);
                // })

                response.success = true;
                console.log(response);
                return res.json(response);

            })
            .catch(function (error) {
                switch (error.code) {
                    case "auth/email-already-in-use":
                        response.success = false;
                        response.msg = "이미 사용중인 이메일 입니다.";
                        return res.json(response);
                        break;
                    case "auth/invalid-email":
                        response.success = false;
                        response.msg = "유효하지 않은 메일입니다.";
                        return res.json(response);
                        break;
                    case "auth/operation-not-allowed":
                        response.success = false;
                        response.msg = "이메일 가입이 중지되었습니다.";
                        return res.json(response);
                        break;
                    case "auth/weak-password":
                        response.success = false;
                        response.msg = "비밀번호를 6자리 이상 필요합니다.";
                        return res.json(response);
                        break;
                }
            })


    },

    // save: (req, res) =>{
    //     database.ref('customer').set({name : "junseok"}, function(error) {
    //         if(error)
    //             console.error(error)
    //         else
    //             console.log("success save !!");
    //     });
    //     return res.json({firebase : true});
    // },


};

module.exports = {
    output,
    process,
};