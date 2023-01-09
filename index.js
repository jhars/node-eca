const express = require("express");
const app = express();

// app.get("/", (req, res) => res.send("Hello World!"))
// app.get("/sftp", (req, res) =>
//
//     res.send("SFTP Running")
// )

app.use(express.static('/'));

const routes = require('./api/routes'); //importing route
routes(app); //register the route

app.listen(3000, () => console.log("Example app listening on port 3000!"))

