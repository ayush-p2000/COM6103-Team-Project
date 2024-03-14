// Get all the checkboxes
const checkboxes = document.querySelectorAll('.btn-check');

const clearFiltersBtn = document.getElementById('clearFiltersBtn');

// Add event listener to the clear filters button
clearFiltersBtn.addEventListener('click', clearFilters);
// Add event listener to each checkbox
checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', filterItems);
});

function filterItems() {
    // Get the checked checkboxes
    const checkedCheckboxes = document.querySelectorAll('.category-filter:checked');

    // Get all items
    const items = document.querySelectorAll('.card');


    if(checkedCheckboxes.length === 0) {
        items.forEach(item => {
            item.style.display = 'block';
        })
        return
    }

    items.forEach(item => {

        const itemCategory = item.querySelector('.category').textContent.replace('Classification: ', '')
        // Show items that match the checked states
        const match = Array.from(checkedCheckboxes).some(checkbox => itemCategory === checkbox.id)
            item.style.display = match ?'block':'none';
    });

}
function clearFilters() {
    // Uncheck all category checkboxes
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });

    // Show all items
    const items = document.querySelectorAll('.card');
    items.forEach(item => {
        item.style.display = 'block';
    });
}