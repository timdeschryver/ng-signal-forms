import { Directive, effect, Input } from '@angular/core';
import { NgModel } from '@angular/forms';
import { FormField } from './form-field';

@Directive({
  selector: '[ngModel][formField]',
  standalone: true,
  host: {
    '(ngModelChange)': 'onModelChange($event)',
    '(blur)': 'onBlur()',
    '[class.control-valid]': 'this.formField.state() === "VALID"',
    '[class.control-invalid]': 'this.formField.state() === "INVALID"',
    '[class.control-pending]': 'this.formField.state() === "PENDING"',
  },
})
export class SignalInputDirective {
  @Input() formField!: FormField<unknown>;

  onModelChange(value: unknown) {
    this.formField.value.set(value);
  }

  onBlur() {
    this.formField.markAsTouched();
  }

  constructor(private model: NgModel) {
    effect(() => {
      this.model.control.setValue(this.formField.value(), {
        emitEvent: false,
        emitViewToModelChange: false,
        emitModelToViewChange: true,
      });
    });
  }
}
