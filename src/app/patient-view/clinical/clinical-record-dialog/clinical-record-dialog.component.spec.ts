import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicalRecordDialogComponent } from './clinical-record-dialog.component';

describe('ClinicalRecordDialogComponent', () => {
  let component: ClinicalRecordDialogComponent;
  let fixture: ComponentFixture<ClinicalRecordDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClinicalRecordDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClinicalRecordDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
