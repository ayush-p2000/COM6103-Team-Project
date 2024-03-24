$(document).ready(() => {
    const modal = $("#qrModal");

    const modalImageContainer = $('#qrModalImageContainer');
    const modalImagerSpinner = $('#qrModalSpinner');
    const qrImage = $('#qrModalImage');

    //When the modal is hidden, reset the modal
    modal.on('hidden.bs.modal', () => {
        //Reset the modal
        qrImage.attr("src", "");
        modalImagerSpinner.collapse('show');
        modalImageContainer.collapse('hide');

    });
});

async function showQRModal(quoteId) {
    //Get the modal
    const modal = $("#qrModal");

    const modalImageContainer = $('#qrModalImageContainer');
    const modalImagerSpinner = $('#qrModalSpinner');
    const qrImage = $('#qrModalImage');

    //Show the modal
    modal.modal('show');

    //Get the QR code from the server
    const qrURL = `/qr/${quoteId}/generate`;

    try {
        const response = await axios.get(qrURL);
        qrImage.attr("src", response.data);

        setTimeout(() => {
            //Collapse the spinner
            modalImagerSpinner.collapse('hide');

            //Add a delay before showing the image container so the spinner has time to collapse
            //setTimeout(() => {
                //Show the image container
                modalImageContainer.collapse('show');
            //}, 500);

        }, 500);
    } catch (e) {
        console.error(e);
        modal.modal('hide');
    }
}