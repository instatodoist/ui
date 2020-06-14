import { Component, OnInit, Input, Output, HostListener, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { TodoType } from '../../../models';
import { AppService } from '../../../service';
declare var flatpickr: any;
declare var $: any;

@Component({
  selector: 'app-custom-date-modal',
  templateUrl: './custom-date-modal.component.html',
  styleUrls: ['./custom-date-modal.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CustomDateModalComponent,
      multi: true
    }
  ]
})
export class CustomDateModalComponent implements OnInit, AfterViewInit {

  @Input() modelId = 'scheduledAt';
  @Input() todo: TodoType = null; // todo object if update
  externalModal = this.appService.externalModal;
  defaultConfig = this.appService.ExternalModelConfig;
  flatPickerConfig: any = {};

  constructor(
    private appService: AppService
  ) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    $('#' + this.modelId).modal('toggle'); // Open & close Popup
    // Add code for opening date via flatpicker
    // Initially it will be online
    if (typeof flatpickr !== 'undefined' && $.isFunction(flatpickr)) { // Initialise Date Picker
      this.flatPickerConfig = {
        inline: true,
        dateFormat: 'Y-m-d',
        defaultDate: this.todo && this.todo.scheduledDate || new Date()
      };
      if (!(this.todo && this.todo._id)) {
        this.flatPickerConfig.minDate = new Date();
      }
      $('.flatpicker').flatpickr(this.flatPickerConfig);
    }
    // tslint:disable-next-line: only-arrow-functions
    $(`#${this.modelId}`).on('hidden.bs.modal', () => { // listen modal close event
      this.externalModal.next({
        ...this.defaultConfig,
        DATE_PICKER: false,
        data: {
          ...this.defaultConfig.data,
          todo: {
            ...this.todo
          }
        }
      });
    });
  }

  // @HostListener('click', ['$event.target'])
  onEvent($event: any) {
    const target = $event.target;
    if (target.value) {
      this.todo.scheduledDate = target.value;
      $(`#${this.modelId}`).modal('hide');
    }
  }

}
