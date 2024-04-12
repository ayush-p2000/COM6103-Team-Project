/*
 * This controller should handle any operations related to data retrieval such as the file explorer and secure viewing
 */

const {Readable} = require('stream');
const archiver = require('archiver');
const {getItemDetail, getRetrievalObjectByDeviceId, getRetrieval, deleteRetrieval} = require("../../model/mongodb");
const retrievalState = require("../../model/enum/retrievalState");
const dataTypes = require("../../model/enum/dataTypes");

/**
 * Prepares and serves the data retrieval page for the user-side of the application
 * @param req The request object
 * @param res The response object
 * @param next The next middleware function
 * @author Benjamin Lister
 */
async function getItemDataRetrieval(req, res, next) {
    try {
        //Get the item ID from the request
        const id = req.params.device_id;

        //Get the item from the database
        const item = await getItemDetail(id);

        //Get the retrieval object from the database
        const retrievalObject = await getRetrievalObjectByDeviceId(id);

        //If the retrieval object is not found, then the item is not available for retrieval
        if (typeof (retrievalObject) === 'undefined' || retrievalObject === null) {
            res.status(404);
            next({message: "Item not available for retrieval", status: 404});
            return;
        }

        res.render('retrieval/data_retrieval_user', {
            device: item,
            retrieval: retrievalObject,
            auth: req.isLoggedIn,
            user: req.user,
            retrievalState,
            dataTypes
        });
    } catch (error) {
        console.error(error);
        res.status(500);
        next({message: "Internal server error", status: 500});
    }
}

/**
 * Prepares and serves a zip file for downloading all the files in a retrieval
 * @param req The request object
 * @param res The response object
 * @param next The next middleware function
 * @author Benjamin Lister
 */
async function getRetrievalDownload(req, res, next) {
    try {
        //Get the retrieval object from the request
        const retrievalObject = req.retrieval;

        //If the retrieval object is expired, or there are no files to download, then don't proceed further
        if (retrievalState.isExpiredState(retrievalObject.retrieval_state) || retrievalObject.data.length === 0) {
            res.status(404);
            next({message: "Item not available for retrieval, this retrieval is expired", status: 404});
            return;
        }

        //Prepare the data for download, by creating a zip file with the data
        const files = [];
        retrievalObject.data.forEach(file => {
            if (file.use_buffer) {
                files.push({
                    name: file.name,
                    buffer: file.buffer
                });
            }
        });

        //Based on: https://basavaraj-varji.medium.com/creating-a-zip-file-dynamically-on-requested-by-the-client-in-nodejs-loopback-554d06466300
        // Accessed: 09/04/2024

        //Create the zip file
        const archive = archiver('zip', {
            zlib: {level: 9}
        });

        //Defines a promise that resolves when the archive is finalized in either an error or end event
        const finalPromise = new Promise((resolve, reject) => {
            archive.on('error', (err) => {
                reject(err);
            });

            archive.on('end', () => {
                resolve();
            });
        });

        //Set the headers for the file download
        res.setHeader('Content-disposition', `attachment; filename=${retrievalObject.device?.model?.name}_${retrievalObject._id}.zip`);
        res.setHeader('Content-type', 'application/zip');

        //Pipe the archive to the response.
        //This will send the zip file to the user once the archive is finalized
        archive.pipe(res);

        //Append each buffer to the archive
        files.forEach(file => {
            const bufferStream = new Readable();
            bufferStream.push(file.buffer);
            bufferStream.push(null);
            archive.append(bufferStream, {name: file.name});
        });

        await archive.finalize();
        await finalPromise;
    } catch (error) {
        console.error(error);
        res.status(500);
        next({message: "Internal server error", status: 500});
    }
}

/**
 * Prepares and serves the file viewer page
 * @param req The request object
 * @param res The response object
 * @param next The next middleware function
 * @author Benjamin Lister
 */
async function getFilePage(req, res, next) {
    //Get the file ID from the request
    const {file_id} = req.params;

    try {
        //Get the retrieval object from the request
        const retrievalObject = req.retrieval;

        //Find the file in the retrieval object's data array
        const file = retrievalObject.data.find(file => file._id.toString() === file_id);

        //If the file is not found, then the file is not available
        if (typeof (file) === 'undefined' || file === null) {
            res.status(404);
            next({message: "File not available", status: 404});
            return;
        }

        //Render the file page
        res.render('retrieval/file_view', {
            file,
            retrieval: retrievalObject,
            auth: req.isLoggedIn,
            user: req.user,
            dataTypes
        });

    } catch (error) {
        console.error(error);
        res.status(500);
        next({message: "Internal server error", status: 500});
    }
}

/**
 * Prepares and serves a file for download
 * @param req The request object
 * @param res The response object
 * @param next The next middleware function
 * @author Benjamin Lister
 */
async function getFileDownload(req, res, next) {
    try {
        //Get the  file ID from the request
        const {file_id} = req.params;

        //Get the retrieval object from the request
        const retrievalObject = req.retrieval;

        //Find the file in the retrieval object's data array
        const file = retrievalObject.data.find(file => file._id.toString() === file_id);

        //If the file is not found, then the file is not available
        if (typeof (file) === 'undefined' || file === null) {
            res.status(404);
            next({message: "File not available for download", status: 404});
            return;
        }

        //Set the headers for the file download
        res.setHeader('Content-disposition', `attachment; filename=${file.name}`);
        res.setHeader('Content-type', file.value);
        res.send(file.buffer);
    } catch (error) {
        console.error(error);
        res.status(500);
        next({message: "Internal server error", status: 500});
    }
}

/**
 * Handles the request to delete a retrieval object
 * @param req The request object
 * @param res The response object
 * @param next The next middleware function
 * @author Benjamin Lister
 */
async function deleteDataRetrieval(req, res, next) {
    try {
        //Get the retrieval object from the request
        const retrievalObject = req.retrieval;

        //Delete the retrieval object
        await deleteRetrieval(id);

        res.status(200).send('Retrieval deleted successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
}

/**
 * Prepares and serves the data retrieval page for the staff-side of the application
 * @param req The request object
 * @param res The response object
 * @param next The next middleware function
 * @author Benjamin Lister
 */
async function getRetrievalEditPage(req, res, next) {
    try {
        //Get the item ID from the request
        const id = req.params.device_id;

        //Get the item from the database
        const item = await getItemDetail(id);

        //Get the retrieval object from the request
        const retrievalObject = req.retrieval;

        res.render('retrieval/data_retrieval_staff', {
            device: item,
            retrieval: retrievalObject,
            auth: req.isLoggedIn,
            user: req.user,
            retrievalState,
            dataTypes
        });
    } catch (error) {
        console.error(error);
        res.status(500);
        next({message: "Internal server error", status: 500});
    }
}

/**
 * Handles the request to promote a retrieval object to the next typical state in the retrieval state machine
 * @param req The request object
 * @param res The response object
 * @param next The next middleware function
 * @author Benjamin Lister
 */
async function promoteRetrieval(req, res, next) {
    try {
        //Get the retrieval object from the request
        const retrievalObject = req.retrieval;

        //Promote the retrieval object
        const newValue = retrievalState.getNextTypicalState(retrievalObject.retrieval_state)
        if (retrievalState.isValidStateValue(newValue)) {
            retrievalObject.retrieval_state = newValue;
        }

        await retrievalObject.save();

        res.status(200).send('Retrieval promoted successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
}

/**
 * Handles the request to demote a retrieval object to the previous typical state in the retrieval state machine
 * @param req The request object
 * @param res The response object
 * @param next The next middleware function
 * @author Benjamin Lister
 */
async function demoteRetrieval(req, res, next) {
    try {
        //Get the retrieval object from the request
        const retrievalObject = req.retrieval;

        //Demote the retrieval object
        const newValue = retrievalState.getPreviousTypicalState(retrievalObject.retrieval_state)
        if (retrievalState.isValidStateValue(newValue)) {
            retrievalObject.retrieval_state = newValue;
        }

        await retrievalObject.save();

        res.status(200).send('Retrieval demoted successfully');

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
}

/**
 * Handles the request to place a retrieval object into an error state.
 * This is currently used to handle the case where the data retrieval is not possible due to an error or the retrieval is cancelled.
 * @param req The request object
 * @param res The response object
 * @param next The next middleware function
 * @author Benjamin Lister
 */
async function errorStateHandler(req, res, next) {
    try {
        //Get the state from the request
        const state = req.body.state;

        //Check if the state exists in the body
        if (typeof (state) === 'undefined' || state === null) {
            res.status(400).send('State not provided');
            return;
        }

        //Get the retrieval object from the request
        const retrievalObject = await getRetrieval(id);

        //Check if the state is a valid state
        if (!retrievalState.isValidStateValue(state)) {
            res.status(400).send('Invalid state provided');
            return;
        }

        //Set the state of the retrieval object
        retrievalObject.retrieval_state = state;

        await retrievalObject.save();

        res.status(200).send('State updated successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
}

/**
 * Handles the request to add a URL to a retrieval object
 * @param req The request object
 * @param res The response object
 * @param next The next middleware function
 * @author Benjamin Lister
 */
async function postURL(req, res, next) {
    try {
        //Get the URL and name from the request
        const url = req.body.url;
        const name = req.body.name;

        //Check if the URL exists in the body
        if (typeof (url) === 'undefined' || url === null) {
            res.status(400).send('URL not provided');
            return;
        }

        //Check if the name exists in the body
        if (typeof (name) === 'undefined' || name === null) {
            res.status(400).send('Name not provided');
            return;
        }

        //Get the retrieval object from the request
        const retrievalObject = req.retrieval;

        //If the retrieval object is expired, then don't proceed further
        if (retrievalState.isExpiredState(retrievalObject.retrieval_state)) {
            res.status(403).send(`This retrieval is expired and cannot be edited`);
            return;
        }

        //Add the URL to the retrieval object
        retrievalObject.data.push({
            name: name,
            value: url,
            use_buffer: false,
            data_type: dataTypes.URL,
        });

        await retrievalObject.save();

        res.status(200).send('URL added successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
}

/**
 * Handles the request to add files to a retrieval object.
 * This supports a maximum of 10 files at a time.
 * @param req The request object
 * @param res The response object
 * @param next The next middleware function
 * @author Benjamin Lister
 */
async function postFiles(req, res, next) {
    try {
        //Get the files from the request
        const files = req.files;

        //Check if the files exist in the body
        if (typeof (files) === 'undefined' || files === null) {
            res.status(400).send('Files not provided');
            return;
        }

        //Get the retrieval object from the request
        const retrievalObject = req.retrieval;

        //If the retrieval object is expired, then don't proceed further
        if (retrievalState.isExpiredState(retrievalObject.retrieval_state)) {
            res.status(403).send(`This retrieval is expired and cannot be edited`);
            return;
        }

        //Add the files to the retrieval object
        files.forEach(file => {
            retrievalObject.data.push({
                name: file.originalname,
                value: file.mimetype,
                buffer: file.buffer,
                use_buffer: true,
                data_type: (file.mimetype.includes('image') ? dataTypes.IMAGE : dataTypes.FILE),
            });
        });

        await retrievalObject.save();

        res.status(200).send('Files added successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
}

/**
 * Handles the request to delete a file from a retrieval object
 * @param req The request object
 * @param res The response object
 * @param next The next middleware function
 * @author Benjamin Lister
 */
async function deleteFile(req, res, next) {
    try {
        //Get the file ID from the request
        const {file_id} = req.params;

        //Get the retrieval object from the request
        const retrievalObject = req.retrieval;

        //Find the file in the retrieval object's data array
        const fileIndex = retrievalObject.data.findIndex(file => file._id.toString() === file_id);

        //If the file is not found, then the file is not available
        if (fileIndex === -1) {
            res.status(404).send('File not available for deletion');
            return;
        }

        //Remove the file from the retrieval object
        retrievalObject.data.splice(fileIndex, 1);

        await retrievalObject.save();

        res.status(200).send('File deleted successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
}

module.exports = {
    getItemDataRetrieval,
    getFilePage,
    getFileDownload,
    deleteDataRetrieval,
    getRetrievalDownload,
    getRetrievalEditPage,
    promoteRetrieval,
    demoteRetrieval,
    errorStateHandler,
    postURL,
    postFiles,
    deleteFile
}