import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: 'input [appSelect]',
})
export class SelectDirective {
  constructor(elementRef: ElementRef) {
    const input: HTMLInputElement = elementRef.nativeElement;
    input.addEventListener('focusin', () => input.select());
  }
}
