import {Component, computed} from "@angular/core";
import {JsonPipe, NgFor, NgIf} from "@angular/common";
import {injectErrorField} from "@ng-signal-form/platform";

@Component({
  selector: 'custom-signal-input-error',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    JsonPipe
  ],
  template: `
    <div *ngIf="touchedState() === 'TOUCHED'">
      <p *ngFor="let message of errorMessages()">{{message}}</p>
    </div>
  `
})
export class CustomErrorComponent {
  private _formField = injectErrorField();
  public touchedState = this._formField.touchedState;
  public errors = this._formField.errors;

  public errorMessages = computed(() => Object.values(this.errors() ?? {})
    .map(error => error.message ?? 'Field invalid' ))
}
