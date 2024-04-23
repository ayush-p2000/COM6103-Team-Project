const $table = $('#models_table')
const $loadingSpinner = $('#loading-spinner')
const $tableWrapper = $('#table-wrapper')
$(document).ready(function() {
    $table.DataTable( {
        "scrollY": '50vh',
        "scrollX": true,
        width: "100%"
    } );
    $loadingSpinner.hide()
    $tableWrapper.fadeIn()
    $table.DataTable().columns.adjust().draw();
} );

