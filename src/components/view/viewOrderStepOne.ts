import {
	IClickHandler,
	ICustomerData,
	IEvents,
	IViewOrderStepOne,
} from '../../types/indexTypes';
import { ensureElement } from '../../utilites/utiltes';
import { ViewOrderBase } from './viewOrderBase';

/* ---------------------------------------------------------------------------------------------------------*/

export class ViewOrderStepOne
	extends ViewOrderBase<ICustomerData>
	implements IViewOrderStepOne
{
	protected cardButton: HTMLButtonElement;
	protected cashButton: HTMLButtonElement;

	constructor(
		container: HTMLFormElement,
		events: IEvents,
		action: IClickHandler
	) {
		super(container, events);

		this.cardButton = ensureElement<HTMLButtonElement>(
			'button[name="card"]',
			this.container
		);
		this.cashButton = ensureElement<HTMLButtonElement>(
			'button[name="cash"]',
			this.container
		);

		this.cardButton.addEventListener('click', (event: MouseEvent) => {
			action.onClick(event, this.cardButton.name);
		});

		this.cashButton.addEventListener('click', (event: MouseEvent) => {
			action.onClick(event, this.cashButton.name);
		});
	}

	setPaymentMethod(method: 'card' | 'cash', flag: boolean) {
		this.toggleClass(
			this.cardButton,
			'button_alt-active',
			method === 'card' ? flag : !flag
		);
		this.toggleClass(
			this.cashButton,
			'button_alt-active',
			method === 'cash' ? flag : !flag
		);
	}

	set paymentAll(flag: boolean) {
		this.toggleClass(this.cashButton, 'button_alt-active', flag);
		this.toggleClass(this.cardButton, 'button_alt-active', flag);
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}
}
