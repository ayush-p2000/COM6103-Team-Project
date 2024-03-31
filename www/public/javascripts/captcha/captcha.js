const form = document.getElementById("form")
const submitBtn = document.getElementById("submit-btn")
const spinner = document.getElementById("spinner")
let isCaptchaCheckFinished = false;
form.addEventListener('submit', e => {
    // Prevent submitting the form before the captcha check had finished.
    if(!isCaptchaCheckFinished){
        e.preventDefault()
    }
})
const executeCaptcha = (publicKey, actionName, hasFailedCaptcha) => {
    if(hasFailedCaptcha) return;

    grecaptcha.ready(function () {
        grecaptcha.execute(publicKey, {action: actionName})
            .then(function (token) {
                isCaptchaCheckFinished = true
                submitBtn.disabled = false
                submitBtn.textContent = actionName
                document.getElementById("token").value = token
            });
    });
}

