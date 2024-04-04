document.addEventListener('DOMContentLoaded', function () {
    const deactivateUser = document.getElementById('deactivateUser');
    const activateUser = document.getElementById('activateUser');

    // Function to handle user action (deactivate or activate)
    function handleUserAction(confirmMessage, endpoint) {
        const confirmation = confirm(confirmMessage);
        if (confirmation) {
            const formData = new FormData();
            const userId = document.getElementById('userId').value;
            const firstName = document.getElementById('firstName').value;
            const secondName = document.getElementById('lastName').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const addressFirst = document.getElementById('addressFirst').value;
            const addressSecond = document.getElementById('addressSecond').value;
            const postCode = document.getElementById('postCode').value;
            const city = document.getElementById('city').value;
            const country = document.getElementById('country').value;
            const role = document.getElementById('role').value;

            formData.append('id', userId);
            formData.append('firstName', firstName);
            formData.append('secondName', secondName);
            formData.append('email', email);
            formData.append('phone', phone);
            formData.append('addressFirst', addressFirst);
            formData.append('addressSecond', addressSecond);
            formData.append('postCode', postCode);
            formData.append('city', city);
            formData.append('country', country);
            formData.append('role', role);

            fetch(endpoint, {
                method: 'POST',
                body: formData,
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    window.location.href = '/admin/accounts';
                    return response.text();
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
    }
    console.log('deactivateUser:', deactivateUser);
    console.log('activateUser:', activateUser);
    // Event listener for deactivating a user
    if(deactivateUser) {
        deactivateUser.addEventListener("click", () => {
            handleUserAction("Are you sure you want to deactivate this user?", '/admin/deactivateUser');
        })
    }

    // Event listener for activating a user
    if(activateUser) {
        activateUser.addEventListener("click", () => {
            handleUserAction("Are you sure you want to activate this user?", '/admin/activateUser');
        })
    }
})