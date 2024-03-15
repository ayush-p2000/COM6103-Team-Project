

document.addEventListener('DOMContentLoaded', function () {

    const deviceTypeSubmit = document.getElementById('deviceType-submit');
    const brandSubmit = document.getElementById('brand-submit');
    const modelSubmit = document.getElementById('model-submit');

    const deviceTypeName = document.getElementById('device-type-name');
    const deviceTypeDescription = document.getElementById('device-type-description');

    const brandName = document.getElementById('brand-name');

    deviceTypeSubmit.addEventListener("click", () =>{

        if (deviceTypeName.value === ""|| deviceTypeDescription.value===""){
            alert("Please Fill in All Fields!")
        }else{
            var formData = new FormData();
            formData.append('name', deviceTypeName.value);
            formData.append('description', deviceTypeDescription.value);

            for (var pair of formData.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }

            fetch('/admin/devices/postNewDeviceType', {
                method: 'POST',
                body: formData,
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    window.location.href = '/admin/devices/flagged';
                    return response.text();
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }


    })

    brandSubmit.addEventListener("click", () =>{
        if (brandName.value === ""){
            alert("Please Fill in All Fields!")
        }else{
            var formData = new FormData();
            formData.append('name', brandName.value);

            for (var pair of formData.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }

            fetch('/admin/devices/postNewBrand', {
                method: 'POST',
                body: formData,
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    window.location.href = '/admin/devices/flagged';
                    return response.text();
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
    })

    modelSubmit.addEventListener("click", () =>{

    })
})
