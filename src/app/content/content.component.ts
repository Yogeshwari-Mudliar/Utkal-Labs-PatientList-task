import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { MenuModule } from 'primeng/menu';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { PatientViewComponent } from '../patient-view/patient-view.component';
import { TooltipModule } from 'primeng/tooltip';
import { AppointmentDialogComponent } from '../patient-view/clinical/appointment-dialog/appointment-dialog.component';
import { ClinicalRecordDialogComponent } from '../patient-view/clinical/clinical-record-dialog/clinical-record-dialog.component';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SidebarModule } from 'primeng/sidebar';

// user.model.ts
export interface User {
  id: number;
  username: string;
  email: string;
}
export interface ClinicalNote {
  id: string;
  patientId: string;

  doctorName: string;

  noteType: 'General' | 'Follow-up' | 'Emergency';

  content: string;

  createdAt: string;
}
export interface Prescription {
  id: string;
  patientId: string;

  doctorName: string;

  diagnosis: string;

  medicines: {
    name: string;
    dosage: string;
    frequency: string;
    durationDays: number;
  }[];

  instructions?: string;

  createdAt: string;
}
export interface Appointment {
  id: string;
  patientId: string;

  appointmentDate: string;
  appointmentTime: string;
  durationMinutes: number;

  doctorName: string;

  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'No-Show';

  reason?: string;
  notes?: string;

  createdAt: string;
}

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [
    CommonModule, DialogModule, DropdownModule,     // ✅ ADD THIS
    CalendarModule,
    FormsModule, ButtonModule,
    TableModule, PaginatorModule,
    InputTextModule, AddPatientComponent
    , AutoCompleteModule, MenuModule, PatientViewComponent, TooltipModule, ConfirmDialogModule, ClinicalRecordDialogComponent, AppointmentDialogComponent, RouterOutlet,SidebarModule],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css',
  encapsulation: ViewEncapsulation.None,
  providers: [ConfirmationService],
})
export class ContentComponent implements OnInit {

  @ViewChild('dt') dt!: Table;
  @ViewChild(AddPatientComponent)
  addPatientComponent!: AddPatientComponent;

  clinicalDialogVisible = false;
  userData: Patient[] = [];
  search: string = '';
  showAddPatient = false;
  totalRecords = 0;
  allPatients: any[] = [];
  patient: any = null;
  pageSize = 5;
  currentFirst = 0;
  scrollHeight: string = '250px';
  selectedDoctor: number | null = null;
  followUpRange: Date[] | null = null;
  followUpFrom!: Date;
  followUpTo!: Date;
  appointments: any[] = [];
  allDoctors: any[] = [];
  doctors: any[] = [];

  drPageSize = 10;
  currentIndex = 0;
  currentQuery = '';
  selectedPatient: any;
  showViewDialog = false;
  viewPatient: any;
  isEditMode = false;
  draftKey = 'patient_form_draft';
  loadDraft = false;
  sidePanelVisible = false;

  constructor(private patientService: PatientService, private router: Router, private confirmationService: ConfirmationService) { }

  ngOnInit(): void {

    const existing = localStorage.getItem('patients');

    if (!existing) {
      const mockData = this.generateMockPatients();
      localStorage.setItem('patients', JSON.stringify(mockData));
    }

    this.loadPatients();
    this.userData = this.allPatients;

    this.allDoctors = JSON.parse(localStorage.getItem('doctors') || '[]');

    this.rowMenuItems = [
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => this.onEdit(this.selectedPatient)
      },
      {
        label: 'Change Doctor',
        icon: 'pi pi-user-edit',
        command: () => this.onChangeDoctor(this.selectedPatient)
      },
      {
        label: 'Upload Reports',
        icon: 'pi pi-upload',
        command: () => this.onUploadReports(this.selectedPatient)
      },
      { separator: true },
      {
        label: 'Archive',
        icon: 'pi pi-archive',
        command: () => this.onArchive(this.selectedPatient)
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        styleClass: 'text-red-500',
        command: () => this.onDelete(this.selectedPatient)
      }
    ];
    this.updateState();   // initial

    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => this.updateState());
  }
  updateState() {
    this.showAddPatient =
      this.router.url.includes('/patients/new') ||
      this.router.url.includes('/patients/edit');
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
      "John", "Michael", "David", "James", "Daniel",
      "Sarah", "Emily", "Sophia", "Olivia", "Emma",
      "Liam", "Noah", "Ethan", "Mason", "Lucas"
    ];

    const lastNames = [
      "Smith", "Johnson", "Brown", "Williams", "Jones",
      "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"
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
  // onAddUser() {

  //   const draft = localStorage.getItem(this.draftKey);

  //   if (draft) {

  //     const decision = confirm(
  //       "You have an unsaved patient draft.\n\n" +
  //       "OK → Continue with draft\n" +
  //       "Cancel → Discard draft"
  //     );

  //     if (decision) {
  //       this.loadDraft = true;
  //     } else {
  //       localStorage.removeItem(this.draftKey);
  //       this.loadDraft = false;
  //     }

  //   } else {
  //     this.loadDraft = false;
  //   }
  // this.showAddPatient
  //   this.router.navigate(['/patients/new']);
  // }
  onAddUser() {
    this.router.navigate(['/patients/new']);
  }
  handleClose(): void {
    this.router.navigate(['/patients']);
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

  if (this.addPatientComponent) {
    this.addPatientComponent.cancel();   // delegate to child
  } else {
    this.handleClose();
  }

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

    // this.loadLazy({
    //   first: 0,
    //   rows: this.pageSize
    // });
    this.applyFilters()
  }
  applyFilters() {

    let filtered = [...this.allPatients];

    if (this.selectedDoctor) {
      const selectedDoctorName = this.doctors.find(d => d.id === this.selectedDoctor)?.name;
      filtered = filtered.filter(p => p.doctorName === selectedDoctorName);
    }

    if (this.followUpRange && this.followUpRange.length === 2) {
      const [start, end] = this.followUpRange;

      filtered = filtered.filter(p => {
        const followUp = new Date(p.nextFollowupDate);
        return followUp >= start && followUp <= end;
      });
    }

    if (this.search?.trim()) {
      const keyword = this.search.toLowerCase();

      filtered = filtered.filter(p =>
        p.name?.toLowerCase().includes(keyword) ||
        p.contactNumber?.includes(keyword)
      );
    }

    if (!this.search?.trim()) {
      this.currentFirst = 0;
      this.pageSize = 5;
    }

    this.totalRecords = filtered.length;
    this.userData = filtered;
  }
  getRowMenuItems(patient: any) {
    return [
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => this.onEdit(patient)
      },
      {
        label: 'Change Doctor',
        icon: 'pi pi-user-edit',
        command: () => this.onChangeDoctor(patient)
      },
      {
        label: 'Upload Reports',
        icon: 'pi pi-upload',
        command: () => this.onUploadReports(patient)
      },
      {
        separator: true
      },
      {
        label: 'Archive',
        icon: 'pi pi-archive',
        command: () => this.onArchive(patient)
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        styleClass: 'text-red-500',
        command: () => this.onDelete(patient)
      }
    ];
  }
  rowMenuItems: MenuItem[] = [];

 openMenu(patient: any) {
  this.selectedPatient = patient;
  this.sidePanelVisible = true;
}
  appointmentDialogVisible = false;

  onAppointment(patient: any) {
    this.selectedPatient = patient;
    this.appointmentDialogVisible = true;
  }
  // PRESCRIPTION & NOTES
  onClinical(patient: any) {
    this.selectedPatient = patient;
    this.clinicalDialogVisible = true;
  }

  // BILLING
  onBilling(patient: any) {
    console.log('Billing', patient);
    // open billing screen
  }

  // EDIT
  onEdit(patient: any) {
    this.selectedPatient = patient;
    this.isEditMode = true;
    this.showAddPatient = true;
  }

  // CHANGE DOCTOR
  onChangeDoctor(patient: any) {
    console.log('Change Doctor', patient);
  }
  loadClinicalRecords() {
    console.log('Reload clinical records...');
    // Call your service here later
  }

  // UPLOAD REPORTS
  onUploadReports(patient: any) {
    console.log('Upload Reports', patient);
  }

  // ARCHIVE
  onArchive(patient: any) {
    console.log('Archive', patient);
  }

  // DELETE
  onDelete(patient: any) {
    console.log('Delete', patient);
  }
onView(patient: any) {

  const encryptedId = this.encryptId(patient.id);

  this.sidePanelVisible = false;

  this.router.navigate(['/patientDetails', encryptedId]);

}

encryptId(id: string): string {
  return btoa(id);   // encode
}
}