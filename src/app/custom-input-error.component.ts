import {Component} from "@angular/core";
import {JsonPipe, NgFor, NgIf} from "@angular/common";
import {injectErrorField} from "@signal-form/signal-input-error.directive";

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
      <p *ngFor="let error of errors()">{{error | json}}</p>
    </div>
  `
})
export class CustomErrorComponent {
  private _formField = injectErrorField();
  public touchedState = this._formField.touchedState;
  public errors = this._formField.errorsArray;
}
