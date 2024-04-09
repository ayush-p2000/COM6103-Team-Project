const express = require('express');
const {deleteDataRetrieval, getFilePage, getFileDownload, getRetrievalDownload} = require("../controllers/retrieval/dataRetrievalController");
const router = express.Router();

router.get('/retrieval/:id/download', getRetrievalDownload);
router.delete('/retrieval/:id', deleteDataRetrieval);

router.get('/retrieval/:retrieval_id/file/:file_id', getFilePage);
router.get('/retrieval/:retrieval_id/file/:file_id/download', getFileDownload);

module.exports = router;