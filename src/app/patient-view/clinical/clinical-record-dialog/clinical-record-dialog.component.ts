import { Component, EventEmitter, Input, Output } from '@angular/core';

import { InputTextarea } from 'primeng/inputtextarea';

import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClinicalRecord, UploadedFile } from '../clinical-record.model';

import { DropdownModule } from 'primeng/dropdown';
import { Dialog } from 'primeng/dialog';
import { FileUpload } from 'primeng/fileupload';
import { Button, ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-clinical-record-dialog',
  standalone: true,
  imports: [
    CommonModule, CommonModule,
    Dialog,
    DropdownModule,
    InputTextarea,
    FileUpload,
    Button, ButtonModule,
    FormsModule,
    TableModule,
    InputTextarea,
    FormsModule,
    TableModule
  ],
  templateUrl: './clinical-record-dialog.component.html'
})
export class ClinicalRecordDialogComponent {

  @Input() patient: any;
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  appointments: any[] = [];
  selectedAppointmentId: string | null = null;

  prescription = '';
  note = '';
  attachments: UploadedFile[] = [];

  ngOnChanges() {
    if (this.visible) {
      this.loadAppointments();
      this.loadLatestAppointment();
    }
  }

  loadAppointments() {
    const all = JSON.parse(localStorage.getItem('appointments') || '[]');
    this.appointments = all
      .filter((a: any) => a.patientId === this.patient.id)
      .sort((a: any, b: any) =>
        new Date(b.appointmentDate).getTime() -
        new Date(a.appointmentDate).getTime()
      );
  }

  loadLatestAppointment() {
    if (this.appointments.length > 0) {
      this.selectedAppointmentId = this.appointments[0].id;
    }
  }

  onFileSelect(event: any) {
    for (let file of event.files) {
      const reader = new FileReader();
      reader.onload = () => {
        this.attachments.push({
          name: file.name,
          type: file.type,
          size: file.size,
          base64: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  }

  save() {
    const all = JSON.parse(localStorage.getItem('clinicalRecords') || '[]');

    const appointment = this.appointments.find(a => a.id === this.selectedAppointmentId);

    const record: ClinicalRecord = {
      id: 'CR-' + Date.now(),
      patientId: this.patient.id,
      appointmentId: this.selectedAppointmentId!,
      appointmentDate: appointment.appointmentDate,
      prescription: this.prescription,
      note: this.note,
      attachments: this.attachments,
      createdAt: new Date().toISOString()
    };

    all.push(record);
    localStorage.setItem('clinicalRecords', JSON.stringify(all));

    this.close();
  }

  close() {
    this.visibleChange.emit(false);
  }
}