import { get, writable, type Writable } from 'svelte/store';

export namespace ciu {
	export type UpdatedValues<T> = {
		oldValue: T;
		newValue: T;
	};
	export type Value = string | number | undefined | null;
	export type ValueOrWritable = Value | Writable<Value>;
	export type DisplayCallback = (item: Value) => Value;
	export const getUpdatedValues = <T>(e: CustomEvent) => {
		return e.detail.updatedValues as UpdatedValues<T>;
	};
	export const getCurrent = (value: ciu.ValueOrWritable): ciu.Value => {
		const returnValue =
			typeof value === 'string' || typeof value === 'number' || !value ? value : get(value);
		return returnValue;
	};
	export class CustomInputClass {
		isEditing = writable<boolean>(false);
		id: string;

		constructor(id: string) {
			this.id = id;
		}
	}
	export type CustomInputElement = CustomInputClass | undefined;
}
