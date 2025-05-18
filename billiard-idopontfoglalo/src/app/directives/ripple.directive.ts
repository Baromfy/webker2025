import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appRipple]',
  standalone: true
})
export class RippleDirective {
  @Input() rippleColor: string = 'rgba(0, 0, 0, 0.05)';
  @Input() rippleDuration: number = 600; // ms

  constructor(private el: ElementRef, private renderer: Renderer2) {
    // Add position relative to host element to properly position the ripple
    renderer.setStyle(el.nativeElement, 'position', 'relative');
    renderer.setStyle(el.nativeElement, 'overflow', 'hidden');
    renderer.setStyle(el.nativeElement, 'cursor', 'pointer');
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    // Create ripple element
    const ripple = this.renderer.createElement('span');
    
    // Get host element properties
    const hostRect = this.el.nativeElement.getBoundingClientRect();
    
    // Calculate ripple position and size
    const diameter = Math.max(hostRect.width, hostRect.height);
    const radius = diameter / 2;
    
    // Position clicked relative to host element
    const x = event.clientX - hostRect.left - radius;
    const y = event.clientY - hostRect.top - radius;
    
    // Set ripple styles
    this.renderer.setStyle(ripple, 'position', 'absolute');
    this.renderer.setStyle(ripple, 'width', `${diameter}px`);
    this.renderer.setStyle(ripple, 'height', `${diameter}px`);
    this.renderer.setStyle(ripple, 'top', `${y}px`);
    this.renderer.setStyle(ripple, 'left', `${x}px`);
    this.renderer.setStyle(ripple, 'border-radius', '50%');
    this.renderer.setStyle(ripple, 'background-color', this.rippleColor);
    this.renderer.setStyle(ripple, 'transform', 'scale(0)');
    this.renderer.setStyle(ripple, 'opacity', '1');
    this.renderer.setStyle(ripple, 'pointer-events', 'none');
    this.renderer.setStyle(ripple, 'transition', `transform ${this.rippleDuration}ms cubic-bezier(0.4, 0, 0.2, 1), opacity ${this.rippleDuration}ms linear`);
    
    // Add ripple to host element
    this.renderer.appendChild(this.el.nativeElement, ripple);
    
    // Trigger animation
    setTimeout(() => {
      this.renderer.setStyle(ripple, 'transform', 'scale(2)');
      this.renderer.setStyle(ripple, 'opacity', '0');
      
      // Remove ripple after animation completes
      setTimeout(() => {
        this.renderer.removeChild(this.el.nativeElement, ripple);
      }, this.rippleDuration);
    }, 10);
  }
}
