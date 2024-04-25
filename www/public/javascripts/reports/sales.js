/* globals Chart:false */

document.addEventListener('DOMContentLoaded', async function () {
    //Get the elements from the DOM
    const $loadingCollapse = $('#loadingCollapse')
    const $tableCollapse = $('#tableCollapse')
    const $errorCollapse = $('#errorCollapse')

    try {
        //Get the data from the server
        const response = await axios.get('/admin/reports/sales/table');

        const data = response.data
        const table = data.table;

        let html = "";
        table.forEach((item) => {
            const row = `
                <tr>
                    <td>${item.date}</td>
                    <td>
                        <a href="/admin/accounts/${item.user._id}">
                            ${item.user?.first_name} ${item.user?.last_name}
                        </a>
                    </td>
                    <td>
                        <a href="/admin/devices/${item.product._id}">
                            ${item.product?.brand?.name} ${item.product?.model?.name}
                        </a>
                    </td>
                    <td>${item.purchase_type === 1 ? 'Data Extension' : 'Retrieval'}</td>
                    <td>£${item.sale_value}</td>
                </tr>
            `;
            html += row;
        });

        //Insert the data into the table
        $('#sales_table tbody').html(html);

        //Show the table
        $loadingCollapse.collapse('hide')

        $tableCollapse.on('shown.bs.collapse', function () {
            $('#sales_table').DataTable({

            });
        });

        $tableCollapse.collapse('show')
    } catch (e) {
        //Hide the loading collapse and show the error collapse
        $loadingCollapse.collapse('hide')
        $errorCollapse.collapse('show')
    }
});