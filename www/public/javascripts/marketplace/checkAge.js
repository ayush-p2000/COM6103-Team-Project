


function openBirthDateModal() {
    $('#birthDateModal').modal('show')
}

function submitBirthDate() {
    const birthday = $('#birthdate').val()
    fetch('/checkAge',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({birthday: birthday})
    }).then(response => {
        if(response.ok) {
            $('#ageWarning').addClass('d-none')
            window.location.href = '/auth/google'
        } else {
            $('#ageWarning').removeClass('d-none')
        }
    })
}