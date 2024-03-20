const express = require('express');
const router = express.Router();

const {postListItem,getListItem,getModelByBrandAndType, getItemDetails, getItemQrCode, updateQuote} = require("../controllers/marketplace/itemController");
const {getMarketplace, getMyItems} = require("../controllers/marketplace/marketplaceController");

/**
 * Set Up multer Middle Ware To Handle Photos Storage
 * @author Zhicong Jiang <zjiang34@sheffield.ac.uk>
 */
const multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/upload/');
    },
    filename: function (req, file, cb) {
        var original = file.originalname;
        var file_extension = original.split(".");
        // Make the file name the date + the file extension
        filename =  Date.now() + '.' + file_extension[file_extension.length-1];
        cb(null, filename);
    }
});
var upload = multer({ storage: storage });



router.get('/marketplace/:page?', getMarketplace);


router.get('/item/:id', getItemDetails);

router.get('/item/:id/qr', getItemQrCode);

router.get('/list-item/:id?', getListItem);
router.post('/list-item/:id?',upload.array('photos', 6), postListItem);
router.get('/getModelByBrandAndType', getModelByBrandAndType);
router.post('/item/:id',upload.none(), updateQuote)


module.exports = router;