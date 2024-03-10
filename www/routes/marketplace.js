const express = require('express');
const router = express.Router();

const {postListItem,getListItem,getModelByBrandAndType, getItemDetails, getItemQrCode} = require("../controllers/marketplace/itemController");
const {getMarketplace, getMyItems} = require("../controllers/marketplace/marketplaceController");

router.get('/marketplace', getMarketplace);

router.get('/item/:id', getItemDetails);

router.get('/item/:id/qr', getItemQrCode);

router.get('/list-item/:id?', getListItem);
router.post('/list-item/:id?', postListItem);
router.get('/getModelByBrandAndType', getModelByBrandAndType);


router.get('/my-items', getMyItems);

module.exports = router;