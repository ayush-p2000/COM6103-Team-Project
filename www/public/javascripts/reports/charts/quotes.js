document.addEventListener('DOMContentLoaded', async function () {
    //Get the elements from the DOM
    const $loadingCollapse = $('#quotes_loadingCollapse');
    const $chartCollapse = $('#quotes_chartCollapse');

    try {
        //Get the data from the server
        const response = await axios.get('/admin/reports/quotes/chart');

        //Extract the data from the response
        const data = response.data;
        const quotes_labels = data.labels;
        const quotes_data = data.data;
        const quotes_backgrounds = data.backgrounds;
        const quotes_borderColours = data.borderColors;

        //Create a bar chart with the given data
        const quotes_dataset = [
            {
                label: 'Quote Count',
                data: quotes_data,
                backgroundColor: quotes_backgrounds,
                borderColor: quotes_borderColours,
                borderWidth: 1,
                lineTension: 0,
            }
        ];

        //Hide the loading collapse and show the chart collapse
        $loadingCollapse.collapse('hide');

        createChart('#quotes_chart', quotes_labels, quotes_dataset, 'bar');

        $chartCollapse.collapse('show');
    } catch (e) {
        console.error(e);

        //Hide the loading collapse and show the error message
        $loadingCollapse.collapse('hide');
        $('#quotes_errorCollapse').collapse('show');
    }
});