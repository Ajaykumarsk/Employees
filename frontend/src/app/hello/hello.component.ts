import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import {FormControl, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
@Component({
  selector: 'app-hello',
  templateUrl: './hello.component.html',
  styleUrls: ['./hello.component.css']
})
export class HelloComponent {
  opened = false;

  users: any[]=[];
  constructor(private http: HttpClient,private observer: BreakpointObserver){
    this.loadUsers();
  }
  ngOnInit() {
   
  }
  loadUsers() {
    debugger;
    this.http.get('http://127.0.0.1:8000/api/hello/').subscribe((res:any)=>{
      this.users = res.data;
    })
  }
  
  toggleSidenav(): void {
    this.opened = !this.opened;
  }
  
  submitForm(form: any): void {
    if (form.valid) {
      console.log('Form submitted:', form.value);
      // Implement form submission logic here (e.g., send data to backend)
    }
  }
}
