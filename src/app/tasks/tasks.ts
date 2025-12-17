import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {forkJoin, Observable} from 'rxjs';


import { Task } from '../task';
import {Tasks as TasksService} from '../tasks';

import {MatButton} from '@angular/material/button';
import {MatFormField, MatHint, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatDatepicker, MatDatepickerToggle} from '@angular/material/datepicker';
import {MatCard, MatCardActions, MatCardHeader, MatCardSubtitle, MatCardTitle} from '@angular/material/card';
import {MatCheckbox} from '@angular/material/checkbox';
import {DatePipe} from '@angular/common';


@Component({
  selector: 'app-tasks',
  imports: [
    FormsModule,
    MatButton,
    MatFormField,
    MatLabel,
    MatHint,
    MatDatepickerToggle,
    MatCard,
    MatCardHeader,
    MatCardSubtitle,
    MatCardTitle,
    MatCheckbox,
    MatCardActions,
    DatePipe,
    MatInput
  ],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class Tasks implements OnInit {
  tasks: Task[] = [];
  newTask: Task = {};
  public isProcessing = false;

  constructor(
    private tasksService: TasksService,
  ) {


  }

  ngOnInit(): void {
    this.tasksService.index().subscribe((tasks) => {
      this.tasks = tasks;
    })
  }

  addTask() {
    if (this.newTask.title === undefined) {
      return;
    }

    this.newTask.completed = false;
    this.newTask.archived = false;

    this.tasks.unshift(this.newTask);

    this.isProcessing = true;
    this.tasksService.post(this.newTask).subscribe((task) => {
      this.newTask = {};
      this.ngOnInit();
    });
  }
  handleChange(task: Task) {
    this.tasksService.put(task).subscribe({
      error: err => {
        alert(err);
        this.ngOnInit();
      }
    });
  }
  archiveCompleted() {
    const observables: Observable<any>[] = [];
    for (const task of this.tasks) {
      if (!task.completed) {
        continue;
      }

      task.archived = true;
      observables.push(this.tasksService.put(task));
    }

    // refresh page when all updates finished
    forkJoin(observables).subscribe(() => {
      this.ngOnInit();
    });


  }
  canArchiveCompleted() {
    for (const task of this.tasks) {
      if (task.completed) {
        return true;
      }
    }
    return false;
  }

  canAddTask() {
    if (this.isProcessing) {
      return false;
    }

    return !!this.newTask.title;
  }

}
