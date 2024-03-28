document.addEventListener('DOMContentLoaded', function () {
    //Create a bar chart with the given data
    const classes_dataset = [
        {
            label: 'Classes',
            data: data,
            backgroundColor: backgrounds,
            borderColor: borderColours,
            borderWidth: 1,
            lineTension: 0,
        }
    ];

    createChart('#classes_chart', labels, classes_dataset, 'bar');
});