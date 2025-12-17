import { Component } from '@angular/core';
import {Task} from '../task';
import {Tasks as TasksService} from '../tasks';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {DatePipe} from '@angular/common';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-archive',
  imports: [
    MatIconButton,
    MatIcon,
    DatePipe,
    MatCardModule,
  ],
  templateUrl: './archive.html',
  styleUrl: './archive.css',
})
export class Archive {
  public tasks: Task[] = [];

  constructor(
    private tasksService: TasksService
  ) {
  }

  ngOnInit() {
    this.tasksService.index(true).subscribe((tasks) => {
      this.tasks = tasks;
    });
  }

  delete(task: Task) {
    if (!confirm('Are you sure?')) {
      return;
    }

    this.tasksService.delete(task).subscribe(() => {
      this.ngOnInit();
    });
  }
}
