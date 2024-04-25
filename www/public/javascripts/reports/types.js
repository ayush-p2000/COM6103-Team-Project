

document.addEventListener('DOMContentLoaded', async function () {
    //Get the elements from the DOM
    const $loadingCollapse = $('#loadingCollapse')
    const $tableCollapse = $('#tableCollapse')
    const $errorCollapse = $('#errorCollapse')

    try {
        //Get the data from the server
        const response = await axios.get('/admin/reports/types/table');

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
                        ${item.device_type}
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
                </tr>
            `;
            html += row;
        });

        //Insert the data into the table
        $('#types_table tbody').html(html);

        //Show the table
        $loadingCollapse.collapse('hide')

        $tableCollapse.on('shown.bs.collapse', function () {
            $('#types_table').DataTable({

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