const form = document.getElementById("form")

const executeCaptcha = (publicKey, actionName) => {
    grecaptcha.ready(function () {
        grecaptcha.execute(publicKey, {action: actionName})
            .then(function (token) {
                form.addEventListener('submit', () => {
                    document.getElementById("token").value = token
                })
            });
    });
}

