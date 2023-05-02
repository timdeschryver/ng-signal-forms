import {RouterLink} from "@angular/router";
import {Component} from "@angular/core";

@Component({
  selector: 'app-form-nav',
  standalone: true,
  imports: [RouterLink],
  template: `
    <nav>
      <ol>
        <li>
          <a routerLink="/multi-page-form/step-1">Step 1</a>
        </li>
        <li>
          <a routerLink="/multi-page-form/step-2">Step 2</a>
        </li>
        <li>
          <a routerLink="/multi-page-form/review">Review</a>
        </li>
      </ol>
    </nav>
  `
})
export class FormNavComponent {
}
