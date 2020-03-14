import { Component, OnInit, ChangeDetectionStrategy, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { TodoListType, TodoSortType } from '../../../models/todo.model';
import {  TodoConditions } from '../../../models/todo.model';
import { TodoService } from '../../../service/todo/todo.service';
import {MDCDialog} from '@material/dialog';
import { Inject }  from '@angular/core';
import { DOCUMENT } from '@angular/common';
@Component({
  selector: 'app-todo-inbox',
  templateUrl: './todo-inbox.component.html',
  styleUrls: ['./todo-inbox.component.scss'],
})
export class TodoInboxComponent implements OnInit, AfterViewInit {
  @ViewChild('dialog',  { static: false }) public dialog: ElementRef;
  loader = false;
  todos: TodoListType;

  constructor(private toddService: TodoService, @Inject(DOCUMENT) document) {
    // setTimeout(()=>{
    //   const dialog = new MDCDialog(document.getElementById('dialog'));
    // }, 1000)
   }

  ngOnInit(): void {
    this.loader = true;
    const conditions: TodoConditions = {
      sort: {
        updatedAt: 'DESC'
      },
      filter: {
        isCompleted: false
      }
    };
    this.toddService.listTodos(conditions)
      .subscribe((data) => {
        this.todos = data;
        this.loader = false;
        // const dialog = new MDCDialog(document.querySelector('.mdc-dialog'));
    });
  }

  ngAfterViewInit() {
    // viewChild is set after the view has been initialized
    // setTimeout(()=>{
    //   const dialog = new MDCDialog(document.getElementById('dialog'));
    // }, 1000)
  }

}
