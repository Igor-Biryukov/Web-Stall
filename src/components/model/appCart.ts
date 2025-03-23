import { IAppCart, IEvents, IItemData } from '../../types/indexTypes';

export class AppCart implements IAppCart {
	items: string[] = [];

	constructor(protected events: IEvents) {}

	isItemIn(item: IItemData): boolean {
		return this.isValidItem(item) && this.items.includes(item.id);
	}

	addItem(item: IItemData) {
		this.update(item.id, true);
	}

	removeItem(item: IItemData) {
		this.update(item.id, false);
	}

	clear() {
		this.items = [];
		this.events.emit('cart_updated', this.items);
	}

	private update(itemId: string, isAdding: boolean) {
		if (isAdding) {
			this.items.push(itemId);
		} else {
			this.items = this.items.filter((id) => id !== itemId);
		}

		this.events.emit('cart_updated', this.items);
	}

	private isValidItem(item: IItemData): boolean {
		return !!(item && item.id);
	}
}
