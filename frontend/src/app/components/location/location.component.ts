// location.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/app.service';
import { LocationService } from 'src/app/location.service';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {
  locationForm!: FormGroup;
  isLoggedIn: boolean = false;
  name: string | null | undefined;
  locations: any[] = [];
  displayedColumns: string[] = ['id', 'name', 'action'];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private locationService: LocationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.name = localStorage.getItem('name');
    this.checkAuthentication();
    this.fetchLocations();
  }

  initializeForm(): void {
    this.locationForm = this.fb.group({
      locationName: ['', Validators.required]
    });
  }

  addLocation(): void {
    if (this.locationForm.valid) {
      const locationName = this.locationForm.value.locationName;
      this.locationService.addLocation({
        name: locationName,
        id: 0
      }).subscribe(
        () => {
          console.log('Location added successfully');
          this.fetchLocations(); // Refresh location list after addition
          this.locationForm.reset(); // Reset form after successful addition
        },
        (error) => {
          console.error('Failed to add location:', error);
          alert('Failed to add location. Please try again.');
        }
      );
    }
  }

  fetchLocations(): void {
    this.locationService.getLocations().subscribe(
      (data: any[]) => {
        this.locations = data.sort((a, b) => a.id - b.id);
        console.log('Fetched locations:', this.locations);
      },
      (error) => {
        console.error('Failed to fetch locations:', error);
        alert('Failed to fetch locations. Please try again.');
      }
    );
  }

  deleteLocation(id: number): void {
    if (this.isLoggedIn) {
      this.locationService.deleteLocation(id).subscribe(
        () => {
          console.log('Location deleted successfully');
          this.fetchLocations(); // Refresh location list after deletion
        },
        (error) => {
          console.error('Failed to delete location:', error);
          alert('Failed to delete location. Please try again.');
        }
      );
    } else {
      alert('You are not logged in. Please log in to delete locations.');
      this.router.navigate(['/login']);
    }
  }

  checkAuthentication(): void {
    this.isLoggedIn = this.userService.isLoggedIn();
    if (!this.isLoggedIn) {
      alert('You are not logged in. Please log in to manage locations.');
      this.router.navigate(['/login']);
    }
  }

  logout(): void {
    this.userService.logout();
    this.router.navigate(['/login']);
  }
}
