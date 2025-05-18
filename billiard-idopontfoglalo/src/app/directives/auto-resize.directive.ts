import { AfterViewInit, Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appAutoResize]',
  standalone: true
})
export class AutoResizeDirective implements AfterViewInit {
  @Input() appAutoResize: boolean = true;
  @Input() minHeight: number = 60;
  @Input() maxHeight: number = 200;
  
  private initialHeight: number = 0;

  constructor(private el: ElementRef<HTMLTextAreaElement>) {}

  ngAfterViewInit() {
    // Store the initial height
    this.initialHeight = this.el.nativeElement.clientHeight;
    // Set min-height via CSS
    this.el.nativeElement.style.minHeight = `${Math.max(this.initialHeight, this.minHeight)}px`;
    this.el.nativeElement.style.overflow = 'hidden';
    // Trigger initial resize
    this.resizeTextarea();
  }

  @HostListener('input') onInput() {
    if (this.appAutoResize) {
      this.resizeTextarea();
    }
  }

  @HostListener('focus') onFocus() {
    if (this.appAutoResize) {
      this.resizeTextarea();
    }
  }

  private resizeTextarea() {
    const textarea = this.el.nativeElement;
    
    // Reset the height to calculate the scroll height correctly
    textarea.style.height = 'auto';
    
    // Get the scroll height (content height)
    const scrollHeight = textarea.scrollHeight;
    
    // Set the height while respecting min/max constraints
    const newHeight = Math.min(Math.max(scrollHeight, this.minHeight), this.maxHeight);
    textarea.style.height = `${newHeight}px`;
    
    // If content is larger than max height, enable scrolling
    textarea.style.overflow = scrollHeight > this.maxHeight ? 'auto' : 'hidden';
  }
}
