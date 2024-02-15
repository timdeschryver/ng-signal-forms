import { JsonPipe, NgFor, NgIf } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  SignalFormBuilder,
  SignalInputDebounceDirective,
  SignalInputDirective,
  SignalInputErrorDirective,
  withErrorComponent,
} from '@ng-signal-forms';
import { CustomErrorComponent } from '../custom-input-error.component';
import { AddressComponent } from './../address/address.component';
import { Address } from '../address/address';
@Component({
  selector: 'app-basic-form',
  template: `
    <div class="container">
      <div>
        <div>
          <label>Name</label>
          <input ngModel [formField]="form.controls.name" />
        </div>

        <div>
          <label>Age</label>
          <input type="number" ngModel [formField]="form.controls.age" />
        </div>

        <div>
          <app-address ngModel [formField]="form.controls.address" />
        </div>
      </div>

      <div>
        <button (click)="reset()">Reset form</button>
        <button (click)="prefill()">Prefill form</button>

        <h3>States</h3>
        <pre
          >{{
            {
              state: form.state(),
              dirtyState: form.dirtyState(),
              touchedState: form.touchedState(),
              valid: form.valid()
            } | json
          }}
    </pre>

        <h3>Value</h3>
        <pre>{{ form.value() | json }}</pre>

        <h3>Errors</h3>
        <pre>{{ form.errorsArray() | json }}</pre>
      </div>
    </div>
  `,
  standalone: true,
  imports: [
    JsonPipe,
    FormsModule,
    SignalInputDirective,
    SignalInputErrorDirective,
    NgIf,
    NgFor,
    SignalInputDebounceDirective,
    AddressComponent,
  ],
  providers: [withErrorComponent(CustomErrorComponent)],
})
export default class FormWithCvaComponent {
  private sfb = inject(SignalFormBuilder);

  // TODO: type of address should be Address | null
  form = this.sfb.createFormGroup<{ name: string; age: number | null; address: any | null; }>({
    name: 'Alice',
    age: null,
    address: { city: 'Vienna'}
  });

  formChanged = effect(() => {
    console.log('form changed:', this.form.value());
  });

  nameChanged = effect(() => {
    console.log('name changed:', this.form.controls.name.value());
  });

  ageChanged = effect(() => {
    console.log('age changed:', this.form.controls.age.value());
  });

  reset() {
    this.form.reset();
  }

  prefill() {
    // TODO: improve this API to set form groups
    this.form.controls.age.value.set(42);
    this.form.controls.name.value.set('Bob');
  }
}
