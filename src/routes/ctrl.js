"use strict";

const config = require("./config");
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require('firebase/auth');
const { collection, doc, setDoc, query, where, getDocs } = require('firebase/firestore');


const firebase = config.firebase;
const database = config.database;
const auth = getAuth();


const output = {

    home: (req, res) => {
        res.redirect("login");
    },
    
    login: (req, res) => {
        if (req.session.isLogined === undefined) {
            res.render("login");
        } else if (req.session.isLogined) {
            const userInfo = {
                name: req.session.userInfo.name,
                type: req.session.userInfo.type
            }
            if (req.session.userInfo.type === "student") {
                res.render("user", { userInfo: userInfo, error: false });
            } else {
                res.render("manager", { userInfo: userInfo, error: false });
            }
        }
    },
    user: (req, res) => {
        if (req.session.isLogined === true) {
            const userInfo = {
                name: req.session.userInfo.name,
                type: req.session.userInfo.type
            }
            if (req.session.userInfo.type === "student") {
                res.render("user", { userInfo: userInfo, error: false });
            } else if (req.session.userInfo.type === "professor") {
                res.render("manager", { userInfo: userInfo, error: false })
            } else {
                res.render("login");
            }
        } else {
            res.render("login");
        }

    },
    manager: (req, res) => {
        if (req.session.isLogined === true) {
            const userInfo = {
                name: req.session.userInfo.name,
                type: req.session.userInfo.type
            }
            if (req.session.userInfo.type === "professor") {
                res.render("manager", { userInfo: userInfo, error: false });
            } else if (req.session.userInfo.type === "student") {
                res.render("user", { userInfo: userInfo, error: false })
            } else {
                res.render("login");
            }
        } else {
            res.render("login");
        }
    },

    register: (req, res) => {
        res.render("register");
    },

    exit: (req, res) =>{
        req.session.destroy(function(err){});
        res.render("endpage");
    },

    eyeTracking: (req, res) => {
        res.render("eyeTracking");
    }
};


const process = {

    login: (req, res) => {
        const email = req.body.email;
        const password = req.body.password;
        const response = {};

        signInWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                console.log("login user email is : " + email);

                let userDB = collection(database, 'users');
                const q = query(userDB, where("email", "==", email));

                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    if (doc.empty) {
                        response.success = false;
                        response.message = "저장된 정보가 없습니다";
                    } else {

                        const name = doc.data().name;
                        const email = doc.data().email;
                        const type = doc.data().type;

                        const userInfo = {
                            name: name,
                            email: email,
                            type: type,
                        };

                        response.success = true;
                        response.userInfo = userInfo;

                        req.session.isLogined = true;
                        req.session.userInfo = userInfo;

                    }

                    return res.json(response);

                })
                    .catch((error) => {
                        console.log('Error getting documents', error);
                    });

            })
            .catch((error) => {
                switch (error.code) {
                    case "auth/invalid-email":
                        response.success = false;
                        response.message = '유효하지 않은 메일입니다'
                        return res.json(response);
                        break;
                    case "auth/user-disabled":
                        response.success = false;
                        response.message = '사용이 정지된 유저입니다'
                        return res.json(response);
                        break;
                    case "auth/user-not-found":
                        response.success = false;
                        response.message = '사용자를 찾을 수 없습니다'
                        return res.json(response);
                        break;
                    case "auth/wrong-password":
                        response.success = false;
                        response.message = '잘못된 패스워드 입니다'
                        return res.json(response);
                        break;
                }

            })
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

                //DB유저 정보 저장
                try {
                    await setDoc(doc(database, "users", userCredential.user.uid), {
                        name: name,
                        email: email,
                        type: type
                    });
                } catch (e) {
                    console.error("Error adding document: ", e);
                }

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
                        response.msg = "비밀번호를 6자리 이상 입력해주세요.";
                        return res.json(response);
                        break;
                }
            })


    },

};

module.exports = {
    output,
    process,
};