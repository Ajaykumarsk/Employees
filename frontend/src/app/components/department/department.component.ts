import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/app.service';
import { DepartmentService } from 'src/app/department.service';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent implements OnInit {
  departmentForm!: FormGroup;
  isLoggedIn: boolean = false;
  userName: string | null | undefined;

  departments: any[] = [];
  displayedColumns: string[] = ['id', 'name','action'];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private departmentService: DepartmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeDepartmentForm();
    this.userName = localStorage.getItem('name');
    this.checkAuthentication();
    this.fetchDepartments();
  }

  initializeDepartmentForm(): void {
    this.departmentForm = this.fb.group({
      departmentName: ['', Validators.required]
    });
  }

  checkAuthentication(): void {
    this.isLoggedIn = this.userService.isLoggedIn();
    if (!this.isLoggedIn) {
      alert('You are not logged in. Please log in to manage departments.');
      this.router.navigate(['/login']);
    }
  }

  addDepartment(): void {
    if (this.departmentForm.valid) {
      const departmentName = this.departmentForm.value.departmentName;
      this.departmentService.addDepartment({
        name: departmentName,
        id: 0
      }).subscribe(
        () => {
          console.log('Department added successfully');
          this.fetchDepartments(); // Refresh department list after addition
          this.departmentForm.reset(); // Reset form after successful addition
        },
        (error) => {
          console.error('Failed to add department:', error);
          alert('Failed to add department. Please try again.');
        }
      );
    }
  }

  fetchDepartments(): void {
    this.departmentService.getDepartments().subscribe(
      (data: any[]) => {
        this.departments = data.sort((a, b) => a.id - b.id);
        console.log('Fetched departments:', this.departments);
      },
      (error) => {
        console.error('Failed to fetch departments:', error);
        alert('Failed to fetch departments. Please try again.');
      }
    );
  }

  deleteDepartment(id: number): void {
    if (this.isLoggedIn) {
      this.departmentService.deleteDepartment(id).subscribe(
        () => {
          console.log('Department deleted successfully');
          this.fetchDepartments(); // Refresh department list after deletion
        },
        (error) => {
          console.error('Failed to delete department:', error);
          alert('Failed to delete department. Please try again.');
        }
      );
    } else {
      alert('You are not logged in. Please log in to delete departments.');
      this.router.navigate(['/login']);
    }
  }

  logout(): void {
    this.userService.logout();
    this.router.navigate(['/login']);
  }
}
