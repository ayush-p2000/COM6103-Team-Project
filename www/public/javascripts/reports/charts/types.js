document.addEventListener('DOMContentLoaded', function () {
    //Create a bar chart with the given data
    const types_dataset = [
        {
            label: 'Device Count',
            data: types_data,
            backgroundColor: types_backgrounds,
            borderColor: types_border_colours,
            borderWidth: 1,
            lineTension: 0,
        }
    ];
    createChart('#types_chart', types_labels, types_dataset, 'bar');
});

