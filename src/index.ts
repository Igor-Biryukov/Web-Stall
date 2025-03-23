import { EventEmitter } from './components/common/events';
import { AppApi } from './components/common/appApi';
import { AppCart } from './components/model/appCart';
import { AppCustomer } from './components/model/appCustomer';
import { AppData } from './components/model/appData';
import { ViewCart } from './components/view/viewCart';
import { ViewItemCard } from './components/view/viewItemCard';
import { ViewMainPage } from './components/view/viewMainPage';
import { ViewModalWindow } from './components/view/viewModalWindow';
import { ViewOrderStepOne } from './components/view/viewOrderStepOne';
import { ViewOrderStepTwo } from './components/view/viewOrderStepTwo';
import { ViewSuccess } from './components/view/viewSuccess';
import { CDN_URL, API_URL } from './constants/constants';
import './scss/styles.scss';
import { ICustomerData, IItemData } from './types/indexTypes';
import { cloneTemplate, ensureElement } from './utilites/utiltes';

/* ------------------------------------------------------------------------------------------------------ */

const page = document.body;

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const cartTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderStOneTemplate = ensureElement<HTMLTemplateElement>('#order');
const orderStTwoTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const modalWindowElement = document.getElementById(
	'modal-container'
) as HTMLElement;

const appApi = new AppApi(CDN_URL, API_URL);
const events = new EventEmitter();
const appData = new AppData(events);
const appCart = new AppCart(events);
const appCustomer = new AppCustomer(events);

const modalWindow = new ViewModalWindow(events, modalWindowElement);
const viewMainPage = new ViewMainPage(page, events);
const viewCart = new ViewCart(cloneTemplate(cartTemplate), events);
const viewOrderStOne = new ViewOrderStepOne(
	cloneTemplate(orderStOneTemplate) as HTMLFormElement,
	events,
	{
		onClick: (event: MouseEvent, buttonName: string) => {
			events.emit('order.payment:changed', {
				field: 'payment',
				value: `${buttonName}`,
			});
		},
	}
);

const viewOrderStTwo = new ViewOrderStepTwo(
	cloneTemplate(orderStTwoTemplate),
	events
);

const success = new ViewSuccess(cloneTemplate(successTemplate), {
	onClick: () => {
		modalWindow.closeModal();
	},
});

/* =================================================================================================================*/

events.on('openModal', () => {
	viewMainPage.scrollLocked = true;
});

events.on('closeModal', () => {
	viewMainPage.scrollLocked = false;
});

/* ----------------------------------------------------------------*/

appApi
	.getItemsList()
	.then(appData.setItemList.bind(appData))
	.catch((err) => {
		console.error(err);
	});
/* -----------------------------------------------------------------*/

events.on('itemsList_updated', () => {
	viewMainPage.gallery = appData.itemsList.map((item) => {
		const cardElement = cloneTemplate(cardCatalogTemplate);
		const card = new ViewItemCard(cardElement, {
			onClick: () => events.emit('item_selected', item),
		});
		if (item.price) {
			card.price = item.price;
		} else {
			card.priceless = 'Priceless';
		}
		return card.render({
			category: item.category,
			title: item.title,
			image: item.image,
		});
	});
});

events.on('item_selected', (item: IItemData) => {
	appData.setItem(item);
});

events.on('item_updated', (item: IItemData) => {
	const cardPreview = new ViewItemCard(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			if (!appCart.isItemIn(item)) {
				appCart.addItem(item);
				cardPreview.inCartStatus = 'Already in cart';
			}
		},
	});

	modalWindow.render({
		content: cardPreview.render({
			category: item.category,
			title: item.title,
			image: item.image,
		}),
	});
	item.price
		? (cardPreview.price = item.price)
		: (cardPreview.priceless = 'Priceless');
	if (appCart.isItemIn(item)) cardPreview.inCartStatus = 'Already in cart';
});

events.on('cart_selected', () => {
	modalWindow.render({
		content: viewCart.render(),
	});
});

events.on('cart_updated', () => {
	viewMainPage.counter = appCart.items.length;

	viewCart.items = appCart.items.map((id, index) => {
		const item = appData.itemsList.find((item) => item.id === id);
		const card = new ViewItemCard(cloneTemplate(cardBasketTemplate), {
			onClick: () => appCart.removeItem(item),
		});

		if (item.price !== null) {
			card.price = item.price;
			viewCart.total = appData.getPrice(appCart.items);
		} else {
			card.priceless = 'Priceless';
		}

		card.index = (index + 1).toString();

		return card.render({
			title: item.title,
		});
	});
	if (!appData.isValid(appCart.items)) {
		viewCart.priceless = 'Priceless';
	} else {
		viewCart.total = appData.getPrice(appCart.items);
	}
	if (!appCart.items.length) viewCart.priceless = 'Cart is empty';
});

events.on('order:render', () => {
	appCustomer.clear();
	modalWindow.render({
		content: viewOrderStOne.render(),
	});
	viewOrderStOne.paymentAll = false;
});

events.on('order:submit', () => {
	modalWindow.render({
		content: viewOrderStTwo.render(),
	});
});

events.on(
	/^(order|contacts)\..*:changed$/,
	(data: { field: keyof ICustomerData; value: string }) => {
		appCustomer.setData(data.field, data.value);
	}
);

events.on(`customerData_updated`, () => {
	if (appCustomer.customerData.payment === 'card') {
		viewOrderStOne.setPaymentMethod('card', true);
	}
	if (appCustomer.customerData.payment === 'cash') {
		viewOrderStOne.setPaymentMethod('cash', true);
	}

	viewOrderStOne.address = appCustomer.customerData.address;
	viewOrderStTwo.email = appCustomer.customerData.email;
	viewOrderStTwo.phone = appCustomer.customerData.phone;
});

events.on('validation', (errors: Partial<ICustomerData>) => {
	const { payment, address, email, phone } = errors;
	viewOrderStOne.valid = !payment && !address;
	viewOrderStTwo.valid = !email && !phone;
	viewOrderStOne.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
	viewOrderStTwo.errors = Object.values({ email, phone })
		.filter((i) => !!i)
		.join('; ');
});

events.on('contacts:submit', () => {
	const composedOrder = {
		...appCustomer.customerData,
		items: appCart.items,
		total: appData.getPrice(appCart.items),
	};

	appApi
		.postOrder(composedOrder)
		.then((result) => {
			appCart.clear();
			modalWindow.render({
				content: success.render(result),
			});
		})
		.catch((err) => {
			console.log(err);
		});
});
