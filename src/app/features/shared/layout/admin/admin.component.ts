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
  defaultTheme = this.appService.defaultSettings.app.theme;

  constructor(
    private appService: AppService
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.changeThemeJs();
    this.sidemenuJs();
    this.headerJs();
    this.toolTipJs();
  }

  toolTipJs() {
    /*---------------------------------------------------------------------
    Tooltip
    -----------------------------------------------------------------------*/
    $('[data-toggle="popover"]').popover();
    $('[data-toggle="tooltip"]').tooltip();
  }

  headerJs() {
    // tslint:disable-next-line: only-arrow-functions
    $(document).on('click', function(e) {
      const myTargetElement = e.target;
      let selector;
      let mainElement;
      if (
        $(myTargetElement).hasClass('search-toggle') ||
        $(myTargetElement).parent().hasClass('search-toggle') ||
        $(myTargetElement).parent().parent().hasClass('search-toggle')
      ) {
          if ($(myTargetElement).hasClass('search-toggle')) {
              selector = $(myTargetElement).parent();
              mainElement = $(myTargetElement);
          } else if ($(myTargetElement).parent().hasClass('search-toggle')) {
              selector = $(myTargetElement).parent().parent();
              mainElement = $(myTargetElement).parent();
          } else if ($(myTargetElement).parent().parent().hasClass('search-toggle')) {
              selector = $(myTargetElement).parent().parent().parent();
              mainElement = $(myTargetElement).parent().parent();
          }
          if (!mainElement.hasClass('active') && $('.navbar-list li').find('.active')) {
              $('.navbar-list li').removeClass('iq-show');
              $('.navbar-list li .search-toggle').removeClass('active');
          }
          selector.toggleClass('iq-show');
          mainElement.toggleClass('active');
          e.preventDefault();
      } else if ($(myTargetElement).is('.search-input')) {} else {
          $('.navbar-list li').removeClass('iq-show');
          $('.navbar-list li .search-toggle').removeClass('active');
      }
    });
  }

  sidemenuJs() {
    /*---------------------------------------------------------------------
    Sidebar Widget
    -----------------------------------------------------------------------*/
    $('.iq-sidebar-menu .active').each(function(ele, index) {
      $(this).find('.iq-submenu').addClass('show');
      $(this).addClass('active-menu');
      $(this).next().attr('aria-expanded', 'true');
    });
    $(document).on('click', '.iq-menu > li > a', function() {
      $('.iq-menu > li > a').parent().removeClass('active');
      $(this).parent().addClass('active');
    });
    $('.wrapper-menu').click(function() {
      console.log($(this));
      $(this).toggleClass('open');
      $('body').toggleClass('sidebar-main');
    });
  }

  changeThemeJs() {
    const updateThemFunc = this.appService.changeTheme;
    updateThemFunc(this.defaultTheme);
    const styleSwitcher = $('.iq-colorbox');
    const panelWidth = styleSwitcher.outerWidth(true);
    // tslint:disable-next-line: only-arrow-functions
    $('.iq-colorbox .color-full').on('click', function () {
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

    $('.iq-colorbox .iq-colorselect li').on('click', function () {
      const $this = $(this);
      const iqColor = $this.css('background-color');
      $('.iq-colorbox .iq-colorselect .iq-colormark').removeClass('iq-colormark');
      $this.addClass('iq-colormark');
      updateThemFunc(iqColor);
    });
  }
}
