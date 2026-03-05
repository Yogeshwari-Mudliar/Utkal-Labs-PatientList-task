import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import { ClinicalComponent } from './clinical/clinical.component';
import { Appointment } from '../content/content.component';
import { TableModule } from 'primeng/table';
import { AppointmentDialogComponent } from './clinical/appointment-dialog/appointment-dialog.component';
import { ClinicalRecordDialogComponent } from './clinical/clinical-record-dialog/clinical-record-dialog.component';

@Component({
  selector: 'app-patient-view',
  standalone: true,
  imports: [CommonModule, TabViewModule, ButtonModule,ClinicalComponent, TableModule,          // ✅ FIX
    ButtonModule,ClinicalRecordDialogComponent,
    AppointmentDialogComponent 
  ],
  templateUrl: './patient-view.component.html'
})
export class PatientViewComponent {

  @Input() patient: any;
  @Output() scheduleAppointment = new EventEmitter<any>();
clinicalDialogVisible = false;
clinicalRecords: any[] = [];

ngOnInit() {
  this.loadAppointments();
  this.loadClinicalRecords();
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

}