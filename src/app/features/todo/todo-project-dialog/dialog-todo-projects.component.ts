import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TodoProjectType } from '../../../models';

@Component({
  selector: 'app-dialog-todo-projects',
  templateUrl: './dialog-todo-projects.component.html',
  styleUrls: ['./dialog-todo-projects.component.scss']
})
export class DialogTodoProjectsComponent implements OnInit {
  @Input() projectId = '';
  @Input() projects: TodoProjectType[] = [];
  @Input() modelId = 'projectModal';
  @Output() data: EventEmitter<string> = new EventEmitter<string>();
  formObj: FormGroup;
  constructor() { }

  ngOnInit(): void {
  }

  checkProject(project: TodoProjectType) {
    this.projectId = project._id;
    this.data.next(this.projectId);
  }

}
