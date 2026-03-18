import { CommonModule, NgFor } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-staff',
  standalone: true,
  imports: [NgFor, CommonModule],
  templateUrl: './staff.component.html',
  styleUrl: './staff.component.css'
})
export class StaffComponent {
 staffList: any[] = [];

  loadStaff() {
    const data = localStorage.getItem('staff')||'';
    this.staffList = JSON.parse(data); // ❌ unsafe
  }

  addStaff() {
    const staff = {
      id: Date.now(),
      fullname: '', // ❌ inconsistent naming
      role: 'doctor'
    };

    this.staffList.push(staff);
  }

}
