import { Component, OnInit, Input, Output, HostListener, ElementRef, AfterViewInit } from '@angular/core';
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
export class CustomDateModalComponent implements OnInit, AfterViewInit{

  externalModal = this.appService.externalModal;
  defaultConfig = this.appService.ExternalModelConfig;
  @Input() modelId = 'scheduledAt';
  @Input() todo: TodoType = null; // todo object if update
  @Input() field = 'scheduledDate';
  flatPickerConfig: any = {};
  scheduledAt = this.todo && this.todo.scheduledDate;
  onChange: any;

  constructor(
    private appService: AppService,
    private elementRef: ElementRef<HTMLInputElement>
  ) {
  }

  ngOnInit() {
    console.log(this.todo);
  }

  ngAfterViewInit() {
    $('#' + this.modelId).modal('toggle'); // Open & close Popup
    $('#' + this.modelId).on('show.bs.modal', function(event) {
      const idx = $('.modal:visible').length;
      $(this).css('z-index', 1040 + (10 * idx));
      $('.modal-backdrop').not('.stacked').css('z-index', 1039 + (10 * idx));
    });
    if (typeof flatpickr !== 'undefined' && $.isFunction(flatpickr)) { // Initialise Date Picker
      this.flatPickerConfig = {
        inline: true,
        dateFormat: 'Y-m-d'
      };
      if (!this.todo) {
        this.flatPickerConfig.minDate = new Date();
      }
      $('.flatpicker').flatpickr(this.flatPickerConfig);
    }
    // tslint:disable-next-line: only-arrow-functions
    $(`#${this.modelId}`).on('hidden.bs.modal', () => { // listen modal close event
      this.externalModal.next({
        ...this.defaultConfig,
        DATE_PICKER: false
      });
    });
  }

  // @HostListener('click', ['$event.target'])
  onEvent($event: any) {
    const target = $event.target;
    this.onChange($event.target.value);
  }

  writeValue(value: null) {
    // clear file input
    // this.elementRef.nativeElement.value = this.todo && this.todo.scheduledDate || new Date();
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    console.log(this.todo);
  }

}
