import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loginError: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login(): void {
    if (this.loginForm.invalid) {
      console.error('Invalid login form.');
      return;
    }

    this.http.post<any>('http://127.0.0.1:8000/api/login/', this.loginForm.value).subscribe(
      response => {
        localStorage.setItem('token', response.access);
        localStorage.setItem('refresh_token', response.refresh);
        localStorage.setItem('name', this.loginForm.value.username);
        this.router.navigate(['/dashboard']);
      },
      error => {
        console.error('Login failed:', error);
        this.loginError = 'Invalid username or password';
      }
    );
  }
}
