import { apiEndpointSettings } from '../../constants/constants';
import {
	IItemData,
	IOrderData,
	IAppApiPostResponse,
	IAppApiGetResponse,
	IAppApi,
} from '../../types/indexTypes';
import { Api } from './api';

export class AppApi extends Api implements IAppApi {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string) {
		super(baseUrl);
		this.cdn = cdn;
	}

	getItemsList(): Promise<IItemData[]> {
		return this.get(apiEndpointSettings.itemsList).then(
			(data: IAppApiGetResponse) =>
				data.items.map((item) => ({
					...item,
					image: this.cdn + item.image,
				}))
		);
	}

	postOrder(order: IOrderData): Promise<IAppApiPostResponse> {
		return this.post(apiEndpointSettings.order, order).then(
			(data: IAppApiPostResponse) => data
		);
	}
}
