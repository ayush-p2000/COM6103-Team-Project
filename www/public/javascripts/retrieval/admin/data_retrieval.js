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
    }

}

function onAddURLPressed() {
    const addURLModal = $('#addURLModal');
    addURLModal.modal('show');
}

function onAddURLSubmit() {

}

function onUploadPressed() {
    const uploadModal = $('#uploadModal');
    uploadModal.modal('show');
}

function onUploadSubmit() {

}

function onDeleteFile() {
    const deleteModal = $('#deleteFileModal');
    deleteModal.modal('show');
}

function onDeleteFileConfirm() {

}

function onDeleteConfirm(retrievalID) {
    // Get the modal
    const confirmModal = $('#deleteConfirmationModal');

    try {
        //const response = axios.delete(`/retrieval/${retrievalID}`)

        confirmModal.modal('hide');
        window.location.reload();
    } catch (error) {
        console.error(error);
    }
}