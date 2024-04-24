document.addEventListener('DOMContentLoaded', async function () {
    //Get the elements from the DOM
    const $loadingCollapse = $('#accounts_loadingCollapse');
    const $chartCollapse = $('#accounts_chartCollapse');

    try {
        //Get the data from the server
        const response = await axios.get('/admin/reports/accounts/chart');

        //Extract the data from the response
        const data = response.data;
        const accounts_labels = data.labels;
        const accounts_data = data.data;
        const statuses_backgrounds = data.backgrounds;
        const statuses_borderColors = data.borderColors;

        //Create a bar chart with the given data
        const accounts_dataset = [
            {
                label: 'Active Accounts',
                data: accounts_data,
                backgroundColor: statuses_backgrounds,
                borderColor: statuses_borderColors,
                borderWidth: 1,
                lineTension: 0,
            }
        ];

        //Hide the loading collapse and show the chart collapse
        $loadingCollapse.collapse('hide');

        createChart('#accounts_chart', accounts_labels, accounts_dataset, 'bar');

        $chartCollapse.collapse('show');

    } catch (e) {
        console.error(e);

        //Hide the loading collapse and show the error message
        $loadingCollapse.collapse('hide');
        $('#accounts_errorCollapse').collapse('show');
    }
});

