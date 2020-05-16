import { Component, OnInit, OnDestroy } from '@angular/core';
import { IGoalListType, IGoalConditions, IGoalType, IExternalModal } from '../../../models';
import { SharedService, GoalService, AppService } from '../../../service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-goal-list',
  templateUrl: './goal-list.component.html',
  styleUrls: ['./goal-list.component.scss']
})
export class GoalListComponent implements OnInit, OnDestroy {

  loader = false;
  goals$: Subscription;
  goals: IGoalListType;
  isUpdate = false;
  goal: IGoalType = null;
  extModalConfig: IExternalModal = this.appService.ExternalModelConfig;

  constructor(
    private goalService: GoalService,
    private sharedService: SharedService,
    private appService: AppService
  ) { }

  ngOnInit(): void {
    this.loader = true;
    const conditions: IGoalConditions = {
      sort: {
        updatedAt: 'DESC',
        isPinned: 'DESC'
      }
    };
    this.goals$ = this.goalService.listGoals(conditions).subscribe((data) => {
      this.goals = data;
    });
  }

  ngOnDestroy() {
    this.goals$.unsubscribe();
  }

  openUpdatePopUp(goal: IGoalType, isModal = true): void {
    if (isModal) {
      this.extModalConfig = { ...this.extModalConfig, GOAL_UPDATE: true, data: { ...this.extModalConfig.data, goal } };
      this.appService.externalModal.next(this.extModalConfig);
    } else {
      goal.isPinned = !goal.isPinned;
      this.submit({
        isPinned: goal.isPinned,
        _id: goal._id,
        title: goal.title,
        description: goal.description
      });
    }
  }

  submit(goal: IGoalType = null) {
    goal.operationType = 'UPDATE';
    this.goalService.goalOperation(goal).subscribe();
  }

}
