import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output, OnChanges } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { CalendarModule } from "primeng/calendar";
import { DialogModule } from "primeng/dialog";
import { TableModule } from "primeng/table";
import { InputTextModule } from "primeng/inputtext";
import { Tooltip } from "primeng/tooltip";
import { Dropdown, DropdownModule } from "primeng/dropdown";

export interface Appointment {
  id: string;
  patientId: string;
  appointmentDate: string;
  appointmentTime: string;
  durationMinutes: number;
  doctorName: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'No-Show';
  type: 'Initial' | 'Follow-Up';
  reason?: string;
  createdAt: string;
}
@Component({
  selector: 'app-appointment-dialog',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    CalendarModule,
    FormsModule,DropdownModule,
    TableModule,Tooltip,
    InputTextModule
  ],
  templateUrl: './appointment-dialog.component.html'
})
export class AppointmentDialogComponent implements OnChanges {

  @Input() patient: any;
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  appointments: Appointment[] = [];

  editMode = false;
  editingId: string | null = null;

 form = {
  date: null as Date | null,
  time: null as Date | null,
  duration: 30,
  type: 'Follow-Up' as 'Initial' | 'Follow-Up', // ✅ ADD
  reason: ''
};
statusOptions = [
  { label: 'Scheduled', value: 'Scheduled' },
  { label: 'Completed', value: 'Completed' },
  { label: 'Cancelled', value: 'Cancelled' },
  { label: 'No-Show', value: 'No-Show' }
];
  ngOnChanges() {
    if (this.visible && this.patient) {
      this.loadAppointments();
    }
  }
loadAppointments() {

  let all = JSON.parse(localStorage.getItem('appointments') || '[]');

  // If no appointments exist for this patient,
  // generate from mock patient fields
  const patientAppointments = all.filter(
    (a: Appointment) => a.patientId === this.patient.id
  );

  if (patientAppointments.length === 0 && this.patient.lastVisitDate) {

   const initialAppointment: Appointment = {
  id: 'APT-' + Date.now(),
  patientId: this.patient.id,
  appointmentDate: this.patient.lastVisitDate,
  appointmentTime: '10:00',
  durationMinutes: 30,
  doctorName: this.patient.doctorName,
  status: 'Completed',
  type: 'Initial',   // ✅ ADD THIS
  reason: 'Initial Visit',
  createdAt: new Date().toISOString()
};
    all.push(initialAppointment);
    localStorage.setItem('appointments', JSON.stringify(all));
  }

  this.appointments = all.filter(
    (a: Appointment) => a.patientId === this.patient.id
  );
}

  save() {

    if (!this.form.date || !this.form.time) return;

    const all = JSON.parse(localStorage.getItem('appointments') || '[]');

    if (this.editMode && this.editingId) {

      const index = all.findIndex((a: Appointment) => a.id === this.editingId);

      if (all[index].status === 'Completed') return; // restriction

      all[index] = {
        ...all[index],
        appointmentDate: this.formatDate(this.form.date),
        appointmentTime: this.formatTime(this.form.time),
        reason: this.form.reason
      };

    } else {

    const newAppointment: Appointment = {
  id: 'APT-' + Date.now(),
  patientId: this.patient.id,
  appointmentDate: this.formatDate(this.form.date),
  appointmentTime: this.formatTime(this.form.time),
  durationMinutes: this.form.duration,
  doctorName: this.patient.doctorName,
  status: 'Scheduled',
  type: this.form.type,   // ✅ ADD
  reason: this.form.reason,
  createdAt: new Date().toISOString()
};

      all.push(newAppointment);
    }

    localStorage.setItem('appointments', JSON.stringify(all));
    this.resetForm();
    this.loadAppointments();
  }

  startReschedule(appt: Appointment) {
    if (appt.status !== 'Scheduled') return;

    this.editMode = true;
    this.editingId = appt.id;

    this.form.date = new Date(appt.appointmentDate);
    this.form.reason = appt.reason || '';
  }

  resetForm() {
  this.editMode = false;
  this.editingId = null;
  this.form = {
    date: null,
    time: null,
    duration: 30,
    type: 'Follow-Up',   // ✅ ADD
    reason: ''
  };
}

  formatDate(date: Date) {
    return date.toISOString().split('T')[0];
  }

  formatTime(date: Date) {
    return date.toTimeString().substring(0, 5);
  }

  close() {
    this.visibleChange.emit(false);
  }
updateStatus(appt: Appointment) {

  const all = JSON.parse(localStorage.getItem('appointments') || '[]');

  const index = all.findIndex((a: Appointment) => a.id === appt.id);

  if (index !== -1) {
    all[index].status = appt.status;
    localStorage.setItem('appointments', JSON.stringify(all));
  }

  this.loadAppointments();
}

}