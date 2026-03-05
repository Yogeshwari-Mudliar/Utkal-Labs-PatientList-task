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

  doctors = [
    { label: 'Dr. Smith', value: 'Dr. Smith' },
    { label: 'Dr. Adams', value: 'Dr. Adams' },
    { label: 'Dr. Johnson', value: 'Dr. Johnson' }
  ];

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService
  ) {}

  ngOnInit(): void {

    this.patientForm = this.fb.group({
      name: ['', Validators.required],
      contactNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      emergencyContact: ['', Validators.required],
      doctorName: ['', Validators.required],
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

  cancel(): void {

    if (!this.isEditMode && this.hasUserEnteredData()) {

      if (confirm("Save draft before closing?")) {
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


}