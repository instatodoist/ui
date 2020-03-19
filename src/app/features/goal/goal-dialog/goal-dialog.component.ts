import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { GoalService } from '../../../service/goal/goal.service';
import { GoalType } from '../../../models/goal.model';
import { MDCDialog } from '@material/dialog';

@Component({
  selector: 'app-goal-dialog',
  templateUrl: './goal-dialog.component.html',
  styleUrls: ['./goal-dialog.component.scss']
})
export class GoalDialogComponent implements OnInit, AfterViewInit {

  @Input()
  goal: GoalType;

  @Output()
  isOpen: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    if (this.goal._id) {
      console.log(this.goal);
      const dialog = new MDCDialog(document.querySelector('.mdc-dialog'));
      dialog.open();
      // dialog.listen('MDCDialog:opened', () => {
      //   // Assuming contentElement references a common parent element with the rest of the page's content
      //   // contentElement.setAttribute('aria-hidden', 'true');
      // });
      dialog.listen('MDCDialog:closing', () =>  {
        this.isOpen.emit(false);
      });
    }
  }

}
