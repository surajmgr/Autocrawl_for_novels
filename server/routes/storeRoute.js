const express = require('express');
const store_route = express();
const store_controller = require('../controllers/storeController');

store_route.post("/", store_controller.storeData)
store_route.get("/all", store_controller.getAllData)
store_route.get("/label", store_controller.getLabelData)
store_route.get("/single/:id", store_controller.getSingleData)
store_route.put("/update/:id", store_controller.updateData)

module.exports = store_route;