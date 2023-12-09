import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterOutlet],
  template: `
    <nav class="mainNav">
      <ul>
        <li>
          <a routerLink="basic-form">Basic form</a>
        </li>
        <li>
          <a routerLink="simple-form">Simple form</a>
        </li>
        <li>
          <a routerLink="multi-page-form">Multipage form</a>
        </li>
      </ul>
    </nav>
    <router-outlet />
  `,
  standalone: true,
})
export class AppComponent {}
