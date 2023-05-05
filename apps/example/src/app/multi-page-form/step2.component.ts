import { Component } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  SignalInputDirective,
  SignalInputErrorDirective,
} from '@ng-signal-form';
import { injectSignalForm } from './multi-page.form';
import { FormNavComponent } from './form-nav.component';

@Component({
  selector: 'app-step-2',
  standalone: true,
  imports: [
    JsonPipe,
    FormsModule,
    SignalInputDirective,
    SignalInputErrorDirective,
    FormNavComponent,
  ],
  template: `
    <app-form-nav />
    <div>
      <div>
        <label>Street</label>
        <small>{{ form.controls.street.errors() | json }}</small>
        <input ngModel [formField]="form.controls.street" />
      </div>

      <div>
        <label>ZIP (must be 1234)</label>
        <small>{{ form.controls.zip.errors() | json }}</small>
        <input type="number" ngModel [formField]="form.controls.zip" />
      </div>

      <div>
        <label>City</label>
        <small>{{ form.controls.city.errors() | json }}</small>
        <input ngModel [formField]="form.controls.city" />
      </div>

      <div>
        <label>Country</label>
        <small>{{ form.controls.country.errors() | json }}</small>
        <input ngModel [formField]="form.controls.country" />
      </div>
    </div>
  `,
})
export default class Step2Component {
  public form = injectSignalForm().controls.step2;
}
