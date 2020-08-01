import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UtilityService } from '../../../../service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, AfterViewInit {

  jQuery = this.utilityService.JQuery;

  constructor(
    private utilityService: UtilityService
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.headerJs();
    this.toolTipJs();
  }

  toolTipJs(): void {
    /*---------------------------------------------------------------------
    Tooltip
    -----------------------------------------------------------------------*/
    this.jQuery('[data-toggle="popover"]').popover();
    this.jQuery('[data-toggle="tooltip"]').tooltip();
  }

  headerJs(): void {
    const jQuery = this.jQuery;
    // tslint:disable-next-line: only-arrow-functions
    jQuery(document).on('click', function (e) {
      const myTargetElement = e.target;
      let selector;
      let mainElement;
      if (
        jQuery(myTargetElement).hasClass('search-toggle') ||
        jQuery(myTargetElement).parent().hasClass('search-toggle') ||
        jQuery(myTargetElement).parent().parent().hasClass('search-toggle')
      ) {
        if (jQuery(myTargetElement).hasClass('search-toggle')) {
          selector = jQuery(myTargetElement).parent();
          mainElement = jQuery(myTargetElement);
        } else if (jQuery(myTargetElement).parent().hasClass('search-toggle')) {
          selector = jQuery(myTargetElement).parent().parent();
          mainElement = jQuery(myTargetElement).parent();
        } else if (jQuery(myTargetElement).parent().parent().hasClass('search-toggle')) {
          selector = jQuery(myTargetElement).parent().parent().parent();
          mainElement = jQuery(myTargetElement).parent().parent();
        }
        if (!mainElement.hasClass('active') && jQuery('.navbar-list li').find('.active')) {
          jQuery('.navbar-list li').removeClass('iq-show');
          jQuery('.navbar-list li .search-toggle').removeClass('active');
        }
        selector.toggleClass('iq-show');
        mainElement.toggleClass('active');
        e.preventDefault();
      // eslint-disable-next-line no-empty
      } else if (jQuery(myTargetElement).is('.search-input')) { } else {
        jQuery('.navbar-list li').removeClass('iq-show');
        jQuery('.navbar-list li .search-toggle').removeClass('active');
      }
    });
  }

}
