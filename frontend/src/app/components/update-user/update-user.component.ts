import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/app.service';
import { User } from 'src/app/User';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss']
})
export class UpdateUserComponent implements OnInit {
  user: User | undefined;
  data: any;
  isLoggedIn: boolean = false;
  name: string | null | undefined;

  constructor(
    private service: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkAuthentication();
    this.name = localStorage.getItem('name');
    const id = this.route.snapshot.params['id'];
    this.service.getUser(id).subscribe(
      (data) => {
        this.user = data;
        this.initializeForm();
      },
      (error) => {
        console.error('Failed to fetch user:', error);
      }
    );
  }

  initializeForm(): void {
    this.form.setValue({
      name: this.user?.name || '',
      email: this.user?.email || '',
    });
  }

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  checkAuthentication(): void {
    this.isLoggedIn = this.service.isLoggedIn();
    if (!this.isLoggedIn) {
      alert('You are not logged in. Please log in to update user details.');
      this.router.navigate(['/login']);
    }
  }

  submit(): void {
    if (this.isLoggedIn && this.user) {
      this.data = this.form.value;
      this.user.name = this.data.name;
      this.user.email = this.data.email;

      this.service.updateUser(this.user.id, this.user).subscribe(
        (data) => {
          console.log('User updated successfully:', data);
          this.router.navigate(['/user']); // Redirect to user list after successful update
        },
        (error) => {
          console.error('Failed to update user:', error);
          // Handle error (e.g., display error message)
        }
      );
    } else {
      alert('You are not logged in. Please log in to update user details.');
      this.router.navigate(['/login']);
    }
  }

  logout(): void {
    this.service.logout();
    this.router.navigate(['/login']); // Redirect to login page after logout
  }
}
