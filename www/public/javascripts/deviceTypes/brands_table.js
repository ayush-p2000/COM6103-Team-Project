const $table = $('#brands_table')
const $loadingSpinner = $('#loading-spinner')
const $tableWrapper = $('#table-wrapper')
$(document).ready(function() {
    $table.DataTable( {
        "scrollY": '50vh',
        "scrollX": true
    } );
    $loadingSpinner.hide()
    $tableWrapper.fadeIn()
    $table.DataTable().columns.adjust().draw();
} );

