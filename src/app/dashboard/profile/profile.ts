import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss'],
  standalone: false
})
export class ProfileComponent implements OnInit {
  user: any = {};

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.http.get('/api/users/profile').subscribe({
      next: (res: any) => {
        this.user = res;
      },
      error: err => console.error('Failed to load profile', err)
    });
  }
}
