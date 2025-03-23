export const API_URL: string = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL: string = `${process.env.API_ORIGIN}/content/weblarek`;

export const apiConfig = {
	headers: {
		'Content-Type': 'application/json',
	},
};

export const apiEndpointSettings: Record<string, string> = {
	itemsList: '/product',
	order: '/order',
};

export const cardCategory: Record<string, string> = {
	'софт-скил': 'card__category_soft',
	'хард-скил': 'card__category_hard',
	другое: 'card__category_other',
	дополнительное: 'card__category_additional',
	кнопка: 'card__category_button',
};
