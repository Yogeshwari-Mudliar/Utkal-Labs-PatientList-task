import { Injectable } from '@angular/core';
import { Patient } from './patient.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private STORAGE_KEY = 'patients';

  getPatients(): Patient[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  savePatients(patients: Patient[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(patients));
  }

  addPatient(patient: Patient): void {
    const patients = this.getPatients();
    patients.push(patient);
    this.savePatients(patients);
  }
updatePatient(updatedPatient: Patient): void {

  const patients = this.getPatients();

  const index = patients.findIndex(
    p => p.id === updatedPatient.id
  );

  if (index === -1) {
    console.error('Patient not found for update');
    return;
  }

  patients[index] = updatedPatient;

  this.savePatients(patients);
}
  generatePatientId(): string {
    return 'PAT-' + Date.now();
  }

  clearAll(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}