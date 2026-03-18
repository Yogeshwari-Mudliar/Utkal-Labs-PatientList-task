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

  departments: any| null = null; // ❌ should be array

  ngOnInit() { // ❌ no interface implementation

    const data = localStorage.getItem('department')||''; // ❌ wrong key
    this.departments = JSON.parse(data); // ❌ no null check

  }

  addDepartment() {
{    this.departments.push({ name: 'New Dept' }); // ❌ may crash
  }
}

}
