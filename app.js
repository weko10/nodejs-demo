const path = require("path");
const dotenv = require("dotenv").config();
const express = require("express");
const app = express();
//const sequelize = require("./util/database");
const session = require("express-session");
const store = require("./util/session");

//config express
app.set("views", "views");
app.set("template engine", "ejs");

app.use(
    session({
        secret: "shhhh",
        resave: false,
        saveUninitialized: false,
        store: store,
    })
);

(async () => {
    try {
        // await sequelize.authenticate();
        // await sequelize.sync();
        app.listen(3000, console.log("app is listening on http://localhost:3000/"));
    } catch (err) {
        console.log(err);
    }
})();

const errorController = require("./controllers/error.js");

const admin = require(path.join(__dirname, "routes", "admin.js"));
const auth = require(path.join(__dirname, "routes", "auth.js"));
const shop = require(path.join(__dirname, "routes", "shop.js"));
const { usersApi, itemsApi, cartsApi, ordersApi } = require(path.join(
    __dirname,
    "routes",
    "api",
    "index.js"
));

//the middleware
app.use(express.static(path.join(__dirname, "public"))); //serve public
app.use(express.urlencoded({ extended: false })); //body parser for urlencoded
app.use(express.json()); //body parser for json

//  use routers
app.use(shop);
app.use(auth);
app.use("/api/users", usersApi);
app.use("/api/items", itemsApi);
app.use("/api/carts", cartsApi);
app.use("/api/orders", ordersApi);
app.use("/admin", admin);
app.use(errorController);
