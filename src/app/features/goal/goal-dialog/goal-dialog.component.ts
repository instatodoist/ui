import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GoalService, AppService, UtilityService } from '../../../service';
import { IGoalType, IExternalModal, IGoalConditions } from '../../../models';
import { Subscription } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-goal-dialog',
  templateUrl: './goal-dialog.component.html',
  styleUrls: ['./goal-dialog.component.scss']
})
export class GoalDialogComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() // Goal object
  goal: IGoalType = null;
  @Input() // model ID
  modelId = 'goal-dialog';
  @Input() // parent Conditions
  conditions: IGoalConditions;
  formObj: FormGroup;
  isSubmit = false;
  popUpType = 'GOAL_ADD';
  private modalSubscription: Subscription;
  defaultConfig: IExternalModal;
  QUILL_OPTIONS: unknown;

  constructor(
    private goalService: GoalService,
    private appService: AppService,
    private fb: FormBuilder,
    private toastr: UtilityService
  ) { }

  ngOnInit(): void {
    this.QUILL_OPTIONS = {
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
      if (data.data.conditions) {
        this.conditions = data.data.conditions;
        console.log(this.conditions);
      }
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
      delete this.formObj.value.accomplishTenure;
      this.goalService.goalOperation(this.formObj.value, this.conditions)
        .subscribe(() => {
          this.isSubmit = false;
          $(`#${this.modelId}`).modal('hide');
          let message = 'Note created';
          if (this.formObj.value._id) {
            message = 'Note updated';
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
