import { IAppData, IEvents, IItemData } from '../../types/indexTypes';

export class AppData implements IAppData {
	protected itemsList_: IItemData[] = [];
	protected item_: IItemData;

	constructor(protected events: IEvents) {}

	get itemsList(): IItemData[] {
		return this.itemsList_;
	}

	get Item(): IItemData {
		return this.item_;
	}

	setItemList(items: IItemData[]) {
		this.itemsList_ = items;
		this.events.emit('itemsList_updated', this.itemsList_);
	}

	setItem(item: IItemData) {
		this.item_ = item;
		this.events.emit('item_updated', this.item_);
	}

	isValid(itemIds: string[]): boolean {
		return !itemIds.some((id) => {
			const item = this.itemsList_.find((item) => item.id === id);
			return item?.price === null;
		});
	}

	getPrice(itemIds: string[]): number {
		return itemIds.reduce((total, id) => {
			const item = this.itemsList_.find((item) => item.id === id);
			return total + (item && item.price !== null ? item.price : 0);
		}, 0);
	}
}
