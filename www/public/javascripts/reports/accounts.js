document.addEventListener('DOMContentLoaded', async function () {
    //Get the elements from the DOM
    const $loadingCollapse = $('#loadingCollapse')
    const $tableCollapse = $('#tableCollapse')
    const $errorCollapse = $('#errorCollapse')

    try {
        //Get the data from the server
        const response = await axios.get('/admin/reports/accounts/table');

        const data = response.data
        const table = data.table;

        let html = "";
        table.forEach((item) => {
            const row = `
                <tr>
                    <td>${item.id}</td>
                    <td>${item.date_added}</td>
                    <td>
                        <a href="/admin/accounts/${item.id}">
                            ${item.name}
                        </a>
                    </td>
                    <td>
                        ${item.email}
                    </td>
                    <td>
                        <div class="w-100 badge bg-${item.role_colour}">
                            ${item.role_string}
                        </div>

                    </td>
                    <td>
                        <div class="w-100 badge bg-${item.active ? "success" : "danger"}">
                            ${item.active ? "Yes" : "No"}
                        </div>
                    </td>
                </tr>`;

            html += row;
        });

        $('#accounts_table tbody').html(html);

        //Hide the loading collapse and show the table collapse
        $loadingCollapse.collapse('hide');

        $tableCollapse.on('shown.bs.collapse', function () {
            $('#accounts_table').DataTable({

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