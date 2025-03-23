import { cardCategory } from '../../constants/constants';
import {
	IClickHandler,
	IItemData,
	IViewItemCard,
} from '../../types/indexTypes';
import { ensureElement } from '../../utilites/utiltes';
import { ViewModel } from '../common/viewModel';

export class ViewItemCard
	extends ViewModel<IItemData>
	implements IViewItemCard
{
	protected itemDescription?: HTMLElement;
	protected itemCategory?: HTMLElement;
	protected itemImage?: HTMLImageElement;
	protected button_?: HTMLButtonElement;
	protected itemTitle: HTMLElement;
	protected itemPrice: HTMLElement;
	protected indexInCart: HTMLElement;

	constructor(container: HTMLElement, action?: IClickHandler) {
		super(container);

		this.itemPrice = ensureElement<HTMLElement>('.card__price', this.container);
		this.itemTitle = ensureElement<HTMLElement>('.card__title', this.container);

		this.itemCategory = container.querySelector<HTMLElement>('.card__category');
		this.itemImage = container.querySelector<HTMLImageElement>('.card__image');
		this.button_ = container.querySelector<HTMLButtonElement>('.card__button');
		this.itemDescription = container.querySelector<HTMLElement>('.card__text');
		this.indexInCart = container.querySelector<HTMLElement>(
			'.basket__item-index'
		);
		action?.onClick &&
			(this.button_ ? this.button_ : container).addEventListener(
				'click',
				action.onClick
			);
	}

	set title(value: string) {
		this.setTextContent(this.itemTitle, value);
	}

	set category(value: string) {
		this.setTextContent(this.itemCategory, value);
		this.itemCategory.classList.add(cardCategory[value]);
	}

	set image(value: string) {
		this.setImage(this.itemImage, value, this.title);
	}

	set description(value: string) {
		this.setTextContent(this.itemDescription, value);
	}

	set price(value: number) {
		this.setTextContent(this.itemPrice, `${value} sinapses`);
	}

	set priceless(value: string) {
		this.setTextContent(this.itemPrice, value);
	}

	set button(value: string) {
		this.setTextContent(this.button_, value);
	}

	set inCartStatus(value: string) {
		this.setDisabled(this.button_, true);
		this.setTextContent(this.button_, value);
	}

	set index(value: string) {
		this.setTextContent(this.indexInCart, value);
	}
}
