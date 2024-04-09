document.addEventListener('DOMContentLoaded', function () {
    const file_table = $('#file_table');

    //Check if the file table is not null
    if (file_table) {
        file_table.DataTable({});
    }

});

async function onPromotePressed(retrievalID) {
    try {
        const spinner = $('#promotionSpinner');
        spinner.removeClass('d-none');

        const response = await axios.post(`/retrieval/${retrievalID}/promote`);

        window.location.reload();
    } catch (error) {
        console.error(error);
        spinner.addClass('d-none');
    }
}

async function onDemotePressed(retrievalID) {
    try {
        const spinner = $('#promotionSpinner');
        spinner.removeClass('d-none');

        const response = await axios.post(`/retrieval/${retrievalID}/demote`);

        window.location.reload();
    } catch (error) {
        console.error(error);
        spinner.addClass('d-none');
    }
}

async function onErrorStatePressed(retrievalID, state) {

    const errorStateRetrievalID = $('#errorStateRetrievalID');
    const errorStateRetrievalState = $('#errorStateType');

    errorStateRetrievalID.val(retrievalID);
    errorStateRetrievalState.val(state);

    const errorModal = $('#errorStateModal');
    errorModal.modal('show');
}

async function onErrorStateConfirm() {
    const errorModal = $('#errorStateModal');
    errorModal.modal('hide');

    const promotionSpinner = $('#promotionSpinner');
    promotionSpinner.removeClass('d-none');

    const errorStateRetrievalID = $('#errorStateRetrievalID');
    const errorStateRetrievalState = $('#errorStateType');

    const retrievalID = errorStateRetrievalID.val();
    const state = errorStateRetrievalState.val();

    let stateInt = 0;
    if (state === 'fail') {
        stateInt = 3;
    } else if (state === 'cancel') {
        stateInt = 4;
    } else {
        console.error('Unknown error state ', state);
        return;
    }

    try {
        const response = await axios.post(`/retrieval/${retrievalID}/state/error`,
            {
                state: stateInt
            });

        window.location.reload();
    } catch (error) {
        console.error(error);
        promotionSpinner.addClass('d-none');
    }

}

function onAddURLPressed() {
    const addURLModal = $('#addURLModal');
    addURLModal.modal('show');
}

async function onAddURLSubmit(retrievalID) {
    const urlSpinner = $('#urlSpinner');
    urlSpinner.removeClass('d-none');

    const urlInput = $('#urlInput');
    const url = urlInput.val();

    const nameInput = $('#nameInput');
    const name = nameInput.val();

    if (url === '') {
        urlSpinner.addClass('d-none');
        return;
    }

    try {
        const response = await axios.post(`/retrieval/${retrievalID}/file/add/url`, {
            url: url,
            name: name
        });

        window.location.reload();
    } catch (error) {
        console.error(error);
        urlSpinner.addClass('d-none');
    }
}

function onUploadPressed() {
    const uploadModal = $('#uploadModal');
    uploadModal.modal('show');
}

async function onUploadSubmit(retrievalID) {
    const uploadSpinner = $('#uploadSpinner');
    uploadSpinner.removeClass('d-none');

    const uploadFileInput = $('#fileInput');
    const files = uploadFileInput[0].files;

    //Ensure there is no more than 10 files
    if (files.length > 10) {
        uploadSpinner.addClass('d-none');
        return;
    }

    const formData = new FormData();
    //Add the files to the form data
    for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
    }

    try {
        const response = await axios.post(`/retrieval/${retrievalID}/file/add/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        window.location.reload();
    } catch (error) {
        console.error(error);
        uploadSpinner.addClass('d-none');
    }
}

function onDeleteFile(retrievalID, fileID) {
    const deleteRetrievalID = $('#deleteRetrievalID');
    const deleteFileID = $('#deleteFileID');

    deleteRetrievalID.val(retrievalID);
    deleteFileID.val(fileID);

    const deleteModal = $('#deleteFileModal');
    deleteModal.modal('show');
}

async function onDeleteFileConfirm() {
    try {
        const deleteFileSpinner = $('#deleteFileSpinner');
        deleteFileSpinner.removeClass('d-none');

        const deleteRetrievalID = $('#deleteRetrievalID');
        const deleteFileID = $('#deleteFileID');

        const retrievalID = deleteRetrievalID.val();
        const fileID = deleteFileID.val();

        const response = await axios.delete(`/retrieval/${retrievalID}/file/${fileID}`);

        window.location.reload();
    } catch (error) {
        console.error(error);
        deleteFileSpinner.addClass('d-none');
    }
}