document.addEventListener('DOMContentLoaded', function () {
    const file_table = $('#file_table');

    //Check if the file table is not null
    if (file_table) {
        file_table.DataTable({});
    }

});

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