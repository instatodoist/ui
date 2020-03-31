import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MDCDialog } from '@material/dialog';
import {MDCSwitch} from '@material/switch';
import {MDCMenu} from '@material/menu';
import { TodoService } from '../../../service/todo/todo.service';
import { SharedService } from '../../../service/shared/shared.service';
import { TodoType, TodoLabelType, TodoConditions } from '../../../models/todo.model';

@Component({
  selector: 'app-todo-dialog',
  templateUrl: './todo-dialog.component.html',
  styleUrls: ['./todo-dialog.component.scss']
})
export class TodoDialogComponent implements OnInit, AfterViewInit {

  @Input()
  todo: TodoType;
  @Input()
  conditions: TodoConditions = null;
  @Input()
  origin = null;
  @Output()
  isOpen: EventEmitter<boolean> = new EventEmitter<boolean>();
  menu: MDCMenu;
  menuPriority: MDCMenu;
  formObj: FormGroup;
  labels: TodoLabelType[];
  dialog: MDCDialog;
  priorityColor = 'black';
  priorities = [
    {
      name: 'P1',
      color: 'red'
    },
    {
      name: 'P2',
      color: 'orange'
    },
    {
      name: 'P3',
      color: 'blue'
    },
    {
      name: 'P4',
      color: 'black'
    }
  ];

  constructor(
    private fb: FormBuilder,
    private todoService: TodoService,
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    const labelIdVal = this.todo.label.length ? (this.todo.label.map(label  => {
      return label._id;
    })) : [];
    console.log(labelIdVal);
    this.formObj = this.fb.group({
        _id: [this.todo._id],
        title: [this.todo.title, [Validators.required]],
        scheduling: [this.todo.scheduledDate ? true : false],
        scheduledDate: [this.todo.scheduledDate ? this.todo.scheduledDate : this.sharedService.todayDate()],
        labelId: [labelIdVal],
        priority: ['P4']
      }
    );
    this.getLabels();
    this.menu = new MDCMenu(document.querySelector('.mdc-menu-labels'));
    this.menuPriority = new MDCMenu(document.querySelector('.mdc-menu-priority'));
  }

  openPriority() {
    this.menuPriority.open = true;
  }

  setPriority(priority: any) {
    this.formObj.patchValue({
      priority: priority.name
    });
    this.priorityColor = priority.color;
  }

  openLabels() {
    this.menu.open = true;
  }

  isChecked(labelId: string) {
    return this.formObj.value.labelId.indexOf(labelId) !== -1 ? true : false;
  }

  checkLabels($event, labelId: string) {
    const index = this.formObj.value.labelId.indexOf(labelId);
    if (index === -1) {
      this.formObj.value.labelId.push(labelId);
    } else {
      this.formObj.value.labelId.splice(index, 1);
    }
  }

  ngAfterViewInit() {
    if (this.todo._id) {
      this.dialog = new MDCDialog(document.querySelector('.mdc-dialog'));
      const switchControl = new MDCSwitch(document.querySelector('.mdc-switch'));
      this.dialog.open();
      // dialog.listen('MDCDialog:opened', () => {
      //   // Assuming contentElement references a common parent element with the rest of the page's content
      //   // contentElement.setAttribute('aria-hidden', 'true');
      // });
      this.dialog.listen('MDCDialog:closing', () =>  {
        this.isOpen.emit(false);
      });
    }
  }

  getLabels() {
    this.todoService
      .listTodoLabels()
      .subscribe(response => {
        this.labels = response;
      });
  }

  private getColor(priority: string): string {
    const priorityObj = this.priorities.filter(item => {
      return item.name === priority;
    });
    return priorityObj[0].color;
  }

  submit() {
    if (this.formObj.valid) {
      const postBody = this.formObj.value;
      this.todoService
        .updateTodo(postBody, this.conditions)
        .subscribe(() => {
          this.dialog.close();
        });
    }
  }
}
