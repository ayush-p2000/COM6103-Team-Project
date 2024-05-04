document.addEventListener('DOMContentLoaded', function () {
    $('#user_management').DataTable({

    });
})

/**
 * client side of creating a new user in User Management page
 * @author Koustav Muhuri
 */
document.addEventListener('DOMContentLoaded', function () {


    document.getElementById('submitUser').addEventListener('click', async function () {
        // Your code to handle form submission goes here
        const $errorMessage = $('.error-message');
        $errorMessage.addClass('d-none');

        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;
        const dateOfBirth = document.getElementById('dateOfBirth').value;
        const phone = document.getElementById('phone').value;
        const address_1 = document.getElementById('address_1').value;
        const address_2 = document.getElementById('address_2').value;
        const postcode = document.getElementById('postcode').value;
        const city = document.getElementById('city').value;
        const county = document.getElementById('county').value;
        const country = document.getElementById('country').value;
        const role = document.getElementById('role').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        const formData = new FormData();
        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        formData.append('email', email);
        formData.append('dateOfBirth', dateOfBirth);
        formData.append('phone', phone);
        formData.append('address_1', address_1);
        formData.append('address_2', address_2);
        formData.append('postcode', postcode);
        formData.append('city', city);
        formData.append('county', county);
        formData.append('country', country);
        formData.append('role', role);
        formData.append('password', password);
        formData.append('confirmPassword', confirmPassword);
        fetch('/admin/accounts/create', {
            method: 'POST',
            body: formData,
        })
            .then(response => {
                if(response.ok){
                    location.reload()
                }
                if (!response.ok) {
                    return response.text().then(error => {
                        $errorMessage.text(error);
                        $errorMessage.removeClass('d-none');
                    });

                }

            })
            .catch(error => console.error('Error:', error));
    });
});

/**
 * handle Toggle button
 * @author Koustav Muhuri
 */

document.getElementById('staffOnly').addEventListener('change', function() {
    const staffOnly = this.checked;
    const rows = document.querySelectorAll('#userTableBody tr');
    rows.forEach(row => {
        const roleCell = row.querySelector('td:nth-child(4)');
        if (staffOnly && roleCell.textContent.trim() !== 'Staff' && roleCell.textContent.trim() !== 'Admin') {
            row.style.display = 'none';
        } else {
            row.style.display = '';
        }
    });
});


