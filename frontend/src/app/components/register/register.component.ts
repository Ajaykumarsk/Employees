import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'] // Updated to use SCSS file
})
export class RegisterComponent {
  registrationForm: FormGroup;
  registrationError: string = '';

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router) {
    this.registrationForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  register() {
    if (this.registrationForm.invalid) {
      return;
    }

    const { username, email, password, confirmPassword } = this.registrationForm.value;

    if (password !== confirmPassword) {
      this.registrationError = 'Passwords do not match';
      return;
    }

    const requestData = {
      username,
      email,
      password,
      confirm_password: confirmPassword
    };

    this.http.post<any>('http://localhost:8000/api/register/', requestData).subscribe(
      (response) => {
        // Registration successful, navigate to login or any other page
        this.router.navigate(['/login']);
      },
      (error) => {
        // Registration failed, handle error
        console.error('Registration failed:', error);
        this.registrationError = error.error.detail || 'Registration failed';
      }
    );
  }
}
