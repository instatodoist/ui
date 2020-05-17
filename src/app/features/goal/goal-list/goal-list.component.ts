import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { IGoalListType, IGoalConditions, IGoalType, IExternalModal } from '../../../models';
import { SharedService, GoalService, AppService } from '../../../service';
import { Subscription } from 'rxjs';
declare var $: any;
@Component({
  selector: 'app-goal-list',
  templateUrl: './goal-list.component.html',
  styleUrls: ['./goal-list.component.scss']
})
export class GoalListComponent implements OnInit, OnDestroy, AfterViewInit {

  loader = false;
  goals$: Subscription;
  goals: IGoalListType;
  isUpdate = false;
  goal: IGoalType = null;
  extModalConfig: IExternalModal = this.appService.ExternalModelConfig;
  conditions: IGoalConditions = {
    filter: {
      isAchieved: false
    },
    sort: {
      updatedAt: 'DESC',
      isPinned: 'DESC'
    }
  };

  constructor(
    private goalService: GoalService,
    private sharedService: SharedService,
    private appService: AppService
  ) { }

  ngOnInit(): void {
    this.loader = true;
    this.goals$ = this.goalService.listGoals(this.conditions).subscribe((data) => {
      this.goals = data;
    });
  }

  ngAfterViewInit() {
    $('[data-toggle="tooltip"]').tooltip();
  }

  ngOnDestroy() {
    this.goals$.unsubscribe();
  }

  updateGoal(goal: IGoalType = null, type = 'IS_PINNED') {
    const goalObj = {
      _id: goal._id,
      title: goal.title,
      description: goal.description
    };
    if (type === 'IS_PINNED') {
      this.submit({
        ...goalObj,
        isPinned: !goal.isPinned,
      });
    } else if (type === 'IS_ARCHIEVED') {
      this.submit({
        ...goalObj,
        isAchieved: !goal.isAchieved
      });
    } else if (type === 'IS_DELETE') {
      this.submit({
        ...goalObj,
        isDelete: !goal.isDelete
      });
    }
  }

  openUpdatePopUp(goal: IGoalType = null, type = 'GOAL_UPDATE'): void {
    if (type === 'GOAL_UPDATE') {
      this.extModalConfig = {
        ...this.extModalConfig,
        GOAL_ADD: false,
        GOAL_UPDATE: true,
        data: {
          ...this.extModalConfig.data,
          goal
        }
      };
    } else {
      this.extModalConfig = {
        ...this.extModalConfig,
        GOAL_ADD: true,
        GOAL_UPDATE: false,
        data: {
          ...this.extModalConfig.data, goal: null
        }
      };
    }
    this.appService.externalModal.next(this.extModalConfig);
  }

  submit(goal: IGoalType = null) {
    goal.operationType = 'UPDATE';
    this.goalService.goalOperation(goal, this.conditions).subscribe();
  }

}
