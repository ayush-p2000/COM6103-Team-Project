const express = require('express');
const {
    deleteDataRetrieval, getFilePage, getFileDownload, getRetrievalDownload, getRetrievalEditPage, promoteRetrieval,
    demoteRetrieval, errorStateHandler, postURL, postFiles, deleteFile
} = require("../controllers/retrieval/dataRetrievalController");
const {isAuthenticated, isStaff} = require("../middlewares/auth");
const multer = require("multer");
const {verifyRetrievalExpiry} = require("../middlewares/retrieval");
const router = express.Router();

router.get('/retrieval/:id/download', verifyRetrievalExpiry, getRetrievalDownload);
router.delete('/retrieval/:id', deleteDataRetrieval);
router.post('/retrieval/:id/promote', isStaff, verifyRetrievalExpiry, promoteRetrieval);
router.post('/retrieval/:id/demote', isStaff, verifyRetrievalExpiry, demoteRetrieval);
router.post('/retrieval/:id/state/error', isStaff, verifyRetrievalExpiry, errorStateHandler);
router.delete('/retrieval/:id', deleteDataRetrieval);

//Use multer to upload files to memory

const imgUpload = multer(
    {
        limits: {
            fileSize: 10 * 1024 * 1024 // 10 MB file size limit
        }
    }
);
router.post('/retrieval/:id/file/add', isStaff, imgUpload.array('files', 10), verifyRetrievalExpiry, postFiles);
router.post('/retrieval/:id/file/add/url', isStaff, verifyRetrievalExpiry, postURL);
router.get('/retrieval/:retrieval_id/file/:file_id', verifyRetrievalExpiry, getFilePage);
router.get('/retrieval/:retrieval_id/file/:file_id/download', verifyRetrievalExpiry, getFileDownload);
router.delete('/retrieval/:retrieval_id/file/:file_id', isStaff, deleteFile);

router.get('/admin/devices/:device_id/retrieval', isStaff, verifyRetrievalExpiry, getRetrievalEditPage);

module.exports = router;