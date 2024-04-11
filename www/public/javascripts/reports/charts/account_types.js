document.addEventListener('DOMContentLoaded', function () {
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
    createChart('#account_types_chart', accounts_types_labels, accounts_dataset, 'bar');
});

