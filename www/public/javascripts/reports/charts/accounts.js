document.addEventListener('DOMContentLoaded', function () {
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
    console.log(accounts_dataset)

    createChart('#accounts_chart', accounts_labels, accounts_dataset, 'bar');
});

