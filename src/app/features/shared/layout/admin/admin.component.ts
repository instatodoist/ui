declare var $: any;
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UtilityService } from '../../../../service/utility.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, AfterViewInit {
  snachBar: any;
  constructor(private utilityService: UtilityService) { }

  ngAfterViewInit() {
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
        const str = iqColor;
        const res = str.replace('rgb(', '');
        const res1 = res.replace(')', '');
        const iqColor2 = 'rgba(' + res1.concat(',', 0.1) + ')';
        const iqColor3 = 'rgba(' + res1.concat(',', 0.8) + ')';
        document.documentElement.style.setProperty('--iq-primary', iqColor);
        document.documentElement.style.setProperty('--iq-light-primary', iqColor2);
        document.documentElement.style.setProperty('--iq-primary-hover', iqColor3);
      });
    });

  }

  ngOnInit(): void {
  }

}
