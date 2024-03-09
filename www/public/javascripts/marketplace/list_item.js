
const conditionYes = document.getElementById('conditionYes');
const conditionNo = document.getElementById('conditionNo');
const conditionList = document.getElementById('detail-condition');

// Add Listener
conditionYes.addEventListener('change', function() {
    // Show further condition term if yes
    if (this.checked) {
        conditionList.classList.remove("d-block");
        conditionList.classList.add("d-none");
    }
});

conditionNo.addEventListener('change', function() {
    // hide further condition term if no
    if (this.checked) {
        conditionList.classList.remove("d-none");
        conditionList.classList.add("d-block");
    }
});

document.getElementById("deviceType").addEventListener("change", function() {
    // get selected type
    var selectedDeviceType = this.value;
    console.log(selectedDeviceType)

    // TODO: get request to get Brand

});

document.getElementById('itemImage').addEventListener('change', function(event) {
    const files = event.target.files; // get selected files
    const previewContainer = document.getElementById('imagePreview'); // 获取用于预览的容器元素

    // clear review
    previewContainer.innerHTML = '';

    // append image file to review container
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        // call back to append img
        reader.onload = function() {
            var templateString = `<img src="${reader.result}" class="img-thumbnail col-2">`
            previewContainer.innerHTML += templateString;
        }

        // read file as url
        reader.readAsDataURL(file);
    }
});