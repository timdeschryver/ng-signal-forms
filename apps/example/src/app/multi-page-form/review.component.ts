import {Component} from "@angular/core";
import {JsonPipe} from "@angular/common";
import {injectSignalForm} from "./multi-page.form";
import {FormNavComponent} from "./form-nav.component";

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [JsonPipe, FormNavComponent],
  template: `
    <app-form-nav/>
    <div>
      <h3>States</h3>
      <pre
      >{{
        {
          state: form.state(),
          dirtyState: form.dirtyState(),
          touchedState: form.touchedState()
        } | json
        }}
    </pre>
      <h3>Value</h3>
      <pre>{{ form.value() | json }}</pre>

      <h3>Errors</h3>
      <pre>{{ form.errorsArray() | json }}</pre>
    </div>
  `,
})
export default class ReviewComponent {
  public form = injectSignalForm()
}
