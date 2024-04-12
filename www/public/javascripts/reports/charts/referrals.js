document.addEventListener('DOMContentLoaded', function () {
    const referrals_config_options = {
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
    //Create a bar chart with the given data
    const referrals_dataset = [
        {
            label: 'Referrals',
            data: referrals_count_data,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            lineTension: 0,
            yAxisID: 'y',
        },

        {
            label: 'Value (£)',
            data: referrals_value_data,
            backgroundColor: 'rgba(0,192,0,0.2)',
            borderColor: 'rgb(0,192,0)',
            borderWidth: 1,
            lineTension: 0,
            yAxisID: 'y1',
        }
    ];
    createChart('#referrals_chart', referrals_labels, referrals_dataset, 'line', referrals_config_options);
});
