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

  openUpdatePopUp(todo: IGoalType): void {
    this.extModalConfig = { ...this.extModalConfig, GOAL_UPDATE: true, data: { ...this.extModalConfig.data, goal: todo } };
    this.appService.externalModal.next(this.extModalConfig);
  }

}
