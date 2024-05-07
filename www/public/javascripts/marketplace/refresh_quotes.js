document.addEventListener('DOMContentLoaded', function () {
    const toastElList = document.querySelectorAll('.toast')
    const toastList = [...toastElList].map(toastEl => new bootstrap.Toast(toastEl, {}))

    const showToast = (id) => {
        //Get the toast element
        const toastEl = document.getElementById(id);
        //Get the toast instance
        const toast = bootstrap.Toast.getInstance(toastEl);

        if (toast) {
            //Show the toast
            toast.show();
        }
    }

//Get the refresh quotes button
    const refreshButton = $('#refreshButton');
    const refreshSpinner = $('#refreshSpinner');
    const successToastID = 'refreshSuccessToast';
    const errorToastID = 'refreshErrorToast';
    const refreshingToastID = 'refreshingToast';

//Add an event listener to the button
    refreshButton.click(async function () {
        try {
            //Show the spinner
            refreshSpinner.removeClass('d-none');
            refreshButton.addClass('disabled');

            //Show the refreshing toast
            showToast(refreshingToastID);

            //Send a request to the server to refresh the quotes
            const response = await axios.get(`/my-items/refresh_quotes/`);

            //Show the success toast
            showToast(successToastID);

            setTimeout(() => {
                location.reload();
            }, 2000);
        } catch (error) {
            console.error(error);
            //Show the error toast
            showToast(errorToastID);
        } finally {
            //Hide the spinner
            refreshButton.removeClass('disabled');
            refreshSpinner.addClass('d-none');
        }
    });
})
;