/**
 * A Multer Middleware To Handle FormData and Files Upload
 * @author Zhicong Jiang <zjiang34@sheffield.ac.uk>
 */
const multer = require('multer');


/**
 * Set Up Files Storage Path
 * @author Zhicong Jiang <zjiang34@sheffield.ac.uk>
 */
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/upload/');
    },
    filename: function (req, file, cb) {
        var original = file.originalname;
        var file_extension = original.split(".");
        // Make the file name the date + the file extension
        filename =  Date.now() + '.' + file_extension[file_extension.length-1];
        cb(null, filename);
    }
});

var upload = multer({ storage: storage });

module.exports = {
    upload
}
