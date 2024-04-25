/* globals Chart:false */

document.addEventListener('DOMContentLoaded', async function () {
    //Get the elements from the DOM
    const $loadingCollapse = $('#loadingCollapse')
    const $tableCollapse = $('#tableCollapse')
    const $errorCollapse = $('#errorCollapse')

    try {
        //Get the data from the server
        const response = await axios.get('/admin/reports/referrals/table');

        const data = response.data
        const table = data.table;

        let html = "";
        table.forEach((item) => {
            const row = `
                <tr class="text-center">
                    <td>${item.date_of_referral}</td>
                    <td>
                        <a href="/admin/accounts/${item.user?._id}">
                            ${item.user?.first_name} ${item.user?.last_name}
                        </a>
                    </td>
                    <td>
                        <a href="/admin/devices/${item.product?._id}">
                            ${item.product?.brand?.name} ${item.product?.model?.name}
                        </a>
                    </td>
                    <td>
                        <p class="w-100 badge bg-${item.state_colour}">
                            ${item.state_string}
                        </p>
                    </td>
                    <td>£${item.referral_amount}</td>
                    <td>
                        <div class="d-inline-flex justify-content-center w-100">
                            <img src="${item.provider_logo}" alt="${item.provider}" class="img-fluid img-thumbnail mr-2 h-100" style="max-width: 100px;" >
                        </div>
                    </td>
                </tr>`;

            html += row;
        });

        $('#referrals_table tbody').html(html);

        //Hide the loading collapse and show the table collapse
        $loadingCollapse.collapse('hide');

        $tableCollapse.on('shown.bs.collapse', function () {
            $('#referrals_table').DataTable({

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