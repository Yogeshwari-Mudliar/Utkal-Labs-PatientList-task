import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';

@Component({
  selector: 'app-clinical',
  standalone: true,
  imports: [
    CommonModule,
    TabViewModule,
    ButtonModule
  ],
  templateUrl: './clinical.component.html',
  styleUrls: ['./clinical.component.css']
})
export class ClinicalComponent {

  @Input() patient: any;

  @Output() scheduleAppointment = new EventEmitter<any>();
@Output() openClinical = new EventEmitter<any>();

openPrescription() {
  this.openClinical.emit(this.patient);
}

openNote() {
  this.openClinical.emit(this.patient);
}
  openAppointment() {
    this.scheduleAppointment.emit(this.patient);
  }

}