

export const parsePage = (currentPage) => {
    if (currentPage === 1) {
        return 0
    } else {
        return `${currentPage - 1}0`
    }
}