document.addEventListener('DOMContentLoaded', function () {
    const sales_config_options = {
        scales: {
            y: {
                type: 'linear',
                display: true,
                position: 'left',
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                ticks: {
                    callback: function(value, index, values) {
                        return '£' + value;
                    }
                },
                // grid line settings
                grid: {
                    drawOnChartArea: false, // only want the grid lines for one axis to show up
                },
            },
        }
    }
    //Create a line chart with the given data
    const sales_dataset = [
        {
            label: 'Sales',
            data: sales_count_data,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            lineTension: 0,
            yAxisID: 'y',
        },

        {
            label: 'Value (£)',
            data: sales_value_data,
            backgroundColor: 'rgba(0,192,0,0.2)',
            borderColor: 'rgb(0,192,0)',
            borderWidth: 1,
            lineTension: 0,
            yAxisID: 'y1',
        }
    ];
    createChart('#sales_chart', sales_labels, sales_dataset, 'line', sales_config_options);
});