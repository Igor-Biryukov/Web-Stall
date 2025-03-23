import { IAppCustomer, ICustomerData, IEvents } from '../../types/indexTypes';

export class AppCustomer implements IAppCustomer {
	customerData: ICustomerData = {
		payment: '',
		email: '',
		phone: '',
		address: '',
	};

	validationErrors: Partial<Record<keyof ICustomerData, string>> = {};

	constructor(protected events: IEvents) {}

	setData(field: keyof ICustomerData, value: string) {
		this.customerData[field] = value;
		this.events.emit('customerData_updated', this.customerData);
		this.validateForm();
	}

	validateForm() {
		const errors: typeof this.validationErrors = {};

		if (!this.customerData.payment) {
			errors.payment = 'Select Payment Method ';
		}
		if (!this.customerData.address) {
			errors.address = 'Enter delivery address  ';
		}
		if (!this.customerData.email) {
			errors.email = 'Enter E-mail ';
		}
		if (!this.customerData.phone) {
			errors.phone = 'Enter phone number ';
		}
		this.validationErrors = errors;
		this.events.emit('validation', errors);
		return Object.keys(errors).length === 0;
	}

	clear(): void {
		this.customerData = { payment: '', email: '', phone: '', address: '' };
		this.events.emit('order.payment:changed', { field: 'payment', value: '' });
		this.events.emit('order.address:changed', { field: 'address', value: '' });
		this.events.emit('contacts.phone:changed', { field: 'phone', value: '' });
		this.events.emit('contacts.email:changed', { field: 'email', value: '' });
	}
}
