declare var mdc: any;
import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appDropdownMenu]'
})
export class DropdownMenuDirective {

  constructor(private el: ElementRef) { }
  @HostListener('click', ['$event'])
  clickEvent(element) {

    function hasClass(elem, className) {
      return (' ' + elem.className + ' ').indexOf(' ' + className + ' ') > -1;
    }
    var listOfPositions = {
      TOP_LEFT: 0,
      BOTTOM_LEFT: 1,
      TOP_RIGHT: 4,
      BOTTOM_RIGHT: 5,
      TOP_START: 8,
      BOTTOM_START: 9,
      TOP_END: 12,
      BOTTOM_END: 13
    };
    var position = this.el.nativeElement.getAttribute('data-position') || 'BOTTOM_START';
    var dimention = this.el.nativeElement.getAttribute('float-top') || false;
    var nextEl = this.el.nativeElement.nextElementSibling;
    if (hasClass(nextEl, 'mdc-menu')) {
      var menu = new mdc.menu.MDCMenu(this.el.nativeElement.nextElementSibling);
      var setPos = listOfPositions[position];
      if (position && setPos) {
        menu.setAnchorCorner(setPos);
      } else {
        menu.setAnchorCorner(1);
      }
      // open
      // menu.quickOpen = true;
      // set to top
      setTimeout(function () {
        if (dimention === 'true') {
          menu.root_.style.bottom = menu.root_.style.top;
          menu.root_.style.top = '';
          menu.root_.style.transformOrigin = 'top bottom 0px';
        }
      }, 10);
      menu.open = !menu.open;
    } else {
      console.error('Next sibling element of the directive[dropddown-menu] should contain mdc-menu class');
    }
  }
}
