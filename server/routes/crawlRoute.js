const express = require('express');
const crawl_route = express();
const crawl_controller = require('../controllers/crawlController');

crawl_route.post("/", crawl_controller.getData)
crawl_route.post("/shoudashu", crawl_controller.getShoudashuData)
crawl_route.post("/ffxs8", crawl_controller.getFfxs8Data)
crawl_route.post("/mtl", crawl_controller.getMtlData)
crawl_route.post("/mtlshoudashu", crawl_controller.getMtlShoudashuData)
crawl_route.post("/mtlffxs8", crawl_controller.getMtlFfxs8Data)
crawl_route.get("/translate", crawl_controller.translateL)

module.exports = crawl_route;