const express = require('express');
const blogger_route = express();
const blogger_controller = require('../controllers/bloggerController');

blogger_route.get("/", blogger_controller.xmlResponse)
blogger_route.get("/getauth", blogger_controller.getAuth)
blogger_route.get("/setauth", blogger_controller.setAuth)
blogger_route.post("/post", blogger_controller.postData)
blogger_route.post("/labelpost", blogger_controller.autoPostAll)
// blogger_route.post("/shoudashu", blogger_controller.getShoudashuData)
// blogger_route.get("/translate", blogger_controller.translateL)

module.exports = blogger_route;