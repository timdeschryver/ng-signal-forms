import { Component, Signal, signal } from '@angular/core';
import {
  createFormField,
  createFormGroup,
  FormField,
  FormGroup,
  SetValidationState,
  SignalInputDirective,
  V,
  Validator,
} from 'src/signal-forms';
import { JsonPipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {SignalInputErrorDirective} from "@signal-form/signal-input-error.directive";
import {withErrorComponent} from "@signal-form/signal-input-error.token";
import {CustomErrorComponent} from "./custom-input-error.component";

@Component({
  selector: 'app-root',
  template: `
    <div class="container">
      <div>
        <div>
          <label>Username (tim is invalid)</label>
          <small>{{ form.controls.username.errors() | json }}</small>
          <input ngModel [formField]="form.controls.username" />
        </div>

        <div>
          <label>Password </label>
          <small>{{
            form.controls.passwords.controls.password.errors() | json
          }}</small>
          <input
            ngModel
            [formField]="form.controls.passwords.controls.password"
          />
        </div>

        <div
          *ngIf="
            !form.controls.passwords.controls.passwordConfirmation.hidden()
          "
        >
          <label>Password Confirmation</label>
          <small>{{
            form.controls.passwords.controls.passwordConfirmation.errors()
              | json
          }}</small>
          <input
            ngModel
            [formField]="form.controls.passwords.controls.passwordConfirmation"
          />
        </div>

        <div>
          <button (click)="addTodo()">Add todo</button>
          <small>{{ form.controls.todos.errors() | json }}</small>

          <div *ngFor="let todo of $any(form.controls.todos.controls)()">
            <label>Todo</label>
            <small>{{ todo.controls.description.errors() | json }}</small>
            <input
              type="checkbox"
              ngModel
              [formField]="todo.controls.completed"
            />
            <input ngModel [formField]="todo.controls.description" />
          </div>
        </div>
      </div>

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
    </div>
  `,
  standalone: true,
  imports: [JsonPipe, FormsModule, SignalInputDirective, SignalInputErrorDirective, NgIf, NgFor],
  providers: [withErrorComponent(CustomErrorComponent)]
})
export class AppComponent {
  // TODO: this currently used to validate cross fields
  // rework this so it's not needed or separate model and form
  reference = {
    password: {
      password: signal(''),
      passwordConfirmation: signal(''),
    },
    todos: signal<
      FormGroup<{
        description: FormField<string>;
        completed: FormField<boolean>;
      }>[]
    >([]),
  };

  // TODO: disable validator based on condition: {validator: v, when/disable: () => ..., message: () => ...}
  form = createFormGroup({
    username: createFormField('', {
      validators: [V.required(), uniqueUsername()],
    }),
    passwords: createFormGroup({
      password: createFormField(this.reference.password.password, {
        validators: [V.required(), {
          validator: V.minLength(5),
          disable: () => this.reference.password.password().startsWith('@@'),
          message: ({currentLength, minLength}: {currentLength: number
            minLength: number}) => `Password must be at least ${minLength} characters long. Add at least ${minLength - currentLength} characters`
        }],
      }),
      passwordConfirmation: createFormField(
        this.reference.password.passwordConfirmation,
        {
          validators: [
            V.required(),
            V.equalsTo(this.reference.password.password),
          ],
          hidden: () => this.reference.password.password() === '',
        }
      ),
    }),
    todos: createFormGroup(this.reference.todos, {
      validators: [V.minLength(1)],
    }),
  });

  createTodo = () => {
    return createFormGroup({
      description: createFormField('', {
        validators: [
          V.required(),
          V.minLength(5),
          todoUniqueInList(this.reference.todos),
        ],
      }),
      completed: createFormField(false),
    });
  };

  addTodo() {
    this.form.controls.todos.controls.mutate((todos) =>
      todos.push(this.createTodo())
    );
  }
}

function uniqueUsername<Value>(): Validator<Value> {
  return (value: Value, setState: SetValidationState) => {
    setState('PENDING');
    setTimeout(() => {
      const valid = value !== 'tim';
      if (valid) {
        setState('VALID');
      } else {
        setState('INVALID', {
          uniqueUsername: false,
        });
      }
    }, 3000);
  };
}

function todoUniqueInList<Value>(allTodos: Signal<any[]>): Validator<Value> {
  return (value: Value, setState: SetValidationState) => {
    if (value === '' || value === null) {
      setState('VALID');
      return;
    }
    const valid =
      allTodos().filter((todo) => todo.value().description === value).length ===
      1;
    if (valid) {
      setState('VALID');
    } else {
      setState('INVALID', {
        todoUniqueInList: false,
      });
    }
  };
}
