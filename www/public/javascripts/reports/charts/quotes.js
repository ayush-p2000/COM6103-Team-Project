document.addEventListener('DOMContentLoaded', function () {
    //Create a bar chart with the given data
    const quotes_dataset = [
        {
            label: 'States',
            data: quotes_data,
            backgroundColor: quotes_backgrounds,
            borderColor: quotes_borderColours,
            borderWidth: 1,
            lineTension: 0,
        }
    ];
    createChart('#quotes_chart', quotes_labels, quotes_dataset, 'bar');
});