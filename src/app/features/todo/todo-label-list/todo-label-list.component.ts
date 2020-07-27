import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../../service';
import { TodoLabelType } from '../../../models';
import { UtilityService  } from '../../../service';
declare let $: any;
@Component({
  selector: 'app-todo-tags-list',
  templateUrl: './todo-label-list.component.html',
  styleUrls: ['./todo-label-list.component.scss']
})
export class TodoLabelListComponent implements OnInit {

  label: TodoLabelType = null;
  isOpen = false;
  modelIdPopUp = '';

  constructor(
    private todoService: TodoService,
    private toast: UtilityService
  ) { }

  defaultLabelColor = '#1e3d73'; // default color
  labels: TodoLabelType[] = [];

  ngOnInit(): void {
    this.todoService.listTodoLabels().subscribe( data => {
      this.labels = data;
    });
  }

  openPopup(modelId: string, label: TodoLabelType = null) {
    this.modelIdPopUp = modelId;
    this.isOpen = true;
    this.label = label;
    setTimeout(() => {
      $(`#${modelId}`).modal('toggle'); // Open & close Popup
      $(`#${modelId}`).on('hidden.bs.modal', () => { // listen modal close event
        this.isOpen = false;
      });
    }, 0);
  }

  labelOperationCompletion() {
    this.isOpen = false;
    $(`#${this.modelIdPopUp}`).modal('toggle');
    if (this.label) {
      this.toast.toastrSuccess('Tag has been updated');
    } else {
      this.toast.toastrSuccess('Tag has been added');
    }
    this.label = null;
  }

  deleteLabel(label: TodoLabelType) {
    this.todoOperationExec({
      _id: label._id,
      operationType: 'DELETE'
    });
  }

  todoOperationExec(postBody) {
    this.todoService
      .todoLabelOperation(postBody)
      .subscribe(() => {
        if (postBody.operationType === 'DELETE') {
          this.toast.toastrSuccess('Tag has been deleted');
        }
      });
  }

}
