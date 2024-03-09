exports.pagination = async (model, page, pageLimit = 10) => {
    // Checks if the page param is a number and is greater than 0.
    const re = new RegExp("^[1-9]\d*$");
    let current = 1;
    let lastPage = false;

    if (page && re.test(page)) {
        current = parseInt(page)
    }

    const start = current  > 1 ? current - 1: current;
    const end = current  > 1 ? current + 1: current + 2;

    const data = await model.find({}).skip(pageLimit * (current - 1)).limit(pageLimit+1);

    return {items:data, currentPage:current, start, end}
}