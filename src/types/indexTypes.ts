/* ======================================================  BASE  ==============================================*/

export interface IApi {
	readonly baseUrl: string;
	readonly cdn?: string;
	readonly config?: RequestInit;
	get(uri: string): Promise<object>;
	post(uri: string, data: object, method?: ApiPostMethods): Promise<object>;
}

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IEvents {
	on<T extends object>(
		eventName: EventName,
		callback: (event: T) => void
	): void;
	off(eventName: EventName, callback: Subscriber): void;
	emit<T extends object>(eventName: string, data?: T): void;
	onAll(callback: (event: EmitterEvent) => void): void;
	offAll(): void;
	trigger<T extends object>(
		eventName: string,
		context?: Partial<T>
	): (event?: object) => void;
}

export type EventName = string | RegExp;
export type Subscriber = (event: unknown) => void;
export type EmitterEvent = {
	eventName: string;
	data: unknown;
};

export interface IViewModel<Type> {
	render(data?: Partial<Type>): HTMLElement;
}

/* ====================================================  APP API ==============================================*/

export interface IAppApi {
	getItemsList(): Promise<IItemData[]>;
	postOrder(order: IOrderData): Promise<IAppApiPostResponse>;
}

export type IAppApiGetResponse = {
	total: number;
	items: IItemData[];
};

export interface IAppApiPostResponse {
	id: string;
	total: number;
}

/* =====================================================  DATA ==============================================*/

export interface IAppData {
	itemsList: IItemData[];
	Item: IItemData;
	setItemList(items: IItemData[]): void;
	setItem(item: IItemData): void;
	isValid(itemIds: string[]): boolean;
	getPrice(itemIds: string[]): number;
}

export interface IItemData {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

export interface IAppCart {
	items: string[];
	isItemIn(item: IItemData): boolean;
	addItem(item: IItemData): void;
	removeItem(item: IItemData): void;
	clear(): void;
}

export interface IAppCustomer {
	customerData: ICustomerData;
	validationErrors: Partial<Record<keyof ICustomerData, string>>;
	setData(field: keyof ICustomerData, value: string): void;
	clear(): void;
	validateForm(): boolean;
}

export interface ICustomerData {
	payment: string;
	email: string;
	phone: string;
	address: string;
}

export interface IOrderData extends ICustomerData {
	items: string[];
	total: number;
}

/* =====================================================  VIEW ============================================== */
export interface IViewCart {
	items: HTMLElement[];
	total: number;
	priceless: string;
}

export interface IViewItemCard {
	title: string;
	category: string;
	image: string;
	description: string;
	price: number;
	priceless: string;
	button: string;
	inCartStatus: string;
	index: string;
}

export interface IViewMainPage {
	gallery: HTMLElement[];
	counter: number;
	scrollLocked: boolean;
}

export interface IViewModalWindow {
	content: HTMLElement;
	openModal(): void;
	closeModal(): void;
	render(state: Partial<IViewModalWindow>): HTMLElement;
}

export interface IViewOrderBase {
	errors: string;
	valid: boolean;
}

export interface IViewOrderStepOne extends IViewOrderBase {
	address: string;
	setPaymentMethod(method: 'card' | 'cash', flag: boolean): void;
	paymentAll: boolean;
}

export interface IViewOrderStepTwo extends IViewOrderBase {
	phone: string;
	email: string;
}

export interface IViewSuccess {
	total: number | string;
}

export interface IClickHandler {
	onClick: (event: MouseEvent, buttonName?: string) => void;
}
