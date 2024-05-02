import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/app.service';
import { DepartmentService } from 'src/app/department.service';
import { LocationService } from 'src/app/location.service';
import { User } from 'src/app/User';
import { Department } from 'src/app/User';
import { Location } from 'src/app/User';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  name: string | null | undefined;
  isLoggedIn: boolean = false;
  departments: any[] = [];
  locations: any[] = [];

  constructor(
    private userService: UserService,
    private router: Router,
    private departmentService: DepartmentService,
    private locationService: LocationService
  ) {}

  ngOnInit(): void {
    this.checkAuthentication();
    this.name = localStorage.getItem('name');
    this.loadDepartments();
    this.loadLocations();
  }

  checkAuthentication(): void {
    this.isLoggedIn = this.userService.isLoggedIn();
    if (!this.isLoggedIn) {
      alert('You are not logged in. Please log in to access the dashboard.');
      this.router.navigate(['/login']);
    }
  }

  form = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    gender: new FormControl('', Validators.required),
    department: new FormControl('', Validators.required),
    location: new FormControl('', Validators.required),
    dateOfJoining: new FormControl('', Validators.required)
  });

  addUser(): void {
    const userData: User = {
      id: 0,
      name: this.form.value.name || '',
      email: this.form.value.email || '',
      gender: this.form.value.gender || '',
      dateOfJoining: this.form.value.dateOfJoining || '',
      department: this.form.value.department || '', // Ensure department is assigned as a string
      location: this.form.value.location || ''     
    };

    this.userService.addUser(userData).subscribe(
      (data) => {
        this.router.navigate(['/user']);
      },
      (error) => {
        console.error('Error adding user:', error);
        // Handle error (e.g., display error message)
      }
    );
  }

  loadDepartments(): void {
    this.departmentService.getDepartments().subscribe(
      (departments) => {
        this.departments = departments;
      },
      (error) => {
        console.error('Error fetching departments:', error);
      }
    );
  }

  loadLocations(): void {
    this.locationService.getLocations().subscribe(
      (locations) => {
        this.locations = locations;
      },
      (error) => {
        console.error('Error fetching locations:', error);
      }
    );
  }

  logout(): void {
    this.userService.logout();
    this.router.navigate(['/login']);
  }
}
