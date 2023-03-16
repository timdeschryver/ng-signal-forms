import {Directive, forwardRef, Input, OnDestroy} from '@angular/core';
import {SIGNAL_INPUT_MODIFIER, SignalInputModifier} from "@signal-form/signal-input-modifier.token";
import {debounceTime, Subject, Subscription} from "rxjs";

export const DEBOUNCE_MODIFIER: any = {
  provide: SIGNAL_INPUT_MODIFIER,
  useExisting: forwardRef(() => SignalInputDebounceDirective),
  multi: true
};

@Directive({
  selector: '[ngModel][formField][debounce]',
  standalone: true,
  providers: [DEBOUNCE_MODIFIER]
})
export class SignalInputDebounceDirective implements SignalInputModifier, OnDestroy {
  private _debounced = new Subject();
  private _debouncedSub: Subscription | null = null;

  @Input()
  set debounce(value: number) {
    this._debouncedSub?.unsubscribe();
    this._debouncedSub = this._debounced.pipe(debounceTime(value))
      .subscribe(value => {
        this.setSignal(value)
      })
  }

  // we replace this in the registerOnSet method with the set function passed by the SignalInputDirective
  private setSignal(value: unknown): void {
  }

  public registerOnSet(set: (value: unknown) => void): void {
    this.setSignal = set
  }

  public onModelChange(value: unknown): void {
    this._debounced.next(value);
  }

  public ngOnDestroy() {
    this._debouncedSub?.unsubscribe();
    this._debouncedSub = null;
  }
}
