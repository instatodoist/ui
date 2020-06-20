import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GoalService, AppService, UtilityService } from '../../../service';
import { IGoalType, IExternalModal } from '../../../models';
import { Subscription } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-goal-dialog',
  templateUrl: './goal-dialog.component.html',
  styleUrls: ['./goal-dialog.component.scss']
})
export class GoalDialogComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input()
  goal: IGoalType = null;
  @Input()
  modelId = 'goal-dialog';
  formObj: FormGroup;
  isSubmit = false;
  popUpType = 'GOAL_ADD';
  private modalSubscription: Subscription;
  defaultConfig: IExternalModal;
  QUILL_OPTIONS = {
    theme: 'snow',
    placeholder: 'Write your note here ...',
    toolbar: [
      [
        'bold',
        'italic',
        'underline',
        'strike',
        'code',
        'image'
      ]
    ]
  };

  constructor(
    private goalService: GoalService,
    private appService: AppService,
    private fb: FormBuilder,
    private toastr: UtilityService
  ) { }

  ngOnInit(): void {
    this.formObj = this.fb.group({
      _id: [''],
      title: ['', [Validators.required]],
      isAchieved: [false],
      isPinned: [false],
      description: [''],
      accomplishTenure: [null],
      operationType: ['ADD']
    });
    this.subscribeToModal();
  }

  ngAfterViewInit() {
    $('#' + this.modelId).modal('toggle');
    const externalModal = this.appService.externalModal;
    const defaultConfig = this.defaultConfig;
    const modelId = this.modelId;
    const popupType = this.popUpType;
    // tslint:disable-next-line: only-arrow-functions
    $('#' + modelId).on('hidden.bs.modal', () => {
      externalModal.next({
        ...defaultConfig,
        [popupType]: false
      });
    });
  }

  ngOnDestroy() {
    this.modalSubscription.unsubscribe();
  }

  private subscribeToModal() {
    this.modalSubscription = this.appService.externalModal.subscribe(data => {
      this.defaultConfig = { ...data };
      if (data.data.goal) {
        this.popUpType = 'GOAL_UPDATE';
        this.goal = data.data.goal;
        this.formObj.patchValue({
          _id: this.goal._id,
          title: this.goal.title,
          description: this.goal.description,
          isAchieved: this.goal.isAchieved,
          isPinned: this.goal.isPinned,
          accomplishTenure: this.goal.accomplishTenure,
          operationType: 'UPDATE'
        });
      }
    });
  }

  submit() {
    if (this.formObj.valid) {
      this.isSubmit = true;
      this.goalService.goalOperation(this.formObj.value)
        .subscribe(() => {
          this.isSubmit = false;
          $(`#${this.modelId}`).modal('hide');
          let message = 'Goal created';
          if (this.formObj.value._id) {
            message = 'Goal updated';
          }
          this.toastr.toastrSuccess(message);
        },
        (() => {
          this.isSubmit = false;
        })
        );
    }
  }

}
