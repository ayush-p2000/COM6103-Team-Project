function createChart(id, labels, datasets, type, options = null) {
    const sales_chart = $(id)

    let chart_data = {
        type: type,
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    boxPadding: 3
                }
            },
            interaction: {
                mode: 'index',
                intersect: false,
            }

        },
    };

    if (options) {
        // Merge the options object with the chart_data object
        chart_data.options = Object.assign(chart_data.options, options);
    }

    const chart = new Chart(sales_chart, chart_data);
}