const express = require('express');
const router = express.Router();

const {getListItem, getItemDetails, getItemQrCodeView} = require("../controllers/marketplace/itemController");
const {getMarketplace, getMyItems} = require("../controllers/marketplace/marketplaceController");

router.get('/marketplace/:page?', getMarketplace);

router.get('/item/:id', getItemDetails);

router.get('/item/:id/qr', getItemQrCodeView);

router.get('/list-item/:id?', getListItem);

module.exports = router;