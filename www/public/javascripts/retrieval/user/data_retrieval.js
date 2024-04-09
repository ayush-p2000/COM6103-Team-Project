document.addEventListener('DOMContentLoaded', function () {
    const file_table = $('#file_table');

    //Check if the file table is not null
    if (file_table) {
        file_table.DataTable({});
    }

});

async function onDeleteConfirm(retrievalID) {
    // Get the modal
    const confirmModal = $('#deleteConfirmationModal');

    const deleteSpinner = $('#deleteSpinner');
    deleteSpinner.removeClass('d-none');

    try {
        const response = await axios.delete(`/retrieval/${retrievalID}`)

        confirmModal.modal('hide');
        window.location.reload();
    } catch (error) {
        console.error(error);
        deleteSpinner.addClass('d-none');
    }
}