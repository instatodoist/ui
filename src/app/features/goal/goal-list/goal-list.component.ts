import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { GoalListType, GoalConditions } from '../../../models/goal.model';
import { SharedService} from '../../../service/shared/shared.service';
import { GoalService } from '../../../service/goal/goal.service';

@Component({
  selector: 'app-goal-list',
  templateUrl: './goal-list.component.html',
  styleUrls: ['./goal-list.component.scss']
})
export class GoalListComponent implements OnInit {

  loader = false;
  goals: GoalListType;

  constructor(private goalService: GoalService, private sharedService: SharedService) { }

  ngOnInit(): void {
    this.loader = true;
    const conditions: GoalConditions = {
      sort: {
        updatedAt: 'DESC',
        isPinned: 'DESC'
      }
    };
    this.goalService.listGoals(conditions)
      .subscribe((data) => {
        this.goals = data;
        this.loader = false;
    });
  }

}
