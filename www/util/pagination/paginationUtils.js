exports.pagination = (model, page, itemCount = 10) => {
    // Checks if the page param is a number and is greater than 0.
    const re = new RegExp("^[1-9]\d*$");
    let current = 1;

    if (page && re.test(page)) {
        current = parseInt(page)
    }

    const start = current  > 1 ? current - 1: current;
    const end = current  > 1 ? current + 1: current + 2;
    return {data: model, currentPage:current, start, end}
}