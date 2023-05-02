import {Component} from "@angular/core";
import {injectSignalForm} from "./multi-page.form";
import {FormsModule} from "@angular/forms";
import {SignalInputDirective, SignalInputErrorDirective} from "@ng-signal-form/platform";
import {JsonPipe} from "@angular/common";
import {FormNavComponent} from "./form-nav.component";

@Component({
  selector: 'app-step-1',
  standalone: true,
  imports: [
    JsonPipe,
    FormsModule,
    SignalInputDirective,
    SignalInputErrorDirective,
    FormNavComponent,
  ],
  template: `
    <app-form-nav/>
    <div>

      <div>
        <label>First name</label>
        <small>{{ form.controls.firstName.errors() | json }}</small>
        <input
          ngModel
          [formField]="form.controls.firstName"
        />
      </div>

      <div>
        <label>Last name</label>
        <small>{{ form.controls.lastName.errors() | json }}</small>
        <input
          ngModel
          [formField]="form.controls.lastName"
        />
      </div>

    </div>
  `,
})
export default class Step1Component {
  public form = injectSignalForm().controls.step1;
}
