import { Component, OnInit, Input, Output, AfterViewInit, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
declare var flatpickr: any;
declare var $: any;
type Operation = 'ADD' | 'UPDATE';
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
  @Input() operationType: Operation = 'ADD';
  @Input() scheduledAt = '';
  @Input() modelId = 'scheduledModal';
  @Output() data: EventEmitter<string> = new EventEmitter<string>();
  flatPickerConfig: any = {};

  constructor() {
  }

  ngOnInit() {
    console.log(this.operationType, this.scheduledAt);
  }

  ngAfterViewInit() {
    // Add code for opening date via flatpicker
    // Initially it will be online
    if (typeof flatpickr !== 'undefined' && $.isFunction(flatpickr)) { // Initialise Date Picker
      this.flatPickerConfig = {
        inline: true,
        dateFormat: 'Y-m-d',
        defaultDate: this.scheduledAt || new Date()
      };
      if (this.operationType === 'ADD') {
        this.flatPickerConfig.minDate = new Date();
      }
      $('.flatpicker').flatpickr(this.flatPickerConfig);
    }
    // tslint:disable-next-line: only-arrow-functions
    // $(`#${this.modelId}`).on('hidden.bs.modal', () => { // listen modal close event
    // });
  }

  // @HostListener('click', ['$event.target'])
  onEvent($event: any) {
    const target = $event.target;
    if (target.value) {
      this.data.next(target.value);
      // $(`#${this.modelId}`).modal('hide');
    }
  }

}
