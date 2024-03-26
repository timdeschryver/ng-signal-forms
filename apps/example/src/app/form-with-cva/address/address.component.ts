import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  forwardRef, effect
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import { createFormField, createFormGroup, SignalInputDirective, V } from '@ng-signal-forms';
import { Address } from './address';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [CommonModule, SignalInputDirective, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddressComponent),
      multi: true
    }
  ],
  template: `
    <div>
      <div>
        <label>Street</label>
        <input type="text" ngModel [formField]="formGroup.controls.street" />
      </div>
      <div>
        <label>Zip</label>
        <input type="text" ngModel [formField]="formGroup.controls.zip" />
      </div>
      <div>
        <label>City</label>
        <input type="text" ngModel [formField]="formGroup.controls.city" />
      </div>
      <div>
        <label>Country</label>
        <input type="text" ngModel [formField]="formGroup.controls.country" />
      </div>
    </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddressComponent
  implements ControlValueAccessor {
  onChange: any;
  onTouched: any;
  formGroup = createFormGroup({
    street: createFormField(undefined as undefined | string, { validators: [V.minLength(3)] }),
    zip: createFormField(undefined as undefined | string, { validators: [V.minLength(3)] }),
    city: createFormField(undefined as undefined | string, { validators: [V.minLength(3)] }),
    country: createFormField(undefined as undefined | string, { validators: [V.minLength(3)] })
  });

  change = effect(() => {
    this.onChange(this.formGroup.value());
  }, { allowSignalWrites: true });

  registerOnChange(onChange: any): void {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any): void {
    this.onTouched = onTouched;
  }

  writeValue(obj: Address): void {
    // TODO: obj should receive values from parent
    if (obj) {
      this.formGroup.controls.street.value.set(obj.street);
      this.formGroup.controls.zip.value.set(obj.zip);
      this.formGroup.controls.city.value.set(obj.city);
      this.formGroup.controls.country.value.set(obj.country);
    }
  }
}
