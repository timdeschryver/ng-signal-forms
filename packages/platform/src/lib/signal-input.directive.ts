import {Directive, effect, inject, Input, OnInit} from '@angular/core';
import {NgModel} from '@angular/forms';
import {FormField} from './form-field';
import {SIGNAL_INPUT_MODIFIER, SignalInputModifier} from "./signal-input-modifier.token";

@Directive({
  selector: '[ngModel][formField]',
  standalone: true,
  host: {
    '(ngModelChange)': 'onModelChange($event)',
    '(blur)': 'onBlur()',
    '[class.control-valid]': 'this.formField?.state() === "VALID"',
    '[class.control-invalid]': 'this.formField?.state() === "INVALID"',
    '[class.control-pending]': 'this.formField?.state() === "PENDING"',
  },
})
export class SignalInputDirective implements OnInit {
  private readonly modifiers = inject(SIGNAL_INPUT_MODIFIER, {optional: true}) as SignalInputModifier[] | null;
  private readonly model = inject(NgModel);

  @Input() formField: FormField | null = null;

  onModelChange(value: unknown) {
    if (this.modifiers && this.modifiers.length === 1) {
      this.modifiers[0].onModelChange(value);
    } else if (this.formField) {
      this.formField.value.set(value);
    }
  }

  onBlur() {
    this.formField?.markAsTouched();
  }

  constructor() {
    effect(() => {
      if (!this.formField) return
      this.model.control.setValue(this.formField.value(), {
        emitEvent: false,
        emitViewToModelChange: false,
        emitModelToViewChange: true,
      });
    });
  }

  public ngOnInit() {
    if (this.modifiers) {
      if (this.modifiers.length !== 1) {
        throw Error('only one modifier per signal input field supported.')
      } else if (this.formField) {
        this.modifiers[0].registerOnSet(this.formField.value.set)
      }
    }
  }
}
