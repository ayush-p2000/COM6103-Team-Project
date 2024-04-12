const express = require('express');
const router = express.Router();

const {
    postListItem,
    getListItem,
    getModelByBrandAndType,
    getItemDetails,
    getItemQrCodeView,
    postUpdateQuote,
} = require("../controllers/marketplace/itemController");
const {getMarketplace, getMyItems} = require("../controllers/marketplace/marketplaceController");

const {upload} = require("../middlewares/multer")
const {getItemDataRetrieval} = require("../controllers/retrieval/dataRetrievalController");
const {verifyRetrievalExpiry, isValidRetrievalUser, populateRetrievalObject} = require("../middlewares/retrieval");


router.get('/marketplace/:page?', getMarketplace);

router.get('/item/:id', getItemDetails);

router.get('/item/:id/qr', getItemQrCodeView);

router.get('/item/:device_id/retrieval', populateRetrievalObject, isValidRetrievalUser, verifyRetrievalExpiry, getItemDataRetrieval);

router.get('/list-item/:id?', getListItem);

router.post('/list-item/:id?', upload.array('photos', 6), postListItem);

router.get('/getModelByBrandAndType', getModelByBrandAndType);

router.post('/item/:id', upload.none(), postUpdateQuote)


module.exports = router;