// Import Databases
import {
    productList,
    priceList
} from './format.js';

// Import Functions
import {
    addRow,
    priceCodeDropDown,
    priceCodeValidation,
    quantityValidation,
    deliveryFeeValidation,
    orderConfirmation,
    missingPrice,
    totalPurchaseCalc,
    grandTotalCalc,
    formatIDR,
    copyToClipboard,
    subtotalCalc
} from './function.js';

// Test
function whatFunction() {
    console.log('test');
};

// Product List Table Content
addRow(productList);

// Price Code Drop Down
priceCodeDropDown(priceList);

// Calculate Button
const calcButton = document.getElementById('calc');
calcButton.addEventListener('click', function() {
    buttonClick()
});

function buttonClick() {
    // Get and Validate User Inputs
    // Price Code
    const priceCodeInput = priceCodeValidation(priceList);

    // Quantity
    const quantityInput = quantityValidation(productList);

    // Delivery Fee
    let deliveryFeeInput = deliveryFeeValidation();

    // Order Confirmation
    orderConfirmation(priceCodeInput, quantityInput);
    
    // Missing Price Alert and Input
    const finalPriceList = missingPrice(priceList, priceCodeInput, quantityInput);

    // Subtotal
    let subtotal = totalPurchaseCalc(quantityInput, finalPriceList)['Subtotal'];

    // Total Purchase
    let totalPurchase = totalPurchaseCalc(quantityInput, finalPriceList)['Total'];

    // Grand Total
    let grandTotal = grandTotalCalc(totalPurchase, deliveryFeeInput);

    // Format Price to IDR
    totalPurchase = formatIDR(totalPurchase);
    deliveryFeeInput = formatIDR(deliveryFeeInput);
    grandTotal = formatIDR(grandTotal);

    // Display Subtotal
    subtotalCalc(subtotal);

    // Display Grand Total
    document.getElementById('totalPrice').innerHTML = grandTotal;

    // Copy Message to Clipboard
    copyToClipboard(totalPurchase, deliveryFeeInput, grandTotal);
}
