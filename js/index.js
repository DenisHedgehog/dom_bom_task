var regexForInuranceInput;

const insuranceTypeSelector = document.getElementsByClassName("insurance-form__selector")[0];
const numberInput = document.getElementById("input-insurance-number");
const consumerFio = document.getElementById("consumer-fio");
const insuranceDate = document.getElementById("insurance-date");
const prize = document.getElementById("prize-input");
const discountInput = document.getElementById("discount-input");
const submitButton = document.getElementById("submit-insurance-button");
const insurancesList = document.getElementById("insurances-table");
const clearButton = document.getElementById("clear-insurances-table");
var insuranceTypeSelected;

numberInput.disabled = true;
disableButton();
updateUI();
numberInput.addEventListener('input', isInputNumberValueValid);
numberInput.addEventListener('input', isFormFilled);
consumerFio.addEventListener('input', isFormFilled);
insuranceDate.addEventListener('input', isFormFilled);
prize.addEventListener('input', isFormFilled);
discountInput.addEventListener('input', isFormFilled);
submitButton.addEventListener('click', addInsurance);
clearButton.addEventListener('click', clearInsurances);

discountInput.addEventListener('input', function () {
    discountInput.value > 100 ? discountInput.value = 100 : {};
});

function setActiveInsuranceType(selected) {
    insuranceTypeSelected = selected.options[selected.selectedIndex].text;
    switch (insuranceTypeSelected) {
        case 'КАСКО':
            numberInput.disabled = false;
            regexForInuranceInput = /[0][0-4][0-9][aA][tT][-][0-2][0-9][/][0-9]{5}$/;
            numberInput.placeholder = '001AT-16/541268';
            break;
        case 'ОСАГО':
            numberInput.disabled = false;
            regexForInuranceInput = /[aAbBcCeExX][aAbBcCeExX][aAbBcCeExX][0-9]{10}$/;
            numberInput.placeholder = 'EEE0123456789';
            break;
        case 'ДАГО':
            numberInput.disabled = false;
            regexForInuranceInput = /[0][0-4][0-9][gG][oO][-][0-2][0-9][/][0-9]{5}$/;
            numberInput.placeholder = '001GO-16/21321';
            break;
        default:
            numberInput.disabled = true;
            numberInput.placeholder = '';
            break;
    }
    isInputNumberValueValid();
}

function isInputNumberValueValid() {
    if (regexForInuranceInput.test(numberInput.value)) {
        numberInput.classList.remove('insurance-form__input_invalid-number');
        numberInput.classList.add('insurance-form__input_valid-number');
        return true;
    } else {
        numberInput.classList.remove('insurance-form__input_valid-number');
        numberInput.classList.add('insurance-form__input_invalid-number');
        return false;
    }
}

function isNotEmpty(input) {
    return input.value.length > 0;
}

function disableButton() {
    submitButton.disabled = true;
    submitButton.classList.add('insurance-form__button_disabled');
}

function enableButton() {
    submitButton.disabled = false;
    submitButton.classList.remove('insurance-form__button_disabled');
}

function getInsurances() {
    return !localStorage.getItem('insurances') ? [] : JSON.parse(localStorage.getItem('insurances'));
}

function updateUI() {
    const insurances = getInsurances();
    insurancesList.innerHTML = `
    <tr>
                <td class="insurances-table__header-item">Тип</td>
                <td class="insurances-table__header-item">Номер</td>
                <td class="insurances-table__header-item">Страхователь</td>
                <td class="insurances-table__header-item">Дата продажи</td>
                <td class="insurances-table__header-item">Страховая премия(руб.)</td>
                <td class="insurances-table__header-item">Скидка(%)</td>
                <td class="insurances-table__header-item">Удаление</td>
            </tr>`;
    insurances.forEach(element => {
        const el = document.createElement('tr');
        el.classList.add('insurances-table__item');
        el.addEventListener('click', removeInsurance);
        el.innerHTML = `
            <td class="insurances-table__item">${element.insuranceType}</td>
            <td class="insurances-table__item">${element.insuranceNumber}</td>
            <td class="insurances-table__item">${element.insuranceConsumer}</td>
            <td class="insurances-table__item">${element.insuranceSaleDate}</td>
            <td class="insurances-table__item">${element.prize}</td>
            <td class="insurances-table__item">${element.discount}</td>
            <td class="insurances-table__item">
                <a href="#" class="insurance-table__delete-item">
                    Удалить
                </a>
            </td>
    `;
        insurancesList.appendChild(el);
    });
}

function addInsurance(e) {
    const insurances = getInsurances();
    console.log(getInsurances());
    insurances.push({
        insuranceNumber: numberInput.value,
        insuranceType: insuranceTypeSelected,
        insuranceConsumer: consumerFio.value,
        insuranceSaleDate: insuranceDate.value,
        prize: prize.value,
        discount: discountInput.value
    });
    localStorage.setItem('insurances', JSON.stringify(insurances));
    updateUI();
    e.preventDefault();
}

function removeInsurance(e) {
    const removeId = Array.from(e.target.parentNode.parentNode.parentNode.children).indexOf(e.target.parentNode.parentNode);
    console.log(e.target.parentNode.parentNode.parentNode.children);
    console.log(e.target.parentNode.parentNode);
    const insurances = getInsurances();
    if (removeId === 1) {
        insurances.shift();
    } else {
        insurances.splice(removeId - 1, removeId - 1);
    }
    localStorage.setItem('insurances', JSON.stringify(insurances));
    updateUI();
}

function clearInsurances() {
    localStorage.setItem('insurances', JSON.stringify([]));
    updateUI();
}

function isFormFilled() {
    (
        isInputNumberValueValid() &&
        isNotEmpty(consumerFio) &&
        isNotEmpty(prize) &&
        isNotEmpty(discountInput) &&
        isNotEmpty(insuranceDate)
    ) ?
        enableButton() :
        disableButton();
}