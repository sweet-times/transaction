// Import Lists
import {
    productList,
    priceList
} from './format.js';

// Price Code List
function priceDropDown() {
    let priceCodeList = Object.keys(priceList);
    let selector = document.getElementById('priceCode');

    for (let i = 0; i < priceCodeList.length; i++) {
        let option = `<option value="${priceCodeList[i]}">${priceCodeList[i]}</option>`;
        selector.innerHTML += option;
    }
}

priceDropDown();

// Product List Table Content
function addRow(data) {
    let tableBody = document.getElementById('productListTable');

    for (let i = 0; i < data.length; i++) {
        let row = `
            <tr>
                <td>${data[i]}</td>
                <td>
                    <div class="wrapper">
                        <button class="counter" onclick="
                            let currentValue = parseInt(document.getElementById('${data[i]}').value);
                            let newValue = 0;
                            
                            if (currentValue > 0)
                                newValue = currentValue - 1;
                            else
                                newValue = currentValue;
                            
                            document.getElementById('${data[i]}').value = newValue;">
                            −
                        </button>
                        <input type="text" class="dataInput" id="${data[i]}" value="0">
                        <button class="counter" onclick="
                            let currentValue = parseInt(document.getElementById('${data[i]}').value);
                            let newValue = 0;
                            
                            if (currentValue < 999)
                                newValue = currentValue + 1;
                            else
                                newValue = currentValue;
                            
                            document.getElementById('${data[i]}').value = newValue;">
                            +
                        </button>
                    </div>
                </td>
                <td>
                    <span class="subtotal" id="${data[i]}Subtotal">
                        -
                    </span>
                </td>
            </tr>`

            tableBody.innerHTML += row;
    }
}

addRow(productList);

// Calculate Price Button On Click
// Create Temporary Text Area
function copyText(htmlElement) {
    let elementText = htmlElement.innerText;

    let textElement = document.createElement('textarea');
    //textElement.setAttribute('value', elementText);
    textElement.setAttribute('id', 'copyText')
    document.body.appendChild(textElement);
    document.getElementById('copyText').innerHTML = elementText;
    textElement.select();
    navigator.clipboard.writeText(document.getElementById('copyText').value);
    textElement.parentNode.removeChild(textElement);
}

// Assigning On Click Response
document.querySelector('#calc').onclick =
function() {
    // Validate Price Code Selection
    let priceCode = document.getElementById('priceCode').value;

    if (priceCode == 'Select') {
        alert('Please select customer price code.');
        return;
    }

    // Validate Number Inputs
    let priceObject = [];
    let validation = [];
    let total = 0;

    for (let i = 0; i < productList.length; i++) {
        let item = productList[i];
        let quantity = document.getElementById(item).value;
        
        // Validate Quantity Inputs
        let valid = Number.isInteger(parseInt(quantity));
        validation.push(valid);

        // Missing Price Alert
        let priceTag = priceList[priceCode][item];
        
        if (isNaN(priceTag) && quantity > 0) {
            alert(`Error: missing price for ${item}.`);

            console.log(priceList[priceCode]);

            // Price Manual Input
            priceTag = prompt(`Enter price for ${item}:`);

            while (true) {
                if (isNaN(priceTag) && quantity > 0) {
                    priceTag = prompt(`Please enter a valid number.`);
                    continue;
                } else {
                    break;
                }
            }                  
        }

        // Price Calculation
        let price = priceTag * quantity;

        // Price for Unpurchased Unlisted Products
        if (isNaN(price))
            price = 0;
        
        total += price;

        priceObject.push([item, quantity, price]);
    }

    // Validate Delivery Fee Input
    let deliveryFee = document.getElementById('deliveryFee').value;
    let deliveryFeeValidity = Number.isInteger(parseInt(deliveryFee));
    validation.push(deliveryFeeValidity);

    // Total Price Calculation including Delivery Fee
    const grandTotal = total + parseInt(deliveryFee); 

    // Alert for Number Inputs Validation
    if (validation.includes(false)) {
        alert('Please enter valid quantity and delivery fee');
        return;
    }

    // Format Total Price to IDR Function
    const rupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(number);
    }

    // Reformat IDR
    function formatIDR(currentIDR) {
        const displayedText = currentIDR.toString().slice(0, currentIDR.length - 2) + '-';
        return displayedText;
    }

    // Display Subtotal Price
    for (let i = 0; i < priceObject.length; i++) {
        const subtotalPrice = priceObject[i][2];

        // Display Unpurchased Item as None
        let subtotalPriceRupiah = 0;

        if (subtotalPrice == 0)
            subtotalPriceRupiah = '-';
        else
            subtotalPriceRupiah = rupiah(subtotalPrice);

        document.getElementById(priceObject[i][0] + 'Subtotal').innerHTML = subtotalPriceRupiah;
    }

    console.log(priceObject);

    // Display Total Price
    const totalRupiah = formatIDR(rupiah(total));

    console.log(totalRupiah);

    // Display Delivery Fee
    const deliveryFeeRupiah = formatIDR(rupiah(deliveryFee));

    console.log(deliveryFeeRupiah);

    // Display Grand Total
    const grandTotalRupiah = formatIDR(rupiah(grandTotal));
    document.getElementById('totalPrice').innerHTML = grandTotalRupiah;

    console.log(grandTotalRupiah);

    // Copy Message to Clipboard
    document.getElementById('message').innerHTML =
`Total pemesanan ${totalRupiah}<br>
Ongkos kirim ${deliveryFeeRupiah}<br>
*Total ${grandTotalRupiah}*<br><br>
        
Untuk pembayaran silahkan transfer ke:<br>
BCA 3191954431<br>
Harijono<br><br>
        
Terima kasih atas pemesanan produk *Sweet Times*`
    copyText(document.querySelector('#message'));

    alert('Message has been copied to clipboard.');
}