document.addEventListener('DOMContentLoaded', function () {
    //Create a bar chart with the given data
    const classes_dataset = [
        {
            label: 'Device Count',
            data: classes_data,
            backgroundColor: classes_backgrounds,
            borderColor: classes_borderColours,
            borderWidth: 1,
            lineTension: 0,
        }
    ];

    createChart('#classes_chart', classes_labels, classes_dataset, 'bar');
});