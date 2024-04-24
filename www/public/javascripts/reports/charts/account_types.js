document.addEventListener('DOMContentLoaded', async function () {
    //Get the elements from the DOM
    const $loadingCollapse = $('#accountTypes_loadingCollapse');
    const $chartCollapse = $('#accountTypes_chartCollapse');

    try {
        //Get the data from the server
        const response = await axios.get('/admin/reports/account_types/chart');

        //Extract the data from the response
        const data = response.data;
        const accounts_types_labels = data.labels;
        const accounts_types_data = data.data;
        const account_types_backgrounds = data.backgrounds;
        const account_types_borderColors = data.borderColors;

        //Create a bar chart with the given data
        const accounts_dataset = [
            {
                label: 'Account Types',
                data: accounts_types_data,
                backgroundColor: account_types_backgrounds,
                borderColor: account_types_borderColors,
                borderWidth: 1,
                lineTension: 0,
            }
        ];

        //Hide the loading collapse and show the chart collapse
        $loadingCollapse.collapse('hide');

        createChart('#account_types_chart', accounts_types_labels, accounts_dataset, 'bar');

        $chartCollapse.collapse('show');

    } catch (e) {
        console.error(e);

        //Hide the loading collapse and show the error message
        $loadingCollapse.collapse('hide');
        $('#accountTypes_errorCollapse').collapse('show');
    }
});

