async function confirmTransaction(quoteId) {
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
    const receiptImage = document.getElementById('receiptImage').value;

    //Create the transaction object
    const confirmationDetails = {
        final_price: finalPrice,
        receipt_id: receiptId,
        receipt_date: receiptDate,
        receipt_image: receiptImage
    }

    //Send the transaction to the server
    try {
        const response = await axios.post(`/qr/${quoteId}/confirm`, confirmationDetails)

        //If the transaction was successful, close the modal and reload the page
        $(#confirmModal).modal('hide');
        location.reload();
    } catch (error) {
        console.error(error);
    }

}