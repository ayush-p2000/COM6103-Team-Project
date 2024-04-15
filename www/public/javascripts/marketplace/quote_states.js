/**
 * quote_states.js
 * This file is used to change the states of a quote according to what the user needs
 * Also used to select if a user wants to recycle the device, and they can go to checkout
 * @author Vinroy Miltan Dsouza <vmdsouza1@sheffield.ac.uk>
 */
document.addEventListener("DOMContentLoaded", function () {

    const acceptButtons = document.querySelectorAll('.accept-quote')
    const rejectButtons = document.querySelectorAll('.reject-quote')
    const starButtons = document.querySelectorAll('.star-quote')

    const quoteStates = Array.from(document.querySelectorAll('.quote-state'))

    const deviceRecycle = document.getElementById('stateYes')
    const dataService = document.getElementById('serviceYes')

    const model = document.getElementById('modelName')
    const deviceStateBadge = document.getElementById('stateBadge')

    const checkoutButton = document.querySelector('.recycle-quote')

    let form

    var url = window.location.href
    var parts = url.split('/')
    var id = parts[parts.length - 1]

    acceptButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            form = new FormData()
            form.append('state', 'ACCEPTED')
            updateQuote()
            //Find the quote state element with data-quote-id equal to the data-quote-id of the button clicked from the quoteStates NodeList
            const quoteState = quoteStates.find(quoteState => quoteState.dataset.quoteId === btn.dataset.quoteId)
            quoteState.innerText = 'Accepted'
        })
    })

    rejectButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            form = new FormData()
            form.append('state', 'REJECTED')
            updateQuote()
            //Find the quote state element with data-quote-id equal to the data-quote-id of the button clicked from the quoteStates NodeList
            const quoteState = quoteStates.find(quoteState => quoteState.dataset.quoteId === btn.dataset.quoteId)
            quoteState.innerText = 'Rejected'
        })
    })

    starButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            form = new FormData()
            form.append('state', 'SAVED')
            updateQuote()
            //Find the quote state element with data-quote-id equal to the data-quote-id of the button clicked from the quoteStates NodeList
            const quoteState = quoteStates.find(quoteState => quoteState.dataset.quoteId === btn.dataset.quoteId)
            quoteState.innerText = 'Starred'
        })
    })

    checkoutButton.addEventListener('click', () => {
        let total
        if (deviceRecycle.checked) {
            total = 0
            const formData = new FormData()
            formData.append('id', id)
            formData.append('model', model.innerText)


            //Check if the data service button is checked, if not the device is for recycling
            if (dataService.checked) {
                total += 8.99
                formData.append('type', 'payment_retrieval')
            } else {
                formData.append('type', 'recycle')
            }
            deviceStateBadge.parentNode.removeChild(deviceStateBadge)

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