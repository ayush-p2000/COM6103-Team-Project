/**
 * Confirm the transaction details and send them to the server
 * @param quoteId - The ID of the quote to confirm
 * @author Benjamin Lister
 */
async function confirmTransaction(quoteId) {
    //Get the error alert
    const errorAlert = $('#confirmErrorAlert');

    //Get the acceptForm for validation
    const acceptForm = $('#acceptForm');

    //Hide the error alert by default
    errorAlert.addClass('d-none');

    //Remove the was-validated class to reset the form validation
    acceptForm.removeClass('was-validated');

    //Check if the form is valid. Using the [0] index is necessary as the jQuery object is an array-like object
    // and the checkValidity() method is a DOM method, so using the index allows us to access the DOM element
    if (!acceptForm[0].checkValidity()) {
        //If the form is invalid, add the was-validated class to display the validation messages
        acceptForm.addClass('was-validated');
        return;
    }

    //Assuming validation has passed, get the final price, receipt ID, receipt date, and receipt image
    const finalPrice = document.getElementById('finalSalePrice').value;
    const receiptId = document.getElementById('receiptID').value;
    const receiptDate = document.getElementById('receiptDate').value;
    const receiptImage = document.getElementById('receiptImage').files[0];

    //Create the transaction object as a FormData object so the image can be sent along with the other data
    const confirmationDetails = new FormData();
    confirmationDetails.append('final_price', finalPrice);
    confirmationDetails.append('receipt_id', receiptId);
    confirmationDetails.append('receipt_date', receiptDate);
    confirmationDetails.append('receipt_image', receiptImage);

    //Send the transaction to the server
    try {
        const response = await axios.post(`/qr/${quoteId}/confirm`, confirmationDetails, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Accept': 'application/json',
            }
        });

        //If the transaction was successful, close the modal and reload the page
        $('#confirmModal').modal('hide');
        setTimeout(() => location.reload(), 1000);
    } catch (error) {
        console.error(error);

        //If the transaction failed, display an error message
        errorAlert.removeClass('d-none');
    }

}

/**
 * Reject the transaction and send the rejection to the server
 * @param quoteId - The ID of the quote to reject
    * @author Benjamin Lister
 */
async function rejectTransaction(quoteId) {
    //Get the error alert
    const errorAlert = $('#rejectErrorAlert');

    //Hide the error alert by default
    errorAlert.addClass('d-none');

    //The modal acts as a confirmation dialog, so we don't need to validate anything

    //Send the rejection to the server
    try {
        const response = await axios.post(`/qr/${quoteId}/reject`);

        //If the rejection was successful, close the modal and reload the page
        $('#rejectModal').modal('hide');
        setTimeout(() => location.reload(), 1000);
    } catch (error) {
        console.error(error);

        //If the rejection failed, display an error message
        errorAlert.removeClass('d-none');
    }
}