import { IViewModel } from '../../types/indexTypes';

export abstract class ViewModel<Type> implements IViewModel<Type> {
	protected constructor(protected readonly container: HTMLElement) {}

	public render(data?: Partial<Type>): HTMLElement {
		if (data) {
			Object.assign(this, data);
		}
		return this.container;
	}

	protected toggleClass(
		element: HTMLElement,
		className: string,
		state?: boolean
	): void {
		element.classList.toggle(className, state);
	}

	protected setTextContent(element: HTMLElement | null, value: unknown): void {
		if (element) {
			element.textContent = value != null ? `${value}` : '';
		}
	}
	protected setImage(
		element: HTMLImageElement,
		src: string,
		alt?: string
	): void {
		element.src = src;
		if (alt) {
			element.alt = alt;
		}
	}

	protected setDisabled(element: HTMLElement, state: boolean): void {
		element.toggleAttribute('disabled', state);
	}
}
