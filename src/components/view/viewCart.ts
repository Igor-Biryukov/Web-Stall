import { IViewCart, IEvents } from '../../types/indexTypes';
import { ensureElement } from '../../utilites/utiltes';
import { ViewModel } from '../common/viewModel';

export class ViewCart extends ViewModel<IViewCart> implements IViewCart {
	protected cartList: HTMLElement;
	protected cartTotal: HTMLElement;
	protected cartButton: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this.cartList = ensureElement<HTMLElement>('.basket__list', this.container);
		this.cartTotal = this.container.querySelector('.basket__price');
		this.cartButton = this.container.querySelector('.basket__button');

		this.cartButton.disabled = true;
		this.cartButton.addEventListener('click', () => {
			this.events.emit('order:render');
		});

		this.priceless = 'Cart is emty';
	}

	set items(items: HTMLElement[]) {
		this.cartList.replaceChildren(...items);
		this.setDisabled(this.cartButton, false);
	}

	set total(total: number) {
		this.setTextContent(this.cartTotal, `${total} sinapses`);
	}

	set priceless(value: string) {
		this.setTextContent(this.cartTotal, value);
		this.setDisabled(this.cartButton, true);
	}
}
