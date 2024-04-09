/*
 * This controller should handle any operations related to data retrieval such as the file explorer and secure viewing
 */

const {Readable} = require('stream');
const archiver = require('archiver');
const {getItemDetail, getRetrievalObjectByDeviceId, getRetrieval} = require("../../model/mongodb");
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

}

module.exports = {
    getItemDataRetrieval,
    getFilePage,
    getFileDownload,
    deleteDataRetrieval,
    getRetrievalDownload
}