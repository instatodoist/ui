declare var $: any;
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AppConfig as AppService } from '../../../../service/appconfig';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, AfterViewInit {
  snachBar: any;
  defaultTheme =  this.appService.defaultSettings.app.theme;

  constructor(
    private appService: AppService
  ) { }

  ngAfterViewInit() {
    const updateThemFunc = this.appService.changeTheme;
    updateThemFunc(this.defaultTheme);
    // tslint:disable-next-line: only-arrow-functions
    $(document).ready(function($) {
      const styleSwitcher = $('.iq-colorbox');
      const panelWidth = styleSwitcher.outerWidth(true);
      // tslint:disable-next-line: only-arrow-functions
      $('.iq-colorbox .color-full').on('click', function() {
        if ($('.iq-colorbox.color-fix').length > 0) {
          styleSwitcher.animate({ right: '0px' });
          $('.iq-colorbox.color-fix').removeClass('color-fix');
          $('.iq-colorbox').addClass('opened');
        } else {
          $('.iq-colorbox.opened').removeClass('opened');
          $('.iq-colorbox').addClass('color-fix');
          styleSwitcher.animate({ right: '-' + panelWidth });
        }
        return false;
      });

      $('.iq-colorbox .iq-colorselect li').on('click', function() {
        const $this = $(this);
        const iqColor = $this.css('background-color');
        $('.iq-colorbox .iq-colorselect .iq-colormark').removeClass('iq-colormark');
        $this.addClass('iq-colormark');
        updateThemFunc(iqColor);
      });

    });
  }

  ngOnInit(): void {
  }

}
