
document.addEventListener('DOMContentLoaded', async function () {
    //Get the elements from the DOM
    const $loadingCollapse = $('#loadingCollapse')
    const $tableCollapse = $('#tableCollapse')
    const $errorCollapse = $('#errorCollapse')

    try {
        //Get the data from the server
        const response = await axios.get('/admin/reports/quotes/table');

        const data = response.data
        const table = data.table;

        let html = "";
        table.forEach((item) => {
            const row = `
                <tr>
                    <td>${item.date_added}</td>
                    <td>
                        <a href="/admin/accounts/${item.user?._id}">
                            ${item.user?.first_name} ${item.user?.last_name}
                        </a>
                    </td>
                    <td>
                        <a href="/admin/devices/${item.quote_id}">
                            ${item.name}
                        </a>
                    </td>
                    <td class="d-flex align-content-center justify-content-center">
                        ${item.provider !== "Unknown provider" 
                            ? `<img src="${item.logo}" class="img-fluid w-auto h-auto" style="max-width: 100px; max-height: 75px">` 
                            : `<p class="text-muted">${item.provider}</p>`}
                    </td>
                    <td>
                        <p class="w-100 h-100 badge bg-${item.state_colour}">
                            ${item.state_string}
                        </p>
                    </td>
                </tr>`;

            html += row;
        });

        $('#quotes_table tbody').html(html);

        //Hide the loading collapse and show the table collapse
        $loadingCollapse.collapse('hide');

        $tableCollapse.on('shown.bs.collapse', function () {
            $('#quotes_table').DataTable({

            });
        });

        $tableCollapse.collapse('show');
    } catch (e) {
        console.error(e);

        //Hide the loading collapse and show the error message
        $loadingCollapse.collapse('hide');
        $errorCollapse.collapse('show');
    }
});