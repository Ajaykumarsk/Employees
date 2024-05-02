import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../app.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { User } from 'src/app/User';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.scss']
})
export class ViewUserComponent implements OnInit {
  usersDataSource: MatTableDataSource<User> = new MatTableDataSource<User>();
  displayedColumns: string[] = ['id', 'name', 'email', 'gender', 'department', 'location', 'dateOfJoining', 'action'];
  totalUsers: number = 0;
  maleUsers: number = 0;
  femaleUsers: number = 0;
  pageIndex: number = 0;
  pageSize: number = 10;
  pageSizeOptions: number[] = [10]; // Define desired page size options

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  isLoggedIn: any;
  name!: string | null;
  users: number = 0;
  searchQuery: string = '';

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.checkAuthentication();
    this.getAllUsers();
    this.getUsersCount();
    this.name = localStorage.getItem('name');
  }

  checkAuthentication(): void {
    this.isLoggedIn = this.userService.isLoggedIn();
    if (!this.isLoggedIn) {
      alert('You are not logged in. Please log in to access the Users.');
      this.router.navigate(['/login']);
    }
  }
  applySearchFilter(): void {
    this.pageIndex = 0; // Reset pageIndex when performing a new search
    this.getAllUsers();
  }
  getAllUsers(): void {
    this.userService.getAllUsers(this.pageIndex + 1, this.pageSize, this.searchQuery).subscribe(
      (data: any) => {
        this.usersDataSource.data = data.results;
         this.usersDataSource.sort = this.sort; // Assign the sort instance
        this.totalUsers = data.count;
      },
      (error) => {
        console.error('Failed to fetch users:', error);
        // Handle error (e.g., display error message)
      }
    );
  }

  getUsersCount(): void {
    this.userService.getUsers().subscribe(
      users => {
        this.users = users.length;
        this.maleUsers = users.filter(user => user.gender === 'male').length;
        this.femaleUsers = users.filter(user => user.gender === 'female').length;
      },
      error => {
        console.error('Failed to fetch users:', error);
        // Handle the error appropriately (e.g., show a message to the user)
      }
    );
  }
  
  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getAllUsers();
  }

  deleteUser(id: number): void {
    this.userService.deleteUser(id).subscribe(
      () => {
        console.log('User deleted successfully');
        this.getAllUsers(); // Refresh user list after deletion
      },
      (error) => {
        console.error('Failed to delete user:', error);
        // Handle error (e.g., display error message)
      }
    );
  }

  logout(): void {
    this.userService.logout();
    this.router.navigate(['/login']); // Redirect to login page after logout
  }
}
