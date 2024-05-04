/**
 * Deactivate or activate an user
 * @author Koustav Muhuri
 */
document.addEventListener('DOMContentLoaded', function () {
    const deactivateUser = document.getElementById('deactivateUser');
    const activateUser = document.getElementById('activateUser');

    // Function to handle user action (deactivate or activate)
    function handleUserAction(confirmMessage, endpoint) {
        const confirmation = confirm(confirmMessage);
        if (confirmation) {
            const formData = new FormData();
            const userId = document.getElementById('userId').value;

            formData.append('id', userId);

            fetch(endpoint, {
                method: 'POST',
                body: formData,
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response is not correct');
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

document.addEventListener('DOMContentLoaded', function () {
    const deleteUser = document.getElementById('deleteUser');

    // Function to handle user action
    function handleUserAction(confirmMessage, endpoint) {
        // Prompt user with confirmation message
        const isConfirmed = confirm(confirmMessage);
        if (isConfirmed) {
            const formData = new FormData();
            const userId = document.getElementById('userId').value;

            formData.append('id', userId);

            fetch(endpoint, {
                method: 'POST',
                body: formData,
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response is not correct');
                    }
                    window.location.href = '/admin/accounts';
                    return response.text();
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }


    }

    // Call handleUserAction function when deleteUser is clicked
    deleteUser.addEventListener('click', function () {
        handleUserAction("Are you sure you want to delete this user?", '/admin/deleteUser');
    });
});