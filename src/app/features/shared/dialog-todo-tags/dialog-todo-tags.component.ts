import { Component, OnInit, Input, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TodoLabelType } from '../../../models';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-dialog-todo-tags',
  templateUrl: './dialog-todo-tags.component.html',
  styleUrls: ['./dialog-todo-tags.component.scss'],
})
export class DialogTodoTagsComponent implements OnInit {

  @Input() labelIds: string[] = [];
  @Input() labels: TodoLabelType[] = [];
  @Input() modelId = 'tagsModal';
  @Output() data: EventEmitter<string[]> = new EventEmitter<string[]>();

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void { }

  // auto checked the labels if exist
  isChecked(label: TodoLabelType) {
    return this.labelIds.indexOf(label._id) !== -1 ? true : false;
  }

  // check & uncheck labels
  checkLabels(label: TodoLabelType) {
    const labelId = label._id;
    const index = this.labelIds.indexOf(labelId);
    if (index === -1) {
      this.labelIds.push(labelId);
    } else {
      this.labelIds.splice(index, 1);
    }
    this.data.next(this.labelIds);
  }

  redirectToTagsUi() {
    $('.modal').modal('hide'); // closes all active pop ups.
    $('.modal-backdrop').remove();
    this.router.navigate(['/tasks/tags']);
  }

}
