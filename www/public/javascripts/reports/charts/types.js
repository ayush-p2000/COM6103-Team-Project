document.addEventListener('DOMContentLoaded', async function () {
    //Get the elements from the DOM
    const $loadingCollapse = $('#types_loadingCollapse');
    const $chartCollapse = $('#types_chartCollapse');

    try {
        //Get the data from the server
        const response = await axios.get('/admin/reports/types/chart');

        //Extract the data from the response
        const data = response.data;
        const types_labels = data.labels;
        const types_data = data.data;
        const types_backgrounds = data.backgrounds;
        const types_border_colours = data.borderColors;

        //Create a bar chart with the given data
        const types_dataset = [
            {
                label: 'Device Type',
                data: types_data,
                backgroundColor: types_backgrounds,
                borderColor: types_border_colours,
                borderWidth: 1,
                lineTension: 0,
            }
        ];

        //Hide the loading collapse and show the chart collapse
        $loadingCollapse.collapse('hide');

        createChart('#types_chart', types_labels, types_dataset, 'bar');

        $chartCollapse.collapse('show');
    } catch (e) {
        console.error(e);

        //Hide the loading collapse and show the error message
        $loadingCollapse.collapse('hide');
        $('#types_errorCollapse').collapse('show');
    }
});

