const QRCode = require("qrcode");

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