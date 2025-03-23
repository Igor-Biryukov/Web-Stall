import { ICustomerData, IEvents, IViewOrderStepTwo } from '../../types/indexTypes';
import { ViewOrderBase } from './viewOrderBase';

export class ViewOrderStepTwo extends ViewOrderBase<ICustomerData> implements IViewOrderStepTwo{
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}
}
