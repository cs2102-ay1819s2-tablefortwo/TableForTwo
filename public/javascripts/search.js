let checkSearch = () => {
    let search = document.getElementById('table_filter').value;
    if (!search || search === "") {
        event.preventDefault();
        event.stopPropagation();
    }
}
