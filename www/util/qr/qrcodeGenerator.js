const QRCode = require("qrcode");

/**
 * Generate QR code for the given quoteId to the QR quote page
 * @param quoteId - The ID of the quote to generate the QR code for
 * @returns {Promise<string>} - The Data URL of the generated QR code
 * @author Benjamin Lister
 */
async function generateQR(quoteId) {
    const url = `${process.env.BASE_URL}:${process.env.PORT}/qr/${quoteId}`;

    const qr = await QRCode.toDataURL(url, {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        quality: 1,
        margin: 1
    });

    return qr;
}

module.exports = {
    generateQR
};