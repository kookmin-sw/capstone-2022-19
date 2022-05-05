"use strict";

const users = require("../public/data/userdata");


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

        if (users.id.includes(id)) {
            const idx = users.id.indexOf(id);
            const response = {};
            if (users.password[idx] === password) {
                response.success = true;
                return res.json(response);
            }
        }

        response.success = false;
        response.msg = "로그인 실패";
        return res.json(response);
    }
};

module.exports = {
    output,
    process,
};