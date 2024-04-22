const $table = $('#models_table')
// $table.hide()
document.addEventListener('DOMContentLoaded', function () {
    $table.DataTable({
        processing: true
    });
})

$table.ready(() => {
    console.log("loaded")
    // $table.show()
}).then(() => $table.show())

