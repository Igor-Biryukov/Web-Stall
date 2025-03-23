import { IEvents, IViewMainPage } from '../../types/indexTypes';
import { ensureElement } from '../../utilites/utiltes';
import { ViewModel } from '../common/viewModel';
/*-----------------------------------------------------------------------------------------------*/

export class ViewMainPage
	extends ViewModel<IViewMainPage>
	implements IViewMainPage
{
	protected page: HTMLElement;
	protected pageGallery: HTMLElement;
	protected cart: HTMLElement;
	protected cartCounter: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this.page = ensureElement<HTMLElement>('.page__wrapper');
		this.pageGallery = ensureElement<HTMLElement>('.gallery');
		this.cart = ensureElement<HTMLElement>('.header__basket');
		this.cartCounter = ensureElement<HTMLElement>('.header__basket-counter');

		this.cart.addEventListener('click', () => {
			this.events.emit('cart_selected');
		});
	}

	set gallery(items: HTMLElement[]) {
		this.pageGallery.replaceChildren(...items);
	}

	set counter(index: number) {
		this.setTextContent(this.cartCounter, `${index ?? 0}`);
	}

	set scrollLocked(value: boolean) {
		this.toggleClass(this.page, 'page__wrapper_locked', value);
	}
}
