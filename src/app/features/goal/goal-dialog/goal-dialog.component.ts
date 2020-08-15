import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GoalService, UtilityService } from '../../../service';
import { IGoalType, IExternalModal, IGoalConditions } from '../../../models';
declare let $: any;
type IGoalPopupType = 'GOAL_ADD' | 'GOAL_UPDATE';

@Component({
  selector: 'app-goal-dialog',
  templateUrl: './goal-dialog.component.html',
  styleUrls: ['./goal-dialog.component.scss']
})
export class GoalDialogComponent implements OnInit {

  @Input() // Goal object
  goal: IGoalType = null;
  @Input() // model ID
  modelId = 'goal-dialog';
  @Input() // parent Conditions
  conditions: IGoalConditions;
  defaultConfig: IExternalModal;
  formObj: FormGroup;
  QUILL_OPTIONS: unknown;
  isSubmit = false;
  popUpType: IGoalPopupType = 'GOAL_ADD';

  constructor(
    private goalService: GoalService,
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
    this.populateModal();
  }

  private populateModal() {
    if (this.goal) {
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
  }

  submit(): void {
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
