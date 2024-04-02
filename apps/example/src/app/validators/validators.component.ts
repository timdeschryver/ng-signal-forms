import { Component } from '@angular/core';
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
import { FormsModule } from '@angular/forms';
import { CustomErrorComponent } from '../custom-input-error.component';

@Component({
  selector: 'validators',
  standalone: true,
  imports: [
    JsonPipe,
    FormsModule,
    SignalInputDirective,
    SignalInputErrorDirective,
    SignalInputDebounceDirective,
  ],
  template: `
    <div>
      <label>Email</label>
      <input ngModel [formField]="form.controls.email" />
    </div>
    <pre>{{ form.value() | json }}</pre>
    <pre>{{ form.errorsArray() | json }}</pre>
  `,
  styles: [],
  providers: [withErrorComponent(CustomErrorComponent)],
})
export default class ValidatorsComponent {
  form = createFormGroup({
    email: createFormField('', { validators: [Validators.email()] }),
  });
}
