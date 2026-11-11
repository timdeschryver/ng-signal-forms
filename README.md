# Signal Forms

> [!CAUTION]
> **`ng-signal-forms` is deprecated and no longer maintained.**
>
> Angular now has built-in, signal-based forms: [Angular Signal Forms](https://angular.dev/guide/forms/signals/overview) (`@angular/forms/signals`).
> Please use Angular's Signal Forms instead of this library.
>
> This repository is archived and will not receive any further updates, fixes, or releases.
> Thank you to everyone who used this library, reported issues, and contributed! 💜

## Migrating to Angular Signal Forms

Angular Signal Forms are built on the same idea as this library: the form state is driven by signals.
To migrate, replace the form groups, form fields, and validators of `ng-signal-forms` with Angular's `form()` function and its schema-based validation rules.
The [Angular Signal Forms guide](https://angular.dev/guide/forms/signals/overview) explains how to get started.

When your application no longer uses `ng-signal-forms`, remove it from your project:

```bash
npm uninstall ng-signal-forms
```

## About this library

Creating signal powered Angular Forms.

> [!NOTE]
> More information can be found on my blog [Bringing the power of Signals to Angular Forms with Signal Forms](https://timdeschryver.dev/blog/bringing-the-power-of-signals-to-angular-forms-with-signal-forms), which serves as the documentation for this library.
