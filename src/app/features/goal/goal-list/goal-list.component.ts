import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { IGoalListType, IGoalConditions, IGoalType, IExternalModal, IOperationEnumType, ITemplateOperation } from '../../../models';
import { GoalService, AppService } from '../../../service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
declare var $: any;

@Component({
  selector: 'app-goal-list',
  templateUrl: './goal-list.component.html',
  styleUrls: ['./goal-list.component.scss']
})
export class GoalListComponent implements OnInit, AfterViewInit, OnDestroy {

  goals$: Subscription;
  goals: IGoalListType;
  isUpdate = false;
  goal: IGoalType = null;
  extModalConfig: IExternalModal = this.appService.ExternalModelConfig;
  conditions: IGoalConditions;
  loaderImage = this.appService.loaderImage;

  constructor(
    private activatedRoute: ActivatedRoute,
    private goalService: GoalService,
    private appService: AppService
  ) {
    this.conditions = {
      filter: {
        isAchieved: false,
        q: null
      },
      sort: {
        createdAt: 'DESC',
        isPinned: 'DESC'
      }
    };
  }

  ngOnInit(): void {
    this.goals$ = this.activatedRoute.queryParams
      .pipe(
        switchMap((qParams: any) => {
          const { q = null } = qParams;
          this.conditions = {
            ...this.conditions, filter: {
              ...this.conditions.filter, q
            }
          };
          return this.goalService.listGoals(this.conditions);
        })
      )
      .subscribe(
        (response) => {
          this.goals = response;
        }
      );
  }

  ngAfterViewInit() {
    $('[data-toggle="tooltip"]').tooltip();
  }

  ngOnDestroy() {
    this.goals$.unsubscribe();
  }

  openUpdatePopUp(goal: IGoalType = null, type: ITemplateOperation = 'IS_UPDATE'): void {
    if (type === 'IS_UPDATE') {
      this.extModalConfig = {
        ...this.extModalConfig,
        GOAL_ADD: false,
        GOAL_UPDATE: true,
        data: {
          ...this.extModalConfig.data,
          goal,
          conditions: this.conditions
        }
      };
    } else {
      this.extModalConfig = {
        ...this.extModalConfig,
        GOAL_ADD: true,
        GOAL_UPDATE: false,
        data: {
          ...this.extModalConfig.data, goal: null, conditions: this.conditions
        }
      };
    }
    this.appService.externalModal.next(this.extModalConfig);
  }

  updateGoal(goal: IGoalType = null, type: ITemplateOperation = 'IS_PINNED') {
    let operationType: IOperationEnumType = 'ADD';
    const goalObj = {
      _id: goal._id,
      title: goal.title,
      description: goal.description
    };
    if (type === 'IS_PINNED') {
      operationType = 'UPDATE';
      this.submit({
        ...goalObj,
        operationType,
        isPinned: !goal.isPinned,
      });
    } else if (type === 'IS_ARCHIEVED') {
      operationType = 'UPDATE';
      this.submit({
        ...goalObj,
        operationType,
        isAchieved: !goal.isAchieved
      });
    } else if (type === 'IS_DELETED') {
      operationType = 'DELETE';
      this.submit({
        ...goalObj,
        operationType,
        isDelete: !goal.isDelete
      });
    }
  }

  submit(postBody: IGoalType = null) {
    this.goalService.goalOperation(postBody, this.conditions).subscribe();
  }

}
