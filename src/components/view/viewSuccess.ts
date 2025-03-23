import {
	IClickHandler,
	IAppApiPostResponse,
	IViewSuccess,
} from '../../types/indexTypes';
import { ensureElement } from '../../utilites/utiltes';
import { ViewModel } from '../common/viewModel';

export class ViewSuccess
	extends ViewModel<IAppApiPostResponse>
	implements IViewSuccess
{
	protected closeButton: HTMLElement;
	protected totalPrice: HTMLElement;

	constructor(container: HTMLElement, handler?: IClickHandler) {
		super(container);

		this.closeButton = ensureElement<HTMLElement>(
			'.order-success__close',
			this.container
		);
		this.totalPrice = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);

		if (handler?.onClick) {
			this.closeButton.addEventListener('click', handler.onClick);
		}
	}

	set total(total: number | string) {
		this.setTextContent(this.totalPrice, `${total} sinapses paid`);
	}
}
