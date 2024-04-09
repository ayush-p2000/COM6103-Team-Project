const express = require('express');
const router = express.Router();

const {getDataRetrivalPage, getDataSetPage} = require("../controllers/retrieval/dataRetrievalController");

router.get('/retrieval', getDataRetrivalPage);

router.get('/retrieval/:id', getDataSetPage);

module.exports = router;