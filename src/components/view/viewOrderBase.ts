import { IViewOrderBase, IEvents } from '../../types/indexTypes';
import { ensureElement } from '../../utilites/utiltes';
import { ViewModel } from '../common/viewModel';

export class ViewOrderBase<Type>
	extends ViewModel<IViewOrderBase>
	implements IViewOrderBase
{
	protected submitButton: HTMLButtonElement;
	protected errorField: HTMLElement;

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container);

		this.submitButton = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			this.container
		);
		this.errorField = ensureElement<HTMLElement>(
			'.form__errors',
			this.container
		);

		this.container.addEventListener('input', (evt: Event) => {
			const target = evt.target as HTMLInputElement;
			if (target) {
				this.onInputChange(target.name as keyof Type, target.value);
			}
		});

		this.container.addEventListener('submit', (evt: Event) => {
			evt.preventDefault();
			this.events.emit(`${this.container.name}:submit`);
		});
	}

	protected onInputChange(field: keyof Type, value: string) {
		this.events.emit(`${this.container.name}.${String(field)}:changed`, {
			field,
			value,
		});
	}

	set valid(value: boolean) {
		this.setDisabled(this.submitButton, !value);
	}

	set errors(value: string) {
		this.setTextContent(this.errorField, value);
	}

	render(inputs?: Partial<Type>) {
		super.render();
		Object.assign(this, inputs);
		return this.container;
	}
}
