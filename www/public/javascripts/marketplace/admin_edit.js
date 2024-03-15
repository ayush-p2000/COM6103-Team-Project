document.addEventListener('DOMContentLoaded', function () {

    const deviceType = document.getElementById('deviceType')
    const deviceBrand = document.getElementById('deviceBrand')
    const deviceModel = document.getElementById('deviceModel')
    const deviceCategory = document.getElementById('deviceCategory');
    const conditionYes = document.getElementById('conditionYes');
    const conditionNo = document.getElementById('conditionNo');
    const conditionList = document.getElementById('detail-condition');
    const saveBtn = document.getElementById('saveBtn')
    const additionalInfo = document.getElementById('additionalInfo')

    const deviceState = document.getElementById('deviceState')
    const deviceVisible = document.getElementById('visibleYes')

    const displayYes = document.getElementById('displayYes')
    const touchscreenYes = document.getElementById('touchscreenYes')
    const bodyYes = document.getElementById('bodyYes')
    const batteryYes = document.getElementById('batteryYes')
    const cameraYes = document.getElementById('cameraYes')
    const btnYes = document.getElementById('btnYes')
    const functionalityYes = document.getElementById('functionalityYes')


    conditionYes.addEventListener('change', ()=> {
        // Show further condition term if yes
        if (conditionYes.checked) {
            displayYes.checked = true;
            touchscreenYes.checked = true;
            bodyYes.checked = true;
            batteryYes.checked = true;
            displayYes.checked = true;
            cameraYes.checked = true;
            btnYes.checked = true;
            conditionList.classList.remove("d-block");
            conditionList.classList.add("d-none")
        }
    });
    conditionNo.addEventListener('change', ()=> {
        // hide further condition term if no
        if (conditionNo.checked) {
            conditionList.classList.remove("d-none");
            conditionList.classList.add("d-block");
        }
    });


    saveBtn.addEventListener('click', () => {postDataToServer()})


    function postDataToServer() {

        const details = [
            { name: "functionnality", value: functionalityYes.checked? "Good" : "Bad" },
            { name: "button", value: btnYes.checked? "Good" : "Bad" },
            { name: "camera", value: cameraYes.checked? "Good" : "Bad" },
            { name: "battery", value: batteryYes.checked? "Good" : "Bad" },
            { name: "body", value: bodyYes.checked? "Good" : "Bad" },
            { name: "touchscreen", value: touchscreenYes.checked? "Good" : "Bad" },
            { name: "display", value: displayYes.checked? "Good" : "Bad" }
        ];

        var formData = new FormData();
        formData.append('model', deviceModel.value);
        formData.append('details', JSON.stringify(details));
        formData.append('category', deviceCategory.value);
        formData.append('good_condition', conditionYes.checked);
        formData.append('state', deviceState.value); // default to review when posted
        formData.append('additional_details', additionalInfo.value !== "" ? additionalInfo.value : "Not Provided");
        formData.append('visible', deviceVisible.checked);


        var url = window.location.href
        var parts = url.split('/')
        var id = parts[parts.length-1]

        console.log(id)

        fetch(`/admin/devices/${id}`, {
            method: 'POST',
            body: formData,
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                window.location.href = '/admin/devices';
                return response.text();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }


})