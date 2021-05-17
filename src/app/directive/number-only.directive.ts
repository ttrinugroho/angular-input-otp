import { Directive, ElementRef, Renderer2, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appNumberOnly]'
})
export class NumberOnlyDirective implements OnInit {
  @Input() disabledNumberOnly = false;
  constructor(private elRef: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    if (!this.disabledNumberOnly) {
      this.renderer.setAttribute(
        this.elRef.nativeElement,
        'onkeypress',
        'return (event.charCode >= 48 && event.charCode <= 57) || event.charCode == 0'
      );
    }
  }
}
