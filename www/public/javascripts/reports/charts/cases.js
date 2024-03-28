document.addEventListener('DOMContentLoaded', function () {
    //Create a bar chart with the given data
    const cases_dataset = [
        {
            label: 'States',
            data: cases_data,
            backgroundColor: cases_backgrounds,
            borderColor: cases_borderColours,
            borderWidth: 1,
            lineTension: 0,
        }
    ];

    createChart('#cases_chart', cases_labels, cases_dataset, 'bar');
});