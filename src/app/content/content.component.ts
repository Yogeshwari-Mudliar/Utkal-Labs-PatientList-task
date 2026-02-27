import { Component, OnInit, ViewChild } from '@angular/core';
import { UserDataService } from '../user-data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { Table } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { AddPatientComponent } from '../add-patient/add-patient.component';
import { Patient } from '../patient.model';
import { PatientService } from '../patient.service';
import { PaginatorModule } from 'primeng/paginator';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { AutoCompleteModule } from 'primeng/autocomplete';
// user.model.ts
export interface User {
  id: number;
  username: string;
  email: string;
}

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [
    CommonModule,DialogModule,DropdownModule,     // ✅ ADD THIS
    CalendarModule,  
    FormsModule,ButtonModule,
    TableModule,PaginatorModule,
    InputTextModule, AddPatientComponent
  ,AutoCompleteModule],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent implements OnInit {

  @ViewChild('dt') dt!: Table;

  userData: Patient[] = [];
  search: string = '';
  showAddPatient = false;
totalRecords = 0;
allPatients: any[] = [];
pageSize = 5;
currentFirst = 0;
scrollHeight: string = '250px';
selectedDoctor: number | null = null;
followUpRange: Date[] | null = null;
allDoctors: any[] = [];
doctors: any[] = [];

drPageSize = 10;
currentIndex = 0;
currentQuery = '';

  constructor(private patientService: PatientService) {}

ngOnInit(): void {

  const existing = localStorage.getItem('patients');

  if (!existing) {
    const mockData = this.generateMockPatients();
    localStorage.setItem('patients', JSON.stringify(mockData));
  }

  this.loadPatients();
  this.userData = this.allPatients;

  this.allDoctors = JSON.parse(localStorage.getItem('doctors') || '[]');

}
searchDoctors(event: any) {

  this.currentQuery = event.query?.toLowerCase() || '';
  this.currentIndex = 0;

  const filtered = this.getFilteredDoctors();

  this.doctors = filtered.slice(0, this.pageSize);
  this.currentIndex = this.pageSize;
}
loadMoreDoctors() {

  const filtered = this.getFilteredDoctors();

  const nextChunk = filtered.slice(
    this.currentIndex,
    this.currentIndex + this.pageSize
  );

  this.doctors = [...this.doctors, ...nextChunk];

  this.currentIndex += this.pageSize;
}
getFilteredDoctors() {

  if (!this.currentQuery) return this.allDoctors;

  return this.allDoctors.filter(d =>
    d.name.toLowerCase().includes(this.currentQuery)
  );
}
getRandomName(): string {

  const firstNames = [
    "John","Michael","David","James","Daniel",
    "Sarah","Emily","Sophia","Olivia","Emma",
    "Liam","Noah","Ethan","Mason","Lucas"
  ];

  const lastNames = [
    "Smith","Johnson","Brown","Williams","Jones",
    "Garcia","Miller","Davis","Rodriguez","Martinez"
  ];

  const first = firstNames[Math.floor(Math.random() * firstNames.length)];
  const last = lastNames[Math.floor(Math.random() * lastNames.length)];

  return first + " " + last;
}
generateMockPatients(): any[] {

  const doctors = ["Dr. Adams", "Dr. Brown", "Dr. Carter", "Dr. Davis"];
  const illnesses = ["Flu", "Cold", "Headache", "Infection", "Allergy"];

  let patients = [];

  for (let i = 1; i <= 150; i++) {

    patients.push({
      id: "PAT-" + (10000 + i),
name: this.getRandomName(),
      contactNumber: "98" + String(100000000 + i),
      email: "patient" + i + "@mail.com",
      emergencyContact: "99" + String(200000000 + i),
      doctorName: doctors[i % doctors.length],
      illness: illnesses[i % illnesses.length],
      description: "Test data",
      lastVisitDate: "2025-01-" + String((i % 28) + 1).padStart(2, "0"),
      registrationDate: "2025-01-" + String((i % 28) + 1).padStart(2, "0"),
      nextFollowupDate: "2025-02-" + String((i % 28) + 1).padStart(2, "0")
    });
  }

  return patients;
}
 loadPatients(): void {
  const data = localStorage.getItem('patients');

  if (data) {
    this.allPatients = JSON.parse(data);
    this.totalRecords = this.allPatients.length;

    // Initial page load
this.userData = this.allPatients;   // give full dataset
  }
}
loadLazy(event: any): void {

  console.log("Lazy triggered", event);

  this.currentFirst = event.first;
  this.pageSize = event.rows;

}
  onAddUser(): void {
    this.showAddPatient = true;
  }

  handleClose(): void {
    this.showAddPatient = false;
    this.loadPatients();
  }
applyGlobalFilter(event: Event): void {

  this.search = (event.target as HTMLInputElement).value;

  this.dt.reset();   // ⭐ Reset paginator

  this.loadLazy({
    first: 0,
    rows: this.pageSize
  });

}
clear(): void {
  this.dt.clear();
  this.search = '';
}
handleOverlayClose(): void {

  const draft = localStorage.getItem("patient_form_draft");

  if (draft) {

    const draftData = JSON.parse(draft);

    const hasRealData = Object.keys(draftData).some(key => {

      if (key === "registrationDate") return false;

      return draftData[key];
    });

    if (hasRealData) {

      if (confirm("You have unsaved patient data. Save before closing?")) {
        return;
      } else {
        localStorage.removeItem("patient_form_draft");
      }
    }
  }

  this.showAddPatient = false;
}

updateScrollHeight() {
  if (this.pageSize === 5) {
    this.scrollHeight = '250px';
  }
  else if (this.pageSize === 10) {
    this.scrollHeight = '400px';
  }
  else if (this.pageSize === 20) {
    this.scrollHeight = '600px';
  }
}
onPageChange(event: any) {
  this.pageSize = event.rows;
  this.currentFirst = event.first;

  this.updateScrollHeight();
  this.loadLazy(event);
}
externalPageChange(event: any) {
  this.pageSize = event.rows;
  this.currentFirst = event.first;

  this.dt.first = this.currentFirst;   // tell table to move

  this.loadLazy(event);
}
resetFilters() {
  this.search = '';
  this.selectedDoctor = null;
  this.followUpRange = null;

  this.dt.reset(); // reset paginator

  this.loadLazy({
    first: 0,
    rows: this.pageSize
  });
}
applyFilters() {

  let filtered = [...this.allPatients];

  // Doctor filter (you are using doctorName in mock data)
  if (this.selectedDoctor) {
    const selectedDoctorName = this.doctors.find(d => d.id === this.selectedDoctor)?.name;
    filtered = filtered.filter(p => p.doctorName === selectedDoctorName);
  }

  // Follow-up date filter
  if (this.followUpRange && this.followUpRange.length === 2) {
    const [start, end] = this.followUpRange;

    filtered = filtered.filter(p => {
      const followUp = new Date(p.nextFollowupDate);
      return followUp >= start && followUp <= end;
    });
  }

  // Search filter
  if (this.search?.trim()) {
    const keyword = this.search.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(keyword) ||
      p.contactNumber?.includes(keyword)
    );
  }

  this.totalRecords = filtered.length;

  // Apply pagination manually
  this.userData = filtered.slice(this.currentFirst, this.currentFirst + this.pageSize);
}

}