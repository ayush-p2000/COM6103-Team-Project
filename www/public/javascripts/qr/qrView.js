async function confirmTransaction(quoteId) {
    const errorAlert = $('#confirmErrorAlert');
    errorAlert.addClass('d-none');
    //Get the acceptForm for validation
    const acceptForm = $('#acceptForm');
    acceptForm.removeClass('was-validated');

    if (!acceptForm[0].checkValidity()) {
        acceptForm.addClass('was-validated');
        return;
    }

    const finalPrice = document.getElementById('finalSalePrice').value;
    const receiptId = document.getElementById('receiptID').value;
    const receiptDate = document.getElementById('receiptDate').value;
    const receiptImage = document.getElementById('receiptImage').files[0];

    //Create the transaction object
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

async function rejectTransaction(quoteId) {
    const errorAlert = $('#rejectErrorAlert');
    errorAlert.addClass('d-none');

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