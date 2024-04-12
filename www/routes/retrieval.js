const express = require('express');
const {
    deleteDataRetrieval, getFilePage, getFileDownload, getRetrievalDownload, getRetrievalEditPage, promoteRetrieval,
    demoteRetrieval, errorStateHandler, postURL, postFiles, deleteFile
} = require("../controllers/retrieval/dataRetrievalController");
const {isAuthenticated, isStaff} = require("../middlewares/auth");
const multer = require("multer");
const {verifyRetrievalExpiry, isValidRetrievalUser, populateRetrievalObject} = require("../middlewares/retrieval");
const router = express.Router();

router.delete('/retrieval/:id', populateRetrievalObject, isValidRetrievalUser, deleteDataRetrieval);
router.get('/retrieval/:id/download', populateRetrievalObject, isValidRetrievalUser, verifyRetrievalExpiry, getRetrievalDownload);
router.post('/retrieval/:id/promote', isStaff, populateRetrievalObject, isValidRetrievalUser, verifyRetrievalExpiry, promoteRetrieval);
router.post('/retrieval/:id/demote', isStaff, populateRetrievalObject, isValidRetrievalUser, verifyRetrievalExpiry, demoteRetrieval);
router.post('/retrieval/:id/state/error', isStaff, populateRetrievalObject, isValidRetrievalUser, verifyRetrievalExpiry, errorStateHandler);

//Use multer to upload files to memory

const imgUpload = multer(
    {
        limits: {
            fileSize: 10 * 1024 * 1024 // 10 MB file size limit
        }
    }
);

//Allow this route to accept multipart form data with files under the key 'files', with a maximum of 10 files
router.post('/retrieval/:id/file/add', isStaff, imgUpload.array('files', 10), populateRetrievalObject, isValidRetrievalUser, verifyRetrievalExpiry, postFiles);
router.post('/retrieval/:id/file/add/url', isStaff, populateRetrievalObject, isValidRetrievalUser, verifyRetrievalExpiry, postURL);
router.get('/retrieval/:retrieval_id/file/:file_id', populateRetrievalObject, isValidRetrievalUser, verifyRetrievalExpiry, getFilePage);
router.get('/retrieval/:retrieval_id/file/:file_id/download', populateRetrievalObject, isValidRetrievalUser, verifyRetrievalExpiry, getFileDownload);
router.delete('/retrieval/:retrieval_id/file/:file_id', isStaff, populateRetrievalObject, isValidRetrievalUser, deleteFile);

router.get('/admin/devices/:device_id/retrieval', isStaff, populateRetrievalObject, isValidRetrievalUser, verifyRetrievalExpiry, getRetrievalEditPage);

module.exports = router;