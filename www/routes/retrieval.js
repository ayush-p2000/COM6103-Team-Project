const express = require('express');
const {deleteDataRetrieval, getFilePage, getFileDownload, getRetrievalDownload, getRetrievalEditPage, promoteRetrieval,
    demoteRetrieval, errorStateHandler
} = require("../controllers/retrieval/dataRetrievalController");
const {isAuthenticated, isStaff} = require("../middlewares/auth");
const router = express.Router();

router.get('/retrieval/:id/download', getRetrievalDownload);
router.delete('/retrieval/:id', deleteDataRetrieval);
router.post('/retrieval/:id/promote', isAuthenticated, isStaff, promoteRetrieval);
router.post('/retrieval/:id/demote', isAuthenticated, isStaff, demoteRetrieval);
router.post('/retrieval/:id/state/error', isAuthenticated, isStaff, errorStateHandler);

router.get('/retrieval/:retrieval_id/file/:file_id', getFilePage);
router.get('/retrieval/:retrieval_id/file/:file_id/download', getFileDownload);

router.get('/admin/devices/:id/retrieval', isAuthenticated, isStaff, getRetrievalEditPage);

module.exports = router;