import {Component, inject, Injector, Signal, signal, WritableSignal} from '@angular/core';
import {
  createFormField,
  createFormGroup,
  FormField,
  FormGroup,
  SetValidationState,
  SignalInputDebounceDirective,
  SignalInputDirective,
  SignalInputErrorDirective,
  V,
  Validator,
  withErrorComponent,
} from '@ng-signal-form/platform';
import {JsonPipe, NgFor, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {CustomErrorComponent} from './custom-input-error.component';

@Component({
  selector: 'app-root',
  template: `
    <div class="container">
      <div>
        <div>
          <label>Username (tim is invalid)</label>
          <small>{{ form.controls.username.errors() | json }}</small>
          <input
            ngModel
            [debounce]="700"
            [formField]="form.controls.username"
          />
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
  imports: [
    JsonPipe,
    FormsModule,
    SignalInputDirective,
    SignalInputErrorDirective,
    NgIf,
    NgFor,
    SignalInputDebounceDirective,
  ],
  providers: [withErrorComponent(CustomErrorComponent)],
})
export class AppComponent {
  private injector = inject(Injector)
  form = createFormGroup(() => {
    const username = createFormField('', {
      validators: [V.required(), uniqueUsername()],
    });

    return {
      username,
      passwords: createFormGroup(() => {
        const password = createFormField('', (pw) => ({
          validators: [
            V.required(),
            {
              validator: V.minLength(5),
              disable: () => pw().toLocaleLowerCase().startsWith('rob'),
              message: ({
                currentLength,
                minLength,
              }: {
                currentLength: number;
                minLength: number;
              }) =>
                `Password must be at least ${minLength} characters long or start with rob. Add at least ${
                  minLength - currentLength
                } characters or change '${pw().substring(0, 3)}' to rob`,
            },
          ],
        }));

        return {
          password,
          passwordConfirmation: createFormField<string | undefined>(undefined, {
            validators: [V.required(), V.equalsTo(password.value)],
            hidden: () => {
              return password.value() === '';
            },
          }),
        };
      }),
      todos: createFormGroup<WritableSignal<FormGroup<Todo>[]>>(
        () => {
          return signal([]);
        },
        {
          validators: [V.minLength(1)],
        }
      ),
    };
  });

  createTodo = () => {
    return createFormGroup<Todo>(() => {
      return {
        description: createFormField('', {
          injector: this.injector,
          validators: [
            V.required(),
            V.minLength(5),
            todoUniqueInList(
              this.form.controls.todos.value as unknown as Signal<Todo[]>
            ),
          ],
        }),
        completed: createFormField(false, {
          injector: this.injector
        }),
      };
    }, {
      injector: this.injector
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
          uniqueUsername: {
            details: false,
          },
        });
      }
    }, 3000);
  };
}

function todoUniqueInList<Value>(allTodos: Signal<Todo[]>): Validator<Value> {
  return (value: Value, setState: SetValidationState) => {
    if (value === '' || value === null) {
      setState('VALID');
      return;
    }

    const valid =
      allTodos().filter((todo) => todo.description === value).length === 1;
    if (valid) {
      setState('VALID');
    } else {
      setState('INVALID', {
        todoUniqueInList: {
          details: false,
        },
      });
    }
  };
}

type Todo = {
  description: FormField<string>;
  completed: FormField<boolean>;
};
