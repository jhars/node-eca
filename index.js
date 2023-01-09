const express = require("express");
const app = express();

app.use(express.static('/'));

const routes = require('./api/routes'); //importing route
routes(app); //register the route

app.listen(3000, () => console.log("Example app listening on port 3000!"))

