import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TodoProjectType } from '../../../models';

@Component({
  selector: 'app-dialog-todo-projects',
  templateUrl: './todo-projects-dialog.component.html',
  styleUrls: ['./todo-projects-dialog.component.scss']
})
export class TodoProjectListDialogComponent implements OnInit {
  @Input() projectId = '';
  @Input() projects: TodoProjectType[] = [];
  @Output() data: EventEmitter<string> = new EventEmitter<string>();
  formObj: FormGroup;
  constructor(
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit(): void {}

  checkProject(project: TodoProjectType) {
    this.projectId = project._id;
    this.data.next(this.projectId);
  }

}
