import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GOAL_QUERY } from '../../gql/goal.gql';
import {Apollo} from 'apollo-angular';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';
import { GoalConditions, GoalListType} from '../../models/goal.model';

@Injectable({
  providedIn: 'root'
})
export class GoalService {
  API_URL = environment.API_URL;
  constructor(private apollo: Apollo) { }

  listGoals(conditions: GoalConditions): Observable<GoalListType> {
    return this.apollo
    .watchQuery({
        query: GOAL_QUERY,
        variables: conditions,
        fetchPolicy: 'network-only'
      })
      .valueChanges.pipe(map(({data}: any ) => {
        return data.listThought;
      }));
  }
}
