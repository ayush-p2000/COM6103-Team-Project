const express = require('express');
const {
    deleteDataRetrieval, getFilePage, getFileDownload, getRetrievalDownload, getRetrievalEditPage, promoteRetrieval,
    demoteRetrieval, errorStateHandler, postURL, postFiles, deleteFile
} = require("../controllers/retrieval/dataRetrievalController");
const {isAuthenticated, isStaff} = require("../middlewares/auth");
const multer = require("multer");
const {verifyRetrievalExpiry, isValidRetrievalUser} = require("../middlewares/retrieval");
const router = express.Router();

router.delete('/retrieval/:id', isValidRetrievalUser, deleteDataRetrieval);
router.get('/retrieval/:id/download', isValidRetrievalUser, verifyRetrievalExpiry, getRetrievalDownload);
router.post('/retrieval/:id/promote', isStaff, isValidRetrievalUser, verifyRetrievalExpiry, promoteRetrieval);
router.post('/retrieval/:id/demote', isStaff, isValidRetrievalUser, verifyRetrievalExpiry, demoteRetrieval);
router.post('/retrieval/:id/state/error', isStaff, isValidRetrievalUser, verifyRetrievalExpiry, errorStateHandler);

//Use multer to upload files to memory

const imgUpload = multer(
    {
        limits: {
            fileSize: 10 * 1024 * 1024 // 10 MB file size limit
        }
    }
);
router.post('/retrieval/:id/file/add', isStaff, imgUpload.array('files', 10), isValidRetrievalUser, verifyRetrievalExpiry, postFiles);
router.post('/retrieval/:id/file/add/url', isStaff, isValidRetrievalUser, verifyRetrievalExpiry, postURL);
router.get('/retrieval/:retrieval_id/file/:file_id', isValidRetrievalUser, verifyRetrievalExpiry, getFilePage);
router.get('/retrieval/:retrieval_id/file/:file_id/download', isValidRetrievalUser, verifyRetrievalExpiry, getFileDownload);
router.delete('/retrieval/:retrieval_id/file/:file_id', isStaff, isValidRetrievalUser, deleteFile);

router.get('/admin/devices/:device_id/retrieval', isStaff, isValidRetrievalUser, verifyRetrievalExpiry, getRetrievalEditPage);

module.exports = router;