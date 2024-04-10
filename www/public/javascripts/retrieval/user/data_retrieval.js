const THREE_MONTH_COST = 6.99;
const SIX_MONTH_COST = 9.99;
const THREE_MONTH_EXTENSION = 3;
const SIX_MONTH_EXTENSION = 6;
const EXTENSION_TYPE = 'RETRIEVAL_EXTENSION';

document.addEventListener('DOMContentLoaded', function () {
    const file_table = $('#file_table');

    //Check if the file table is not null
    if (file_table) {
        file_table.DataTable({});
    }

    /*
     * Sets up the event handlers for the extension buttons.
     * This will redirect the user to the checkout page with the correct parameters.
     */
    const threeMonthExtensionButton = $('#extend3');
    const sixMonthExtensionButton = $('#extend6');

    threeMonthExtensionButton.on('click', async () => {
        const form = document.createElement('form')
        form.method = 'GET';
        form.action = '/checkout'

        const retrievalID = threeMonthExtensionButton.data('retrieval-id');

        const formData = new FormData();

        formData.append('retrieval_id', retrievalID);
        formData.append('type', EXTENSION_TYPE);
        formData.append('extension', THREE_MONTH_EXTENSION);
        formData.append('total', THREE_MONTH_COST);

        formData.forEach((value, key) => {
            const input = document.createElement('input')
            input.type = 'hidden'
            input.name = key
            input.value = value
            form.appendChild(input)
        });

        document.body.appendChild(form)
        form.submit()
    });

    sixMonthExtensionButton.on('click', async () => {
        const form = document.createElement('form')
        form.method = 'GET';
        form.action = '/checkout'

        const retrievalID = sixMonthExtensionButton.data('retrieval-id');

        const formData = new FormData();

        formData.append('retrieval_id', retrievalID);
        formData.append('type', EXTENSION_TYPE);
        formData.append('extension', SIX_MONTH_EXTENSION);
        formData.append('total', SIX_MONTH_COST);

        formData.forEach((value, key) => {
            const input = document.createElement('input')
            input.type = 'hidden'
            input.name = key
            input.value = value
            form.appendChild(input)
        });

        document.body.appendChild(form)
        form.submit()
    });
});

/**
 * Handles deletion of a retrieval after the user confirms the deletion,
 * reloading the page on success
 * @param retrievalID The ID of the retrieval to delete
 * @author Benjamin Lister
 */
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