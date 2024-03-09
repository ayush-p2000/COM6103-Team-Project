const express = require('express');
const router = express.Router();

const {getListItem, getItemDetails, getItemQrCode} = require("../controllers/marketplace/itemController");
const {getMarketplace, getMyItems} = require("../controllers/marketplace/marketplaceController");

router.get('/marketplace', getMarketplace);

router.get('/item/:id', getItemDetails);

router.get('/item/:id/qr', getItemQrCode);

router.get('/list-item/:id?', getListItem);

module.exports = router;