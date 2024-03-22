function filterTable() {
    const input = document.getElementById('filter').value.toUpperCase();
    const productList = document.getElementsByClassName('productName');

    for (let i = 0; i < productList.length; i++) {
        const itemName = productList[i].innerHTML;

        const elementTag = document.getElementById(itemName + 'Tag');
        
        if (itemName.toUpperCase().indexOf(input) > -1) {
            elementTag.style.display = '';
        } else {
            elementTag.style.display = 'none';
        }
    }
}

function clearFilter() {
    document.getElementById('filter').value = '';
    filterTable();
}