import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DepartmentService } from 'src/app/department.service';
import { UserService } from 'src/app/app.service';
import { Department } from 'src/app/User'; // Assuming Department and User models are correctly defined

@Component({
  selector: 'app-update-department',
  templateUrl: './update-department.component.html',
  styleUrls: ['./update-department.component.scss']
})
export class UpdateDepartmentComponent implements OnInit {
  department: Department | undefined;
  isLoggedIn: boolean = false;
  name: string | null | undefined;
  form: FormGroup; // Define form as a FormGroup for managing form controls

  constructor(
    private userService: UserService, // Assuming UserService manages user authentication
    private departmentService: DepartmentService, // Service for managing department data
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Initialize the form with a single control for the department name
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]) // 'name' form control with required validation
    });
  }

  ngOnInit(): void {
    this.checkAuthentication();
    this.name = localStorage.getItem('name');
    const id = this.route.snapshot.params['id'];
    
    // Fetch department details by ID
    this.departmentService.getDepartmentById(id).subscribe(
      (data: Department) => {
        this.department = data;
        this.initializeForm(); // Set initial form values with fetched department name
      },
      (error) => {
        console.error('Failed to fetch department:', error);
      }
    );
  }

  initializeForm(): void {
    // Populate the form with the fetched department name
    this.form.setValue({
      name: this.department?.name || '', // Set the 'name' control value from department data (or empty string)
    });
  }

  checkAuthentication(): void {
    // Check user authentication status
    this.isLoggedIn = this.userService.isLoggedIn();
    if (!this.isLoggedIn) {
      alert('You are not logged in. Please log in to update department details.');
      this.router.navigate(['/login']); // Redirect to login page if not authenticated
    }
  }

  submit(): void {
    if (this.isLoggedIn && this.department) {
      // Retrieve form data
      const updatedName = this.form.value.name;
      // Update department name in the existing department object
      this.department.name = updatedName;

      // Call the service to update the department
      this.departmentService.updateDepartment(this.department.id, this.department).subscribe(
        (data) => {
          console.log('Department updated successfully:', data);
          this.router.navigate(['/departments']); // Redirect to department list after successful update
        },
        (error) => {
          console.error('Failed to update department:', error);
          // Handle error (e.g., display error message)
        }
      );
    } else {
      alert('You are not logged in. Please log in to update department details.');
      this.router.navigate(['/login']);
    }
  }

  logout(): void {
    this.userService.logout(); // Call the logout method from the UserService
    this.router.navigate(['/login']); // Redirect to login page after logout
  }
}
