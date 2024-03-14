const express = require('express');
const router = express.Router();
const multer = require("multer");

const {getItemQrCodeView, confirmQuote, rejectQuote} = require("../controllers/marketplace/itemController");

router.get('/:id', getItemQrCodeView);

router.get('/:id/generate', generateQRCode);

// Multer setup with no options in order to default to memory storage
const imgUpload = multer();
router.post('/:id/confirm', imgUpload.single("receipt_image"), confirmQuote);

router.post('/:id/reject', rejectQuote);

module.exports = router;