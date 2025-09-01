import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task';

interface Category {
  id: number;
  name: string;
}

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.html',
  styleUrls: ['./tasks.scss'],
  standalone: false
})
export class TasksComponent implements OnInit {
  tasks: any[] = [];
  statuses = ['InProgress', 'Completed', 'Canceled'];
  priorities = ['High', 'Low'];
  userCategories: Category[] = [];
  filters = { status: '', category: '', priority: '' };

  showModal = false;
  isEditing = false;
  currentTask: any = {
    id: 0,
    title: '',
    description: '',
    dueDate: '',
    priority: 'High',
    category: '',
    status: 'InProgress'
  };

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.loadUserCategories(); // أولاً نحمل الكاتيجوريز
    this.loadTasks();          // بعدين نحمل المهام
  }

  loadTasks() {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
    });
  }

  loadUserCategories() {
    this.taskService.getUserCategories().subscribe(
      (cats: Category[]) => {
        console.log('Categories from API:', cats);
        this.userCategories = cats;

        // خزنهم داخل الخدمة عشان add/update task يستخدمهم
        this.taskService.userCategories = cats;

        // حدد default category للمهمة الحالية إذا موجودة
        if (this.userCategories.length > 0 && !this.currentTask.category) {
          this.currentTask.category = this.userCategories[0].name;
        }
      },
      (err) => console.error('Error loading categories', err)
    );
  }

  get filteredTasks() {
    return this.tasks.filter(task =>
      (!this.filters.status || task.status === this.filters.status) &&
      (!this.filters.category || task.category === this.filters.category) &&
      (!this.filters.priority || task.priority === this.filters.priority)
    );
  }

  addTask() {
    this.isEditing = false;
    this.showModal = true;

    this.currentTask = {
      id: 0,
      title: '',
      description: '',
      dueDate: '',
      priority: 'High',
      category: this.userCategories.length > 0 ? this.userCategories[0].id : 0, // 👈 نخزن id مش title
      status: 'InProgress'
    };
  }


  editTask(task: any) {
    this.isEditing = true;
    this.currentTask = { ...task };
    this.showModal = true;
  }

  deleteTask(task: any) {
    this.taskService.deleteTask(task.id).subscribe(() => {
      this.tasks = this.tasks.filter(t => t.id !== task.id);
    });
  }

  saveTask() {
    if (this.isEditing) {
      this.taskService.updateTask(this.currentTask.id, this.currentTask)
        .subscribe((updated: any) => {
          const index = this.tasks.findIndex(t => t.id === updated.id);
          if (index > -1) this.tasks[index] = updated;
          this.showModal = false;
        });
    } else {
      this.taskService.addTask(this.currentTask)
        .subscribe((created: any) => {
          this.tasks.push(created);
          this.showModal = false;
        });
    }
  }

  closeModal() {
    this.showModal = false;
  }

  markNextStatus(task: any) {
    if (task.status === 'InProgress') task.status = 'Completed';
    else if (task.status === 'Completed') task.status = 'Canceled';
    this.taskService.updateTask(task.id, task).subscribe();
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
