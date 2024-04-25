document.addEventListener('DOMContentLoaded', async function () {
    //Get the elements from the DOM
    const $loadingCollapse = $('#classes_loadingCollapse');
    const $chartCollapse = $('#classes_chartCollapse');

    try {
        //Get the data from the server
        const response = await axios.get('/admin/reports/classes/chart');

        //Extract the data from the response
        const data = response.data;
        const classes_labels = data.labels;
        const classes_data = data.data;
        const classes_backgrounds = data.backgrounds;
        const classes_borderColours = data.borderColors;

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

        //Hide the loading collapse and show the chart collapse
        $loadingCollapse.collapse('hide');

        createChart('#classes_chart', classes_labels, classes_dataset, 'bar');

        $chartCollapse.collapse('show');
    } catch (e) {
        console.error(e);

        //Hide the loading collapse and show the error message
        $loadingCollapse.collapse('hide');
        $('#classes_errorCollapse').collapse('show');
    }
});