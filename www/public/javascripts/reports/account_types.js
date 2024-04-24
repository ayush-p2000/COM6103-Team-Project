document.addEventListener('DOMContentLoaded', async function () {
    //Get the elements from the DOM
    const $loadingCollapse = $('#loadingCollapse')
    const $tableCollapse = $('#tableCollapse')
    const $errorCollapse = $('#errorCollapse')

    try {
        //Get the data from the server
        const response = await axios.get('/admin/reports/account_types/table');

        const data = response.data
        const table = data.table;

        let html = "";
        table.forEach((item) => {
            const row = `
                <tr>
                    <td>${item.id}</td>
                    <td>${item.date_added}</td>
                    <td>
                        <a href="/admin/users/${item.id}">
                            ${item.name}
                        </a>
                    </td>
                    <td>
                        ${item.email}
                    </td>
                    <td>
                        ${item.role}
                    </td>
                    <td>
                        ${item.active ? "Yes" : "No"}
                    </td>
                </tr>`;

            html += row;
        });

        $('#account_types_table tbody').html(html);

        //Hide the loading collapse and show the table collapse
        $loadingCollapse.collapse('hide');

        $tableCollapse.on('shown.bs.collapse', function () {
            $('#account_types_table').DataTable({

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