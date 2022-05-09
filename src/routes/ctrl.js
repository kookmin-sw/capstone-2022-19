"use strict";

const users = require("../public/data/userdata");
const database = require("./config");


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

    register: (req, res) =>{

        const response = {};
        const name = req.body.name;
        const id = req.body.id;
        const password = req.body.password;
        const confirmPassword = req.body.confirmPassword;
        const type = req.body.type;

        
    },
    
    save: (req, res) =>{
        database.ref('customer').set({name : "junseok"}, function(error) {
            if(error)
                console.error(error)
            else
                console.log("success save !!");
        });
        return res.json({firebase : true});
    },


};

module.exports = {
    output,
    process,
};