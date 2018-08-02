class Form {
    constructor() {
        this.findInputs();
        this.findSubmitButton();
        this.setListenerToInputs();
    }

    get formInputs() {
        return this._formInputs;
    }

    set formInputs(formInputs) {
        this._formInputs = formInputs;
    }

    get submitButton() {
        return this._submitButton;
    }

    set submitButton(submitButton) {
        this._submitButton = submitButton;
    }

    getFilledFormData() {
        return {
            insuranceType: this.formInputs[1].input.options[this.formInputs[1].input.selectedIndex].text,
            insuranceNumber: this.formInputs[0].input.value,
            insuranceConsumer: this.formInputs[2].input.value,
            insuranceSaleDate: this.formInputs[3].input.value,
            prize: this.formInputs[4].input.value,
            discount: this.formInputs[5].input.value
        }
    }

    findInputs() {
        this.formInputs = [];
        document.querySelectorAll('.insurance-form__input').forEach(input => {
            if (input.id !== 'input-insurance-number') {
                this.formInputs.push(new Input(input));
            } else {
                const numberImput = new InsuranceNumberInput(input);
                this.formInputs.push(numberImput);
                this.formInputs.push(new SelectInput(document.querySelectorAll('.insurance-form__selector')[0], numberImput));
            }
        });
    }

    findSubmitButton() {
        this.submitButton = document.getElementById('submit-insurance-button');
        this.submitButton.classList.add('insurance-form__button_disabled');
    }

    setListenerToInputs() {
        this._formInputs.forEach(input => {
            input.input.addEventListener('input', this.changeActivityState.bind(this));
            input.input.addEventListener('input', input.changeInputStyle.bind(null, input));
        });
    }

    isFilled() {
        for (var input of this.formInputs) {
            if (!input.isValid) {
                return false;
            }
        };
        return true;
    }

    changeActivityState() {
        this.isFilled() ? this.enableSubmitButton() : this.disableSubmitButton();
    }

    disableSubmitButton() {
        this.submitButton.disabled = true;
        this.submitButton.classList.add('insurance-form__button_disabled');
    }

    enableSubmitButton() {
        this.submitButton.disabled = false;
        this.submitButton.classList.remove('insurance-form__button_disabled');
    }
}

class Input {
    constructor(input) {
        this.input = input;
    }

    changeInputStyle(input) {
        input.isValid ?
            input.input.classList.remove('insurance-form__input_invalid-number') :
            input.input.classList.add('insurance-form__input_invalid-number');
    }

    get isValid() {
        return this.input.value.length > 0;
    }
}

class SelectInput extends Input {
    constructor(input, numberInput) {
        super(input);
        this.numberInput = numberInput;
        this.input.addEventListener('change', this.changeInsuranceType.bind(this));
    }

    changeInsuranceType() {
        this.numberInput.currentInsuranceType = this.input.options[this.input.selectedIndex].text;

    }

    get isValid() {
        return this.input.selectedIndex > 0;
    }
}

class InsuranceNumberInput extends Input {
    constructor(input) {
        super(input);
    }

    get currentInsuranceType() {
        return this._currentInsuranceType;
    }

    set currentInsuranceType(insuranceType) {
        this._currentInsuranceType = insuranceType;
        this.changeNumberInputPlaceholder(this.input, insuranceType);
    }

    changeNumberInputPlaceholder(input, selectedType) {
        switch (selectedType) {
            case 'КАСКО':
                input.placeholder = '001AT-16/541268';
                break;
            case 'ОСАГО':
                input.placeholder = 'EEE0123456789';
                break;
            case 'ДАГО':
                input.placeholder = '001GO-16/21321';
                break;
            default:
                input.placeholder = '';
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
    constructor() {
        this.table = document.getElementById('insurances-table');
        !localStorage.getItem('insurances') ? this.insurances = [] : this.insurances = JSON.parse(localStorage.getItem('insurances'));
        this.setClearTableButton();
        this.clearButton.addEventListener('click', this.clearTable.bind(this));
        this.updateTable();
    }

    get tableHeader() {
        const header = document.createElement('tr');
        header.classList.add('insurances-table__header-item');
        header.innerHTML = `
            <td class="insurances-table__item">Тип</td>
            <td class="insurances-table__item">Номер</td>
            <td class="insurances-table__item">Страхователь</td>
            <td class="insurances-table__item">Дата продажи</td>
            <td class="insurances-table__item">Премия (руб.)</td>
            <td class="insurances-table__item">Скидка (%)</td>
            <td class="insurances-table__item">Удаление</td>
        `
        return header;
    }

    get clearButton() {
        return this._clearButton;
    }

    set clearButton(clearButton) {
        this._clearButton = clearButton;
    }

    getInsuranceTableRow(insurance) {
        const row = document.createElement('tr');
        row.classList.add('insurances-table__item');
        row.innerHTML = `
            <td class="insurances-table__item">${insurance.insuranceType}</td>
            <td class="insurances-table__item">${insurance.insuranceNumber}</td>
            <td class="insurances-table__item">${insurance.insuranceConsumer}</td>
            <td class="insurances-table__item">${insurance.insuranceSaleDate}</td>
            <td class="insurances-table__item">${insurance.prize}</td>
            <td class="insurances-table__item">${insurance.discount}</td>
            <td class="insurances-table__item">
                <a href="#" class="insurance-table__delete-item">
                    Удалить
                </a>
            </td>
        `
        // .getElementsByClass('insurance-table__delete-item').addEventListener('click', this.removeInsurance)
        // console.log(row.lastElementChild.children[0].addEventListener('click', this.removeInsurance));
        row.lastElementChild.children[0].addEventListener('click', this.removeInsurance.bind(this));
        return row; 
    }

    updateTable() {
        this.table.innerHTML = '';
        this.table.appendChild(this.tableHeader);
        this.insurances.forEach(insurance => {
            this.table.appendChild(this.getInsuranceTableRow(insurance));
        });
    }

    clearTable() {
        this.insurances = [];
        localStorage.setItem('insurances', JSON.stringify(this.insurances));
        this.updateTable();
    }

    addInsurance(insurance) {
        console.log(insurance)
        this.insurances.push({
            insuranceType: insurance.insuranceType,
            insuranceNumber: insurance.insuranceNumber,
            insuranceConsumer: insurance.insuranceConsumer,
            insuranceSaleDate: insurance.insuranceSaleDate,
            prize: insurance.prize,
            discount: insurance.discount
        });
        localStorage.setItem('insurances', JSON.stringify(this.insurances));
        this.updateTable();
    }

    removeInsurance(e) {
        const removeId = Array.from(e.target.parentNode.parentNode.parentNode.children).indexOf(e.target.parentNode.parentNode);
        console.log(removeId)
        if (removeId === 1) {
            this.insurances.shift();
        } else {
            this.insurances.splice(removeId - 1, 1);
        }
        console.log(removeId)
        localStorage.setItem('insurances', JSON.stringify(this.insurances));
        this.updateTable();
    }

    setClearTableButton() {
        this.clearButton = document.getElementById('clear-insurances-table');
    }
}

const form = new Form();
const table = new Table();
form.submitButton.addEventListener('click', () => table.addInsurance(form.getFilledFormData()));