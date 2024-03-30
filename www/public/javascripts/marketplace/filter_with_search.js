
/**
 * Handling the filter for Marketplace with search
 * @author Zhicong Jiang <zjiang34@sheffield.ac.uk>
 */


// Get all the checkboxes
const checkboxes = document.querySelectorAll('.btn-check');
const clearFiltersBtn = document.getElementById('clearFiltersBtn');
const searchInput = document.querySelector('#search-input')
searchInput.addEventListener("input", filterItems);

// Add event listener to the clear filters button
clearFiltersBtn.addEventListener('click', clearFilters);
// Add event listener to each checkbox
checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', filterItems);
});

function filterItems() {

    // Get the checked checkboxes
    const checkedClassification = document.querySelectorAll('.category-filter:checked');
    const checkedDeviceType = document.querySelectorAll('.deviceType-filter:checked');

    // Get all items
    const items = document.querySelectorAll('.item');

    items.forEach(item => {
        const itemDeviceType = item.querySelector('.deviceType').textContent.replace('Device Type: ', '').trim()
        const itemCategory = item.querySelector('.category').textContent.replace('Classification: ', '').trim()
        const itemName = item.querySelector('.modelName').textContent.trim().toLowerCase()

        var matchClassification = checkedClassification.length === 0 || Array.from(checkedClassification).some(checkbox => itemCategory === checkbox.id)
        var matchDeviceType = checkedDeviceType.length === 0 || Array.from(checkedDeviceType).some(checkbox => itemDeviceType === checkbox.id)
        var marchSearch = searchInput.value.trim() === "" || itemName.includes(searchInput.value.trim().toLowerCase())

        if (marchSearch){
            if ((matchClassification && matchDeviceType)){
                item.style.display = 'block';
            }else {
                item.style.display = 'none';
            }
        }else{
            item.style.display = 'none';
        }


    });

    if (checkedClassification.length === 0 && checkedDeviceType.length === 0 && searchInput.value.trim() === ""){
        clearFilters()
    }
}

function clearFilters() {
    // Uncheck all category checkboxes
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });

    searchInput.value = ""

    // Show all items
    const items = document.querySelectorAll('.item');
    items.forEach(item => {
        item.style.display = 'block';
    });
}