const express = require('express');
const router = express.Router();

const {postListItem,getListItem,getModelByBrandAndType, getItemDetails, getItemQrCodeView} = require("../controllers/marketplace/itemController");
const {getMarketplace, getMyItems} = require("../controllers/marketplace/marketplaceController");

const {upload} = require("../middlewares/multer")


router.get('/marketplace/:page?', getMarketplace);


router.get('/item/:id', getItemDetails);

router.get('/item/:id/qr', getItemQrCodeView);

router.get('/list-item/:id?', getListItem);

router.post('/list-item/:id?',upload.array('photos', 6), postListItem);

router.get('/getModelByBrandAndType', getModelByBrandAndType);


module.exports = router;