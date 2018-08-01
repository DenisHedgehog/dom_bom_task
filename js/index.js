class Form {
    constructor(element) {
        this.element = element;
    }

    get formInputs() {
        return this._formInputs;
    }

    set formInputs(formInputs) {
        console.log(formInputs);
        this._formInputs = formInputs;
    }

    addInput(input) {
        // console.log(!(this.formInputs instanceof Array));
        if (!(this.formInputs instanceof Array)) {
            this.formInputs = [];
        } 
        this.formInputs.push(input);
    }

    isFilled() {
        console.log(this);
        this.formInputs.forEach(input => {
            if (!input.isValid) {
                return false;
            }
        });
        return true;
    }
}

class Input {
    constructor(input, submit, form) {
        this.input = input;
        const isFilled = form.isFilled().bind(this);
        console.log(form);
        this.input.addEventListener('input', this.changeInputStyle.bind(this));
        this.input.addEventListener('input', submit.changeActivityState);
    }

    changeInputStyle() {
        this.isValid ? 
            this.input.classList.remove('insurance-form__input_invalid-number') :
            this.input.classList.add('insurance-form__input_invalid-number');
    }

    get isValid() {
        return this.input.value.length > 0;
    }
}

class SelectInput extends Input {
    constructor(input, submit, form) {
        super(input, submit, form);
        this.input.addEventListener('change', this.changeInsuranceType.bind(this));
    }

    changeInsuranceType() {
        console.log(this.input.options[this.input.selectedIndex].text);
        this._currentInsuranceType = this.input.options[this.input.selectedIndex].text;

    }

    get isValid() {
        return this.input.selectedIndex > 0;
    }
}

class InsuranceNumberInput extends Input {
    constructor(input, submit, form) {
        super(input, submit, form);
    }

    get currentInsuranceType() {
        return this._currentInsuranceType;
    }

    set currentInsuranceType(insuranceType) {
        this._currentInsuranceType = insuranceType;
    }

    changeNumberInputPlaceholder() {
        switch (this.currentInsuranceType) {
            case 'КАСКО':
                this.input.placeholder = '001AT-16/541268';
                break;
            case 'ОСАГО':
                this.input.placeholder = 'EEE0123456789';
                break;
            case 'ДАГО':
                this.input.placeholder = '001GO-16/21321';
                break;
            default:
                this.input.placeholder = '';
                break;
        }
    }

    get currentInsuranceTypeRegex() {
        switch (this.currentInsuranceType) {
            case 'КАСКО':
                return /[0][0-4][0-9][aA][tT][-][0-2][0-9][/][0-9]{5}$/;
            case 'ОСАГО':
                return /[aAbBcCeExX][aAbBcCeExX][aAbBcCeExX][0-9]{10}$/;
            case 'ДАГО':
                return /[0][0-4][0-9][gG][oO][-][0-2][0-9][/][0-9]{5}$/;
            default:
                return /'/;
        }
    }

    get isValid() {
        return this.currentInsuranceTypeRegex.test(this.input.value);
    }
}

class Table {
    constructor(table, tableHeader) {
        this.table = table;
        this.tableHeader = tableHeader;
    }

    updateTable(insuranceRows) {
        this.table.innerHTML = '';
        this.table.appendChild(this.tableHeader);
        insuranceRows.array.forEach(insuranceRow => {
            this.table.appendChild(insuranceRow);
        });
    }
}

class InsuranceList {
    constructor() {
        !localStorage.getItem('insurances') ? this.list = [] : this.list = JSON.parse(localStorage.getItem('insurances'));
    }

    get insuranceListRows() {

    }

    clear() {
        localStorage.setItem('insurances', JSON.stringify([]));
    }

    addInsurance(insurance) {
        list.push({
            insuranceType: insurance.type,
            insuranceNumber: insurance.number,
            insuranceConsumer: insurance.consumerFio,
            insuranceSaleDate: insurance.date,
            prize: insurance.prize,
            discount: insurance.discount
        });
        localStorage.setItem('insurances', JSON.stringify(insurances));
        updateUI();
        e.preventDefault();
    }

    removeInsurance(e) {
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
}

class TableRow {
    constructor(data) {
        this.data = data;
    }

    get row() {
        const row = document.createElement('tr');
        row.classList.add('insurances-table__item');
        row.innerHTML = `
            <td class="insurances-table__item">${data.insuranceType}</td>
            <td class="insurances-table__item">${data.insuranceNumber}</td>
            <td class="insurances-table__item">${data.insuranceConsumer}</td>
            <td class="insurances-table__item">${data.insuranceSaleDate}</td>
            <td class="insurances-table__item">${data.prize}</td>
            <td class="insurances-table__item">${data.discount}</td>
            <td class="insurances-table__item">
                <a href="#" class="insurance-table__delete-item">
                    Удалить
                </a>
            </td>
        `
        return row;
    }
}

class TableHeader extends TableRow {
    constructor(row) {
        super(row);
    }

    get row() {
        return `
            <td class="insurances-table__item">Тип</td>
            <td class="insurances-table__item">Номер</td>
            <td class="insurances-table__item">Страхователь</td>
            <td class="insurances-table__item">Дата продажи</td>
            <td class="insurances-table__item">Премия (руб.)</td>
            <td class="insurances-table__item">Скидка (%)</td>
            <td class="insurances-table__item">Удаление</td>
        `;
    }
}

class Button {
    constructor(button) {
        this.button = button;
    }

    disableButton() {
        this.button.disabled = true;
        this.button.classList.add('insurance-form__button_disabled');
    }
    
    enableButton() {
        this.button.disabled = false;
        this.button.classList.remove('insurance-form__button_disabled');
    }

    changeActivityState(state) {
        state ? this.enableButton() : this.disableButton();
    }
}

const form = new Form(document.getElementById('insurance-form'));

const submitForm = new Button(document.getElementById('submit-insurance-button'));
const clearInsurances = new Button(document.getElementById('clear-insurances-table'));

// console.log(submitForm);

const insuranceType = new SelectInput(document.getElementById('select-insurance-type'), submitForm, form);
const insuranceNumber = new InsuranceNumberInput(document.getElementById('input-insurance-number'), submitForm, form);
const insuranceConsumerFio = new Input(document.getElementById('consumer-fio'), submitForm, form);
const insuranceDate = new Input(document.getElementById('insurance-date'), submitForm, form);
const insurancePrize = new Input(document.getElementById('prize-input'), submitForm, form);
const insuranceDiscount = new Input(document.getElementById('discount-input'), submitForm, form);

const insurancesList = document.getElementById('insurances-table');

form.addInput(insuranceType);
form.addInput(insuranceNumber);
form.addInput(insuranceConsumerFio);
form.addInput(insuranceDate);
form.addInput(insurancePrize);
form.addInput(insuranceDiscount);

console.log(form.formInputs)

// submitForm.changeActivityState(form);
submitForm.button.addEventListener('click', insurancesList.addInsurance);
clearInsurances.button.addEventListener('click', insurancesList.clearInsurances);

insuranceDiscount.input.addEventListener('input', function () {
    insuranceDiscount.input.value > 100 ? insuranceDiscount.input.value = 100 : {};
});