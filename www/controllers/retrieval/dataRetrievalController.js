/*
 * This controller should handle any operations related to data retrieval such as the file explorer and secure viewing
 */

const {Readable} = require('stream');
const archiver = require('archiver');
const {getItemDetail, getRetrievalObjectByDeviceId, getRetrieval, deleteRetrieval} = require("../../model/mongodb");
const retrievalState = require("../../model/enum/retrievalState");
const dataTypes = require("../../model/enum/dataTypes");

async function getItemDataRetrieval(req, res, next) {
    try {
        //Get the item ID from the request
        const {id} = req.params;

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

async function getRetrievalDownload(req, res, next) {
    try {
        //Get the retrieval ID from the request
        const retrieval_id = req.params.id;

        //Get the retrieval object from the database
        const retrievalObject = await getRetrieval(retrieval_id);

        //If the retrieval object is not found, then the item is not available for retrieval
        if (typeof (retrievalObject) === 'undefined' || retrievalObject === null) {
            res.status(404);
            next({message: "Item not available for retrieval", status: 404});
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

        const archive = archiver('zip', {
            zlib: {level: 9}
        });

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

        archive.pipe(res);

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


async function getFilePage(req, res, next) {
    //Get the retrieval ID and file ID from the request
    const {retrieval_id, file_id} = req.params;

    try {
        //Get the retrieval object from the database
        const retrievalObject = await getRetrieval(retrieval_id);

        //If the retrieval object is not found, then the item is not available for retrieval
        if (typeof (retrievalObject) === 'undefined' || retrievalObject === null) {
            res.status(404);
            next({message: "Item not available for retrieval", status: 404});
            return;
        }

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

async function getFileDownload(req, res, next) {
    try {
        //Get the retrieval ID and file ID from the request
        const {retrieval_id, file_id} = req.params;

        //Get the retrieval object from the database
        const retrievalObject = await getRetrieval(retrieval_id);

        //If the retrieval object is not found, then the item is not available for retrieval
        if (typeof (retrievalObject) === 'undefined' || retrievalObject === null) {
            res.status(404);
            next({message: "Item not available for retrieval", status: 404});
            return;
        }

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

async function deleteDataRetrieval(req, res, next) {
    try {
        //Get the retrieval ID from the request
        const {id} = req.params;

        //Get the retrieval object from the database
        const retrievalObject = await getRetrieval(id);

        //If the retrieval object is not found, then the item is not available for retrieval
        if (typeof (retrievalObject) === 'undefined' || retrievalObject === null) {
            res.status(404).send('Item not available for retrieval');
            return;
        }

        //Delete the retrieval object
        await deleteRetrieval(id);

        res.status(200).send('Retrieval deleted successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
}

async function getRetrievalEditPage(req, res, next) {
    try {
        //Get the item ID from the request
        const {id} = req.params;

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

async function promoteRetrieval(req, res, next) {
    try {
        //Get the retrieval ID from the request
        const {id} = req.params;

        //Get the retrieval object from the database
        const retrievalObject = await getRetrieval(id);

        //If the retrieval object is not found, then the item is not available for retrieval
        if (typeof (retrievalObject) === 'undefined' || retrievalObject === null) {
            res.status(404).send('Item not available for retrieval');
            return;
        }

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

async function demoteRetrieval(req, res, next) {
    try {
        //Get the retrieval ID from the request
        const {id} = req.params;

        //Get the retrieval object from the database
        const retrievalObject = await getRetrieval(id);

        //If the retrieval object is not found, then the item is not available for retrieval
        if (typeof (retrievalObject) === 'undefined' || retrievalObject === null) {
            res.status(404).send('Item not available for retrieval');
            return;
        }

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

async function errorStateHandler(req, res, next) {
    try {
        //Get the retrieval ID and the state from the request
        const {id} = req.params;

        const state = req.body.state;

        //Check if the state exists in the body
        if (typeof (state) === 'undefined' || state === null) {
            res.status(400).send('State not provided');
            return;
        }

        //Get the retrieval object from the database
        const retrievalObject = await getRetrieval(id);

        //If the retrieval object is not found, then the item is not available for retrieval
        if (typeof (retrievalObject) === 'undefined' || retrievalObject === null) {
            res.status(404).send('Item not available for retrieval');
            return;
        }

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

async function postURL(req, res, next) {
    try {
        //Get the retrieval ID from the request
        const {id} = req.params;

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

        //Get the retrieval object from the database
        const retrievalObject = await getRetrieval(id);

        //If the retrieval object is not found, then the item is not available for retrieval
        if (typeof (retrievalObject) === 'undefined' || retrievalObject === null) {
            res.status(404).send('Item not available for retrieval');
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

async function postFiles(req, res, next) {
    try {
        //Get the retrieval ID from the request
        const {id} = req.params;

        const files = req.files;

        //Check if the files exist in the body
        if (typeof (files) === 'undefined' || files === null) {
            res.status(400).send('Files not provided');
            return;
        }

        //Get the retrieval object from the database
        const retrievalObject = await getRetrieval(id);

        //If the retrieval object is not found, then the item is not available for retrieval
        if (typeof (retrievalObject) === 'undefined' || retrievalObject === null) {
            res.status(404).send('Item not available for retrieval');
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

async function deleteFile(req, res, next) {
    try {
        //Get the retrieval ID and file ID from the request
        const {retrieval_id, file_id} = req.params;

        //Get the retrieval object from the database
        const retrievalObject = await getRetrieval(retrieval_id);

        //If the retrieval object is not found, then the item is not available for retrieval
        if (typeof (retrievalObject) === 'undefined' || retrievalObject === null) {
            res.status(404).send('Item not available for retrieval');
            return;
        }

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