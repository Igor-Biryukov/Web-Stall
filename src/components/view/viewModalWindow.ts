import { IEvents, IViewModalWindow } from '../../types/indexTypes';
import { ensureElement } from '../../utilites/utiltes';
import { ViewModel } from '../common/viewModel';

export class ViewModalWindow
	extends ViewModel<IViewModalWindow> implements IViewModalWindow
{
	private closeButton: HTMLButtonElement;
	private modalContent: HTMLElement;

	constructor(private events: IEvents, container: HTMLElement) {
		super(container);

		this.closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			container
		);
		this.modalContent = ensureElement<HTMLElement>(
			'.modal__content',
			container
		);

		this.closeButton.addEventListener('click', this._handleCloseClick);
	}

	set content(container: HTMLElement) {
		this.modalContent.replaceChildren(container);
	}

	private _handleCloseClick = (event: MouseEvent): void => {
		this.closeModal();
	};

	private _handleEscapeKey = (event: KeyboardEvent): void => {
		if (event.key === 'Escape') {
			this.closeModal();
		}
	};

	private _handleOverlayClick = (event: MouseEvent): void => {
		if (event.target === this.container) {
			this.closeModal();
		}
	};

	openModal(): void {
		this.container.classList.add('modal_active');
		document.addEventListener('keydown', this._handleEscapeKey);
		this.container.addEventListener('click', this._handleOverlayClick);
		this.events.emit('openModal');
	}

	closeModal(): void {
		this.container.classList.remove('modal_active');
		this.modalContent.replaceChildren();
		document.removeEventListener('keydown', this._handleEscapeKey);
		this.container.removeEventListener('click', this._handleOverlayClick);
		if (document.activeElement instanceof HTMLElement) {
			document.activeElement.blur();
		}

		this.events.emit('closeModal');
	}

	render(content: Partial<IViewModalWindow>): HTMLElement {
		super.render(content);
		this.openModal();
		return this.modalContent;
	}
}
