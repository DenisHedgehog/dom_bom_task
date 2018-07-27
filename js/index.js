var reg = new RegExp('[0][0-4][0-9][aA][tT][-][0-2][0-9][/][0-9]{5}$');

const numberInput = document.getElementById("input-insurance-number");
console.log(numberInput);

numberInput.addEventListener("input", function () {
    // console.log(numberInput.value)
    if (!reg.test(numberInput.value)) {
        console.log(numberInput.value)
        numberInput.value = numberInput.value.slice(0, numberInput.value.length - 1);
    }
})