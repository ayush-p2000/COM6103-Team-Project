/* globals Chart:false */

document.addEventListener('DOMContentLoaded', async function () {
    //Get the elements from the DOM
    const $loadingCollapse = $('#loadingCollapse')
    const $tableCollapse = $('#tableCollapse')
    const $errorCollapse = $('#errorCollapse')

    try {
        //Get the data from the server
        const response = await axios.get('/admin/reports/classes/table');

        const data = response.data
        const table = data.table;

        let html = "";
        table.forEach((item) => {
            const row = `
                <tr>
                    <td>${item.date_added}</td>
                    <td>
                        <a href="/admin/users/${item.user?._id}">
                            ${item.user?.first_name} ${item.user?.last_name}
                        </a>
                    </td>
                    <td>
                        <a href="/admin/products/${item.device_id}">
                            ${item.name}
                        </a>
                    </td>
                    <td>
                        <p class="badge bg-${item.category_colour}">
                            ${item.category_string}
                        </p>
                    </td>
                    <td>
                        <p class="badge bg-${item.state_colour}">
                            ${item.state_string}
                        </p>
                    </td>
                </tr>`;

            html += row;
        });

        $('#classes_table tbody').html(html);

        //Hide the loading collapse and show the table collapse
        $loadingCollapse.collapse('hide');

        $tableCollapse.on('shown.bs.collapse', function () {
            $('#classes_table').DataTable({

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