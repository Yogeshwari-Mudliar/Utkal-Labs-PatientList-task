import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabViewModule } from 'primeng/tabview';
import { AccordionModule } from 'primeng/accordion';
import { TimelineModule } from 'primeng/timeline';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ClinicalComponent } from './clinical/clinical.component';
import { Appointment } from '../content/content.component';
import { TableModule } from 'primeng/table';
import { AppointmentDialogComponent } from './clinical/appointment-dialog/appointment-dialog.component';
import { ClinicalRecordDialogComponent } from './clinical/clinical-record-dialog/clinical-record-dialog.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-patient-view',
  standalone: true,
  imports: [CommonModule, TabViewModule, ButtonModule,ClinicalComponent, TableModule,          // ✅ FIX
    ButtonModule,ClinicalRecordDialogComponent,CardModule,
    AppointmentDialogComponent ,AccordionModule,TimelineModule
  ],
  templateUrl: './patient-view.component.html'
})
export class PatientViewComponent {

  @Input() patient: any;
  @Output() scheduleAppointment = new EventEmitter<any>();
clinicalDialogVisible = false;
clinicalRecords: any[] = [];
centers = [
{
name: 'City Central Hospital',
lastVisit: '03 Nov 2023',

visits: [
{ date:'22 Feb 2024', title:'Cardiology Consult', doctor:'Dr. A. Smith'},
{ date:'15 Jan 2024', title:'Follow-up', doctor:'Dr. L. Chen'},
{ date:'10 Dec 2023', title:'ECG', doctor:'Diagnostic'}
],

medications:[
{ name:'Lisinopril 10mg', dose:'OD', doctor:'Dr. A. Smith'},
{ name:'Metformin 500mg', dose:'BD', doctor:'Dr. L. Chen'},
{ name:'Simvastatin 20mg', dose:'Nocto', doctor:'Dr. A. Smith'}
],

diagnosis:[
'Hypertension',
'Type 2 Diabetes',
'Hyperlipidemia'
]
}
];

constructor(private route: ActivatedRoute) {}

ngOnInit() {
  this.loadAppointments();
  this.loadClinicalRecords();
   const encryptedId = this.route.snapshot.paramMap.get('id');

  if (!encryptedId) return;

  const patientId = atob(encryptedId);   // decode Base64

  const patients = JSON.parse(localStorage.getItem('patients') || '[]');

  this.patient = patients.find((p: any) => p.id === patientId);

  console.log('Loaded Patient:', this.patient);
}

onScheduleAppointment(patient: any) {
  this.scheduleAppointment.emit(patient);
}
appointments: Appointment[] = [];
appointmentDialogVisible = false;
loadAppointments() {
  const all = JSON.parse(localStorage.getItem('appointments') || '[]');

  this.appointments = all
    .filter((a: Appointment) => a.patientId === this.patient?.id)
    .sort((a: Appointment, b: Appointment) =>
      new Date(b.appointmentDate).getTime() -
      new Date(a.appointmentDate).getTime()
    );
}
loadClinicalRecords() {
  const all = JSON.parse(localStorage.getItem('clinicalRecords') || '[]');

  this.clinicalRecords = all.filter(
    (r: any) => r.patientId === this.patient?.id
  );
}
getInitials(name: string | undefined): string {

  if (!name) return '';

  const words = name.split(' ');

  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }

  return (words[0][0] + words[1][0]).toUpperCase();
}
}