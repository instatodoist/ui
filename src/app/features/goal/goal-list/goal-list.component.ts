import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { IGoalListType, IGoalConditions, IGoalType, IExternalModal } from '../../../models';
import { GoalService, AppService } from '../../../service';
import { Subscription } from 'rxjs';
declare var $: any;
@Component({
  selector: 'app-goal-list',
  templateUrl: './goal-list.component.html',
  styleUrls: ['./goal-list.component.scss']
})
export class GoalListComponent implements OnInit, AfterViewInit {

  loader = false;
  // goals$: Subscription;
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
    private appService: AppService
  ) { }

  ngOnInit(): void {
    this.loader = true;
    this.goalService.listGoals(this.conditions).subscribe((data: any) => {
      if (typeof data !== 'undefined') {
        this.goals = data.listThought;
      }
    });
  }

  ngAfterViewInit() {
    $('[data-toggle="tooltip"]').tooltip();
  }

  // ngOnDestroy() {
  //   // this.goals$.unsubscribe();
  // }

  updateGoal(goal: IGoalType = null, type = 'IS_PINNED') {
    const goalObj = {
      _id: goal._id,
      title: goal.title,
      description: goal.description
    };
    if (type === 'IS_PINNED') {
      this.submit({
        ...goalObj,
        operationType: 'UPDATE',
        isPinned: !goal.isPinned,
      });
    } else if (type === 'IS_ARCHIEVED') {
      this.submit({
        ...goalObj,
        operationType: 'UPDATE',
        isAchieved: !goal.isAchieved
      });
    } else if (type === 'DELETE') {
      this.submit({
        ...goalObj,
        operationType: 'DELETE',
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
    goal.operationType = goal.operationType || 'UPDATE';
    this.goalService.goalOperation(goal, this.conditions).subscribe();
  }

}
