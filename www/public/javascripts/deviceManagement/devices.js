document.addEventListener('DOMContentLoaded', function () {
    $('#devices_management').DataTable({
        "processing": true,
    });
});

function openDeviceDataRetrievalModal(device_id) {
    $('#deviceDataRetrievalModal').modal('show');
}