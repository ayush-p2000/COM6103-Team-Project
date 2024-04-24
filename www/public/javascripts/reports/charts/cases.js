document.addEventListener('DOMContentLoaded', async function () {
    //Get the elements from the DOM
    const $loadingCollapse = $('#cases_loadingCollapse');
    const $chartCollapse = $('#cases_chartCollapse');

    try {
        //Get the data from the server
        const response = await axios.get('/admin/reports/cases/chart');

        //Extract the data from the response
        const data = response.data;
        const cases_labels = data.labels;
        const cases_data = data.data;
        const cases_backgrounds = data.backgrounds;
        const cases_borderColours = data.borderColors;

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

        //Hide the loading collapse and show the chart collapse
        $loadingCollapse.collapse('hide');

        createChart('#cases_chart', cases_labels, cases_dataset, 'bar');

        $chartCollapse.collapse('show');
    } catch (e) {
        console.error(e);

        //Hide the loading collapse and show the error message
        $loadingCollapse.collapse('hide');
        $('#cases_errorCollapse').collapse('show');
    }
});