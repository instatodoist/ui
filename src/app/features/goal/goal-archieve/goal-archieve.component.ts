import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { IGoalListType, IGoalConditions, IGoalType, IExternalModal } from '../../../models';
import { GoalService, AppService } from '../../../service';
import { Subscription, combineLatest } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
declare var $: any;

@Component({
  selector: 'app-goal-archieve',
  templateUrl: './goal-archieve.component.html',
  styleUrls: ['./goal-archieve.component.scss']
})
export class GoalArchieveComponent implements OnInit, OnDestroy {

  loader = false;
  goals$: Subscription;
  goals: IGoalListType;
  isUpdate = false;
  goal: IGoalType = null;
  extModalConfig: IExternalModal = this.appService.ExternalModelConfig;
  conditions: IGoalConditions = {
    filter: {
      isAchieved: true,
      q: null
    },
    sort: {
      createdAt: 'DESC',
      isPinned: 'DESC'
    },
    limit: 100
  };
  loaderImage = this.appService.loaderImage;

  constructor(
    private activatedRoute: ActivatedRoute,
    private goalService: GoalService,
    private appService: AppService
  ) { }

  ngOnInit(): void {
    combineLatest([
      this.activatedRoute.queryParams,
    ])
      .pipe(
        map(data => ({
          query: data[0],
        }))
      )
      .subscribe(data => {
        this.loader = true;
        const { query = null } = data;
        if (query && query.q) {
          this.conditions.filter.q = query.q;
        }
        this.goalService.listGoals(this.conditions).subscribe((response: any) => {
          if (typeof response !== 'undefined') {
            this.loader = false;
            this.goals = response.listThought;
          }
        }, () => {
          this.loader = false;
        });
      });
  }

  ngOnDestroy() {
    this.goals$.unsubscribe();
  }
}
