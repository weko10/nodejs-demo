const User = require("../models/user.js");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const transporter = nodemailer.createTransport(
    sendgridTransport({
        auth: {
            api_key:
                "***REMOVED***
        },
    })
);

exports.getRegister = (req, res, next) => {
    res.render("auth/user-register.ejs", {
        pageTitle: "Register",
        isAuth: req.session.isAuth,
        path: "/register",
    });
};

exports.postRegister = async (req, res, next) => {
    const { username, email, password, phone, address } = req.body;
    res.redirect("/login");
    try {
        const isUserExist = await User.findOne({ where: { email: email } });
        if (isUserExist !== null) {
            throw new Error("User already exists");
        }
        const hashPassword = await bcrypt.hash(password, 4);
        await transporter.sendMail({
            to: email,
            from: "waleyeldeen18@gmail.com",
            subject: "Sign up succeed0",
            html: "<h1>hey hey hey</h1>",
        });
        User.create({
            username: username,
            email: email,
            password: hashPassword,
            phone: phone || null,
            address: address || null,
        });
    } catch (err) {
        console.log(err);
    }
};

exports.getLogin = (req, res, next) => {
    res.render("auth/user-login.ejs", {
        pageTitle: "Login",
        isAuth: req.session.isAuth,
        path: "/login",
    });
};

exports.postLogin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email: email } });
        if (user === null) {
            throw new Error("User does not exist");
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            throw new Error("Wrong Password");
        }
        req.session.isAuth = true;
        req.session.userId = user.get("id"); //used to view data in user dashboard
    } catch (err) {
        console.log(err);
    }
    res.redirect("/");
};

exports.getReset = (req, res, next) => {
    res.render("auth/reset.ejs", {
        pageTitle: "Reset Password",
        path: "/reset",
        isAuth: req.session.isAuth,
    });
};
exports.postReset = async (req, res, next) => {
    const { email } = req.body;
    res.redirect("/login");
    try {
        const token = await crypto.randomBytes(15).toString("hex");
        const updateUser = await User.update(
            {
                token: token,
            },
            {
                where: { email: email },
            }
        );
        if (updateUser[0] === 0) {
            throw new Error("User does not exist");
        }

        const mail = await transporter.sendMail({
            from: "waleyeldeen18@gmail.com",
            to: email,
            subject: "Reset password",
            html: `<h1>Reset your password</h1>
            <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to reset</p>`,
        });
    } catch (error) {
        console.log(error);
    }
};

exports.getUserDashboard = async (req, res, next) => {
    try {
        const { username, email, phone, address } = await User.findByPk(
            req.session.userId
        );
        res.render("auth/dashboard.ejs", {
            username: username,
            email: email,
            phone: phone,
            address: address,
            pageTitle: "Dashboard",
            isAuth: req.session.isAuth,
            path: "/dashboard",
        });
    } catch (err) {
        console.log(err);
    }
};

exports.getLogout = (req, res, next) => {
    req.session.destroy();
    res.redirect("/");
};