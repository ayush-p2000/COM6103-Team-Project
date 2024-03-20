
document.addEventListener("DOMContentLoaded", function() {

    const acceptBtn = document.getElementById('accept-quote')
    const rejectBtn = document.getElementById('reject-quote')
    const starBtn = document.getElementById('star-quote')
    const quoteState = document.getElementById('quoteState')

    const deviceRecycle = document.getElementById('stateYes')
    const dataService = document.getElementById('serviceYes')

    const model = document.getElementById('modelName')
    const deviceStateBadge = document.getElementById('stateBadge')

    const checkBtn = document.getElementById('checkBtn')

    let form

    var url = window.location.href
    var parts = url.split('/')
    var id = parts[parts.length-1]

    acceptBtn.addEventListener('click', () => {
        form = new FormData()
        form.append('state', 'ACCEPTED')
        updateQuote()
        quoteState.innerText = 'Accepted'
    })

    rejectBtn.addEventListener('click', () => {
        form = new FormData()
        form.append('state', 'REJECTED')
        updateQuote()
        quoteState.innerText = 'Rejected'
    })

    starBtn.addEventListener('click', () => {
        form = new FormData()
        form.append('state', 'SAVED')
        updateQuote()
        quoteState.innerText = 'Starred'
    })

    checkBtn.addEventListener('click', () => {
        let total
        if(deviceRecycle.checked) {
            total = 0
            if(dataService.checked) {
                total += 8.99
            }
            deviceStateBadge.parentNode.removeChild(deviceStateBadge)

            const formData = new FormData()
            formData.append('device', id)
            formData.append('model',model.innerText)
            formData.append('total', total)

            const form = document.createElement('form')
            form.method = 'GET';
            form.action = '/checkout'

            formData.forEach((value, key) => {
                const input = document.createElement('input')
                input.type = 'hidden'
                input.name = key
                input.value = value
                form.appendChild(input)
            })
            document.body.appendChild(form)
            form.submit()
        }

    })

    function updateQuote() {
        fetch(`/item/${id}`, {
            method: 'POST',
            body: form,
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                window.location.href = `/item/${id}`;
                return response.text()
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
})