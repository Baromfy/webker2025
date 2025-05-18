import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appTooltip]',
  standalone: true
})
export class TooltipDirective {
  @Input('appTooltip') tooltipText: string = '';
  @Input() tooltipPosition: 'top' | 'bottom' | 'left' | 'right' = 'top';
  @Input() tooltipDelay: number = 500;

  private tooltipElement: HTMLElement | null = null;
  private showTimeout: any;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.showTimeout = setTimeout(() => {
      this.show();
    }, this.tooltipDelay);
  }

  @HostListener('mouseleave') onMouseLeave() {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
    }
    this.hide();
  }

  private show() {
    // Create tooltip element if it doesn't exist
    if (!this.tooltipElement) {
      this.tooltipElement = this.renderer.createElement('div');
      this.renderer.addClass(this.tooltipElement, 'custom-tooltip');
      this.renderer.addClass(this.tooltipElement, `tooltip-${this.tooltipPosition}`);
      
      const text = this.renderer.createText(this.tooltipText);
      this.renderer.appendChild(this.tooltipElement, text);
      
      // Add styles
      this.renderer.setStyle(this.tooltipElement, 'position', 'absolute');
      this.renderer.setStyle(this.tooltipElement, 'background-color', 'rgba(0, 0, 0, 0.8)');
      this.renderer.setStyle(this.tooltipElement, 'color', '#fff');
      this.renderer.setStyle(this.tooltipElement, 'padding', '5px 10px');
      this.renderer.setStyle(this.tooltipElement, 'border-radius', '4px');
      this.renderer.setStyle(this.tooltipElement, 'z-index', '1000');
      this.renderer.setStyle(this.tooltipElement, 'pointer-events', 'none');
      this.renderer.setStyle(this.tooltipElement, 'font-size', '14px');
      this.renderer.setStyle(this.tooltipElement, 'white-space', 'nowrap');
      
      // Add to DOM
      this.renderer.appendChild(document.body, this.tooltipElement);
      
      // Position the tooltip
      this.positionTooltip();
    }
    
    // Show the tooltip
    this.renderer.setStyle(this.tooltipElement, 'opacity', '1');
  }

  private hide() {
    if (this.tooltipElement) {
      this.renderer.setStyle(this.tooltipElement, 'opacity', '0');
    }
  }

  private positionTooltip() {
    if (!this.tooltipElement) return;

    const hostElRect = this.el.nativeElement.getBoundingClientRect();
    const tooltipRect = this.tooltipElement.getBoundingClientRect();
    
    let top = 0;
    let left = 0;
    
    switch (this.tooltipPosition) {
      case 'top':
        top = hostElRect.top - tooltipRect.height - 10;
        left = hostElRect.left + (hostElRect.width - tooltipRect.width) / 2;
        break;
      case 'bottom':
        top = hostElRect.bottom + 10;
        left = hostElRect.left + (hostElRect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = hostElRect.top + (hostElRect.height - tooltipRect.height) / 2;
        left = hostElRect.left - tooltipRect.width - 10;
        break;
      case 'right':
        top = hostElRect.top + (hostElRect.height - tooltipRect.height) / 2;
        left = hostElRect.right + 10;
        break;
    }
    
    // Adjust for scroll
    top += window.scrollY;
    left += window.scrollX;
    
    this.renderer.setStyle(this.tooltipElement, 'top', `${top}px`);
    this.renderer.setStyle(this.tooltipElement, 'left', `${left}px`);
  }

  ngOnDestroy() {
    // Clean up
    if (this.tooltipElement) {
      this.renderer.removeChild(document.body, this.tooltipElement);
      this.tooltipElement = null;
    }
  }
}
