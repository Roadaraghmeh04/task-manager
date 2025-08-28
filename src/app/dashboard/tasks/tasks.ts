import { Component } from '@angular/core';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.html',
  styleUrls: ['./tasks.scss'],
  standalone: false
})
export class TasksComponent {
  tasks = [
    { id: 1, title: 'Buy groceries', description: 'Milk, Bread', dueDate: '2025-08-25', priority: 'High', category: 'Personal', status: 'InProgress' },
    { id: 2, title: 'Finish project', description: 'Angular assignment', dueDate: '2025-08-28', priority: 'Low', category: 'Work', status: 'Completed' }
  ];

  statuses = ['InProgress', 'Completed', 'Canceled'];
  categories = ['Work', 'Personal'];
  priorities = ['High', 'Medium', 'Low'];

  filters = {status: '', category: '', priority: ''};

  showModal = false;
  isEditing = false;
  currentTask: any = {id: 0, title: '', description: '', dueDate: '', priority: '', category: '', status: 'InProgress'};

  get filteredTasks() {
    return this.tasks.filter(task =>
      (!this.filters.status || task.status === this.filters.status) &&
      (!this.filters.category || task.category === this.filters.category) &&
      (!this.filters.priority || task.priority === this.filters.priority)
    );
  }

  markNextStatus(task: any) {
    if(task.status === 'InProgress') task.status = 'Completed';
    else if(task.status === 'Completed') task.status = 'Canceled';
  }

  deleteTask(task: any) {
    this.tasks = this.tasks.filter(t => t.id !== task.id);
  }

  editTask(task: any) {
    this.isEditing = true;
    this.currentTask = {...task};
    this.showModal = true;
  }

  addTask() {
    this.isEditing = false;
    this.currentTask = {
      id: this.tasks.length + 1,
      title: '',
      description: '',
      dueDate: '',
      priority: 'Medium',
      category: 'Work',
      status: 'InProgress' // افتراضي
    };
    this.showModal = true;
  }

  saveTask() {
    if (this.isEditing) {
      const index = this.tasks.findIndex(t => t.id === this.currentTask.id);
      if (index > -1) this.tasks[index] = {...this.currentTask};
    } else {
      this.tasks.push({...this.currentTask});
    }
    this.showModal = false;
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
      case 'Medium': return '#4a90e2';
      case 'Low': return '#fbb8d1';
      default: return '#ccc';
    }
  }
}
