const express = require('express');
const {
    deleteDataRetrieval, getFilePage, getFileDownload, getRetrievalDownload, getRetrievalEditPage, promoteRetrieval,
    demoteRetrieval, errorStateHandler, postURL, postFiles, deleteFile
} = require("../controllers/retrieval/dataRetrievalController");
const {isAuthenticated, isStaff} = require("../middlewares/auth");
const multer = require("multer");
const router = express.Router();

router.get('/retrieval/:id/download', getRetrievalDownload);
router.delete('/retrieval/:id', deleteDataRetrieval);
router.post('/retrieval/:id/promote', isStaff, promoteRetrieval);
router.post('/retrieval/:id/demote', isStaff, demoteRetrieval);
router.post('/retrieval/:id/state/error', isStaff, errorStateHandler);
router.delete('/retrieval/:id', deleteDataRetrieval);

//Use multer to upload files to memory

const imgUpload = multer(
    {
        limits: {
            fileSize: 10 * 1024 * 1024 // 10 MB file size limit
        }
    }
);
router.post('/retrieval/:id/file/add', isStaff, imgUpload.array('files', 10), postFiles);
router.post('/retrieval/:id/file/add/url', isStaff, postURL);
router.get('/retrieval/:retrieval_id/file/:file_id', getFilePage);
router.get('/retrieval/:retrieval_id/file/:file_id/download', getFileDownload);
router.delete('/retrieval/:retrieval_id/file/:file_id', isStaff, deleteFile);

router.get('/admin/devices/:id/retrieval', isStaff, getRetrievalEditPage);

module.exports = router;