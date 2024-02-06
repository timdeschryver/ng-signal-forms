import { WritableSignal } from '@angular/core';
import { FormField } from './form-field';
import { FormGroup } from './form-group';

export type Primitives = string | number | boolean | Date | null | undefined;

export type FormFields = FormField | FormGroup;

export type FormFieldInputs = FormFields | Primitives;

export type FormGroupCreator<T = any> = Record<string, FormFieldInputs> | T[];

export type FormGroupCreatorOrSignal<T extends FormGroupCreatorOrSignal = any> =
  FormGroupCreator<T> | WritableSignal<FormGroup<T>[]>;

export type FormGroupFields<Fields extends FormGroupCreatorOrSignal> = {
  [K in keyof Fields]: Fields[K] extends Primitives
    ? FormField<Fields[K]>
    : Fields[K] extends FormGroup<infer G>
    ? G extends unknown[]
      ? FormGroup<WritableSignal<G[0][]>>
      : Fields[K]
    : Fields[K];
};

export type UnwrappedFormGroup<Fields> = {
  [K in keyof Fields]: Fields[K] extends FormField<infer V>
    ? V
    : Fields[K] extends FormGroup<infer G>
    ? UnwrappedFormGroup<G>
    : never;
};
