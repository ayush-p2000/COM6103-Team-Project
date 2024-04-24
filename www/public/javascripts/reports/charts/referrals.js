document.addEventListener('DOMContentLoaded', async function () {
    //Get the elements from the DOM
    const $loadingCollapse = $('#referrals_loadingCollapse');
    const $chartCollapse = $('#referrals_chartCollapse');

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

    try {
        //Get the data from the server
        const response = await axios.get('/admin/reports/referrals/chart');

        //Extract the data from the response
        const data = response.data;
        const referrals_labels = data.labels;
        const referrals_count_data = data.datasets[0];
        const referrals_value_data = data.datasets[1];

        //Create a line chart with the given data
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

        //Hide the loading collapse and show the chart collapse
        $loadingCollapse.collapse('hide');

        createChart('#referrals_chart', referrals_labels, referrals_dataset, 'line', referrals_config_options);

        $chartCollapse.collapse('show');
    } catch (e) {
        console.error(e);

        //Hide the loading collapse and show the error message
        $loadingCollapse.collapse('hide');
        $('#referrals_errorCollapse').collapse('show');
    }
});
