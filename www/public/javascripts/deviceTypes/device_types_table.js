const $table = $('#device_types_table')
const $loadingSpinner = $('#loading-spinner')
const $tableWrapper = $('#table-wrapper')
$(document).ready(function() {
    $table.DataTable( {
        "scrollY": '50vh',
    });
    $loadingSpinner.hide()
    $tableWrapper.fadeIn()
    $table.DataTable().columns.adjust().draw()
} );

