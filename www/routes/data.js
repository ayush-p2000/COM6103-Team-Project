const express = require('express');
const router = express.Router();

const {getDataRetrivalPage, getDataSetPage} = require("../controllers/retrieval/dataRetrievalController");

router.get('/data', getDataRetrivalPage);

router.get('/data/:id', getDataSetPage);

module.exports = router;