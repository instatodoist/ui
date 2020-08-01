import { Component, Input, AfterViewInit } from '@angular/core';
import { AppService } from '../../../../service';

@Component({
  selector: 'app-theme',
  template: `
    <div class="iq-colorbox color-fix">
      <div class="buy-button">
        <a class="color-full">
        <i class="fas fa-random cursor"></i>
        </a>
      </div>
      <div class="clearfix color-picker">
        <ul class="iq-colorselect clearfix">
          <li class="color-1 iq-colormark" data-style="color-1"></li>
          <li class="color-2" data-style="iq-color-2"></li>
          <li class="color-3" data-style="iq-color-3"></li>
          <li class="color-4" data-style="iq-color-4"></li>
          <li class="color-5" data-style="iq-color-5"></li>
          <li class="color-6" data-style="iq-color-6"></li>
          <li class="color-7" data-style="iq-color-7"></li>
          <li class="color-8" data-style="iq-color-8"></li>
          <li class="color-9" data-style="iq-color-9"></li>
          <li class="color-10" data-style="iq-color-10"></li>
          <li class="color-11" data-style="iq-color-11"></li>
          <li class="color-12" data-style="iq-color-12"></li>
          <li class="color-13" data-style="iq-color-13"></li>
          <li class="color-14" data-style="iq-color-14"></li>
          <li class="color-15" data-style="iq-color-15"></li>
          <li class="color-16" data-style="iq-color-16"></li>
          <li class="color-17" data-style="iq-color-17"></li>
          <li class="color-18" data-style="iq-color-18"></li>
          <li class="color-19" data-style="iq-color-19"></li>
          <li class="color-20" data-style="iq-color-20"></li>
        </ul>
      </div>
    </div>
  `,
  styles: []
})
export class ThemeComponent implements AfterViewInit {

  @Input() jQuery;
  defaultTheme = this.appService.APP_DATA.config.theme;
  constructor(private appService: AppService) {}

  ngAfterViewInit(): void {
    this.changeThemeJs();
    this.sidemenuJs();
  }

  sidemenuJs(): void {
    const jQuery = this.jQuery;
    /*---------------------------------------------------------------------
    Sidebar Widget
    -----------------------------------------------------------------------*/
    jQuery('.iq-sidebar-menu .active').each(function () {
      jQuery(this).find('.iq-submenu').addClass('show');
      jQuery(this).addClass('active-menu');
      jQuery(this).next().attr('aria-expanded', 'true');
    });
    jQuery(document).on('click', '.iq-menu > li > a', function () {
      jQuery('.iq-menu > li > a').parent().removeClass('active');
      jQuery(this).parent().addClass('active');
    });
    jQuery('.wrapper-menu').click(function () {
      console.log(jQuery(this));
      jQuery(this).toggleClass('open');
      jQuery('body').toggleClass('sidebar-main');
    });
  }

  changeThemeJs(): void {
    const jQuery = this.jQuery;
    if (this.appService.APP_DATA.config.tClass) {
      jQuery('.iq-colorbox .iq-colorselect .iq-colormark').removeClass('iq-colormark');
      jQuery('.iq-colorselect').find('li.' + this.appService.APP_DATA.config.tClass).addClass('iq-colormark');
    }
    const updateThemFunc = this.appService.changeTheme;
    updateThemFunc(this.defaultTheme);
    const styleSwitcher = jQuery('.iq-colorbox');
    const panelWidth = styleSwitcher.outerWidth(true);
    // tslint:disable-next-line: only-arrow-functions
    jQuery('.iq-colorbox .color-full').on('click', function () {
      if (jQuery('.iq-colorbox.color-fix').length > 0) {
        styleSwitcher.animate({ right: '0px' });
        jQuery('.iq-colorbox.color-fix').removeClass('color-fix');
        jQuery('.iq-colorbox').addClass('opened');
      } else {
        jQuery('.iq-colorbox.opened').removeClass('opened');
        jQuery('.iq-colorbox').addClass('color-fix');
        styleSwitcher.animate({ right: '-' + panelWidth });
      }
      return false;
    });

    jQuery('.iq-colorbox .iq-colorselect li').on('click', function () {
      const jQuerythis = jQuery(this);
      const className = jQuerythis.attr('class');
      console.log(className);
      localStorage.setItem('defaultThemeClass', className);
      const iqColor = jQuerythis.css('background-color');
      jQuery('.iq-colorbox .iq-colorselect .iq-colormark').removeClass('iq-colormark');
      jQuerythis.addClass('iq-colormark');
      updateThemFunc(iqColor);
    });
  }
}
