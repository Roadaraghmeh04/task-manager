import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.html',
  styleUrls: ['./tasks.scss'],
  standalone: false
})
export class TasksComponent implements OnInit {
  tasks: any[] = [];

  statuses = ['InProgress', 'Completed', 'Canceled'];
  categories = ['Work', 'Personal'];
  priorities = ['High', 'Low'];

  filters = { status: '', category: '', priority: '' };

  showModal = false;
  isEditing = false;
  currentTask: any = {
    id: 0,
    title: '',
    description: '',
    dueDate: '',
    priority: 'High',
    category: 'Work',
    status: 'InProgress'
  };

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getTasks().subscribe((tasks: any[]) => {
      this.tasks = tasks;
    });
  }

  get filteredTasks() {
    return this.tasks.filter(task =>
      (!this.filters.status || task.status === this.filters.status) &&
      (!this.filters.category || task.category === this.filters.category) &&
      (!this.filters.priority || task.priority === this.filters.priority)
    );
  }

  markNextStatus(task: any) {
    if (task.status === 'InProgress') task.status = 'Completed';
    else if (task.status === 'Completed') task.status = 'Canceled';
    this.taskService.updateTask(task.id, task).subscribe(); // تحديث على السيرفر
  }

  deleteTask(task: any) {
    this.taskService.deleteTask(task.id).subscribe(() => {
      this.tasks = this.tasks.filter(t => t.id !== task.id);
    });
  }

  editTask(task: any) {
    this.isEditing = true;
    this.currentTask = { ...task };
    this.showModal = true;
  }

  addTask() {
    this.isEditing = false;
    this.currentTask = {
      id: 0,
      title: '',
      description: '',
      dueDate: '',
      priority: 'High',
      category: 'Work',
      status: 'InProgress'
    };
    this.showModal = true;
  }

  saveTask() {
    if (this.isEditing) {
      this.taskService.updateTask(this.currentTask.id, this.currentTask).subscribe((updated: { id: any; }) => {
        const index = this.tasks.findIndex(t => t.id === updated.id);
        if (index > -1) this.tasks[index] = updated;
        this.showModal = false;
      });
    } else {
      this.taskService.addTask(this.currentTask).subscribe((created: any) => {
        this.tasks.push(created);
        this.showModal = false;
      });
    }
  }

  closeModal() {
    this.showModal = false;
  }

  getStatusColor(status: string) {
    switch (status) {
      case 'InProgress': return '#fbb8d1';
      case 'Completed': return '#7bbef5';
      case 'Canceled': return '#ccc';
      default: return '#ccc';
    }
  }

  getPriorityColor(priority: string) {
    switch (priority) {
      case 'High': return '#7bbef5';
      case 'Low': return '#fbb8d1';
      default: return '#ccc';
    }
  }

}
