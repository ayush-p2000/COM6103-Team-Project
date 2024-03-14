const express = require('express');
const router = express.Router();
const multer = require("multer");

const {getItemQrCode, confirmQuote, rejectQuote} = require("../controllers/marketplace/itemController");

router.get('/:id', getItemQrCode);

const imgUpload = multer({dest: 'temp/images/receipts/'});
router.post('/:id/confirm', imgUpload.single("receipt_image"), confirmQuote);

router.post('/:id/reject', rejectQuote);

module.exports = router;