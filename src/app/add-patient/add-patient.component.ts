import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

import { CommonModule } from '@angular/common';
import { PatientService } from '../patient.service';
import { Patient } from '../patient.model';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-add-patient',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    DropdownModule
  ],
  templateUrl: './add-patient.component.html'
})
export class AddPatientComponent implements OnInit {

  @Input() patient: Patient | null = null;
  @Input() isEditMode: boolean = false;
  @Input() loadDraft: boolean = false;

  @Output() close = new EventEmitter<void>();

  patientForm!: FormGroup;

  private draftKey = 'patient_form_draft';

  doctors: any[] = [];
  centers: any[] = [];

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService
  ) { }

  ngOnInit(): void {
    this.initializeCenters();
    this.patientForm = this.fb.group({
      name: ['', Validators.required],
      contactNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      emergencyContact: ['', Validators.required],
      doctorName: ['', Validators.required],
      centerId: ['', Validators.required],
      illness: ['', Validators.required],
      description: [''],
      lastVisitDate: ['', Validators.required],
      registrationDate: [this.getTodayDate(), Validators.required],
      nextFollowupDate: ['', Validators.required]
    });

    // ✅ EDIT MODE → Patch patient
    if (this.isEditMode && this.patient) {
      this.patientForm.patchValue(this.patient);
    }

    // ✅ ADD MODE → Load draft only if parent allows
    if (!this.isEditMode && this.loadDraft) {
      const draft = localStorage.getItem(this.draftKey);
      if (draft) {
        this.patientForm.patchValue(JSON.parse(draft));
      }
    }

    // ✅ Auto-save draft ONLY in Add mode
    if (!this.isEditMode) {
      this.patientForm.valueChanges.subscribe(val => {
        localStorage.setItem(this.draftKey, JSON.stringify(val));
      });
    }
    const storedDoctors = JSON.parse(localStorage.getItem('doctors') || '[]');

    this.doctors = storedDoctors.map((d: any) => ({
      label: d.name,
      value: d.name
    }));
    const storedCenters = JSON.parse(localStorage.getItem('centers') || '[]');

    this.centers = storedCenters.map((c: any) => ({
      label: c.name,
      value: c.id
    }));
  }
  initializeCenters() {
    const centers = [
      { id: 'C001', name: 'City Central Hospital' },
      { id: 'C002', name: 'Westside Clinic' },
      { id: 'C003', name: 'Eastside Specialist Center' },
      { id: 'C004', name: 'Riverside Diagnostics' }
    ];

    if (!localStorage.getItem('centers')) {
      localStorage.setItem('centers', JSON.stringify(centers));
    }
  }
  private getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  submit(): void {

    if (this.patientForm.invalid) {
      this.patientForm.markAllAsTouched();
      return;
    }

    if (this.isEditMode && this.patient) {

      const updatedPatient: Patient = {
        ...this.patient,
        ...this.patientForm.value
      };

      this.patientService.updatePatient(updatedPatient);

    } else {

      const newPatient: Patient = {
        id: this.patientService.generatePatientId(),
        ...this.patientForm.value
      };

      this.patientService.addPatient(newPatient);
    }

    // Clear draft after successful save
    localStorage.removeItem(this.draftKey);

    this.patientForm.reset({
      registrationDate: this.getTodayDate()
    });

    this.close.emit();
  }

  // cancel(): void {

  //   if (!this.isEditMode && this.hasUserEnteredData()) {

  //     if (confirm("Save draft before closing?")) {
  //       localStorage.setItem(
  //         this.draftKey,
  //         JSON.stringify(this.patientForm.value)
  //       );
  //     } else {
  //       localStorage.removeItem(this.draftKey);
  //     }
  //   }

  //   this.close.emit();
  // }
  cancel(): void {

    if (!this.isEditMode && this.hasUserEnteredData()) {

      const decision = confirm(
        "You have unsaved patient data.\n\n" +
        "OK → Save as draft\n" +
        "Cancel → Discard"
      );

      if (decision) {
        localStorage.setItem(
          this.draftKey,
          JSON.stringify(this.patientForm.value)
        );
      } else {
        localStorage.removeItem(this.draftKey);
      }

    }

    this.close.emit();
  }
  private hasUserEnteredData(): boolean {

    const formValue = this.patientForm.value;

    return Object.keys(formValue).some(key => {

      if (key === 'registrationDate') return false;

      return formValue[key] !== null &&
        formValue[key] !== '' &&
        formValue[key] !== undefined;
    });
  }

  canDeactivate(): boolean {

    if (!this.isEditMode && this.patientForm.dirty) {

      const confirmLeave = confirm(
        "You have unsaved patient data. Leave this page?"
      );

      if (confirmLeave) {
        localStorage.removeItem(this.draftKey);
      }

      return confirmLeave;
    }

    return true;
  }
  getCenterName(id: string) {
    const center = this.centers.find(c => c.id === id);
    return center ? center.name : 'Unknown Center';
  }
}