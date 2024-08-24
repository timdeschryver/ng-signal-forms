import { Component, inject } from '@angular/core';
import { JsonPipe } from '@angular/common';
import {
  createFormField,
  createFormGroup,
  SignalInputDebounceDirective,
  SignalInputDirective,
  SignalInputErrorDirective,
  Validators,
  withErrorComponent,
} from '@ng-signal-forms';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators as ReactiveFormValidators,
} from '@angular/forms';
import { CustomErrorComponent } from '../custom-input-error.component';

@Component({
  selector: 'validators',
  standalone: true,
  imports: [
    FormsModule,
    JsonPipe,
    SignalInputDirective,
    SignalInputErrorDirective,
    SignalInputDebounceDirective,
    // TODO - remove before PR
    ReactiveFormsModule,
  ],
  template: `
    <div>
      <label>Email (signal form)</label>
      <input ngModel [formField]="form.controls.email" />
    </div>
    <pre>{{ form.value() | json }}</pre>
    <pre>{{ form.errorsArray() | json }}</pre>

    <!-- TODO - remove reactive forms point of reference before PR -->
    <form [formGroup]="reactiveForm">
      <label>Email (reactive form)</label>
      <input formControlName="email" type="text" />
    </form>
    <pre>{{ reactiveForm.value | json }}</pre>
    <pre>{{ reactiveForm.errors | json }}</pre>
    <pre>{{ reactiveForm.controls.email.errors | json }}</pre>
  `,
  styles: [],
  providers: [withErrorComponent(CustomErrorComponent)],
})
export default class ValidatorsComponent {
  form = createFormGroup({
    email: createFormField('', { validators: [Validators.email()] }),
  });

  #fb = inject(FormBuilder);

  reactiveForm = this.#fb.group({
    email: new FormControl('', { validators: ReactiveFormValidators.email }),
  });
}
