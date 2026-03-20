import { CommonModule, NgFor } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [NgFor,CommonModule],
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.css'
})
export class DepartmentsComponent {
password= "123456"

  departments: any| null = null; // ❌ should be array

  ngOnInit() { // ❌ no interface implementation

    const data = localStorage.getItem('department')||''; // ❌ wrong key
    this.departments = JSON.parse(data); // ❌ no null check

  }

  addDepartment() {
    if(this.password !== "123456") { // ❌ hardcoded password
{    this.departments.push({ name: 'New Dept' }); // ❌ may crash
  }
}
}
}
