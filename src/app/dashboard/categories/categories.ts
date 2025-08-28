import { Component } from '@angular/core';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.html',
  styleUrls: ['./categories.scss'],
  standalone: false
})
export class CategoriesComponent {
  categories = [
    { id: 1, name: 'Work', description: 'Tasks related to work' },
    { id: 2, name: 'Personal', description: 'Personal tasks and errands' }
  ];

  showModal = false;
  isEditing = false;
  currentCategory: any = { id: 0, name: '', description: '' };

  addCategory() {
    this.isEditing = false;
    this.currentCategory = { id: this.categories.length + 1, name: '', description: '' };
    this.showModal = true;
  }

  editCategory(category: any) {
    this.isEditing = true;
    this.currentCategory = { ...category };
    this.showModal = true;
  }

  deleteCategory(category: any) {
    this.categories = this.categories.filter(c => c.id !== category.id);
  }

  saveCategory() {
    if (this.isEditing) {
      const index = this.categories.findIndex(c => c.id === this.currentCategory.id);
      if (index > -1) this.categories[index] = { ...this.currentCategory };
    } else {
      this.categories.push({ ...this.currentCategory });
    }
    this.showModal = false;
  }

  closeModal() {
    this.showModal = false;
  }
}
