import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  forwardRef,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Address } from './address';
import { Subscription, tap } from 'rxjs';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddressComponent),
      multi: true,
    },
  ],
  template: `<div [formGroup]="formGroup">
    <div>
      <label>Street</label>
      <input type="text" formControlName="street" />
    </div>
    <div>
      <label>Name</label>
      <input type="text" formControlName="zip" />
    </div>
    <div>
      <label>City</label>
      <input type="text" formControlName="city" />
    </div>
    <div>
      <label>Country</label>
      <input type="text" formControlName="country" />
    </div>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressComponent
  implements OnInit, OnDestroy, ControlValueAccessor
{
  onChange: any;
  onTouched: any;
  disabled = false;
  obj!: Address;
  formGroup!: FormGroup;
  sub?: Subscription;

  ngOnInit(): void {
    const fb = new FormBuilder();
    this.formGroup = fb.group({
      street: new FormControl(null, [Validators.minLength(3)]),
      zip: new FormControl(null, [Validators.minLength(3)]),
      city: new FormControl(null, [Validators.minLength(3)]),
      country: new FormControl(null, [Validators.minLength(3)]),
    });
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  registerOnChange(onChange: any): void {
    this.sub = this.formGroup.valueChanges
      .pipe(tap((value) => onChange(value)))
      .subscribe();
  }
  registerOnTouched(onTouched: any): void {
    this.onTouched = onTouched;
  }

  writeValue(obj: Address): void {
    if (obj) {
      console.log('writeValue');
      this.formGroup.patchValue(obj, { emitEvent: false });
      this.obj = obj;
    }
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
