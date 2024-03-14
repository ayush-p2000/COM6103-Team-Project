const executeCaptcha = (publicKey, actionName) => {
    grecaptcha.ready(function () {
        grecaptcha.execute(publicKey, {action: actionName})
            .then(function (token) {
                document.getElementById("submit-btn").addEventListener('click', () => {
                    document.getElementById("token").value = token
                })
            });
    });
}

