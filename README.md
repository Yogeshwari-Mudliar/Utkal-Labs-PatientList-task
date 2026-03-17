# Clinic Management System (Frontend)

This is an Angular-based clinic management system using localStorage as a mock backend.

Modules currently implemented:
- Patient Management
- Appointment Scheduling
- Clinical Records

Upcoming modules:
- Centers
- Departments
- Staff (Doctors, Nurses)

## Data Hierarchy

Center
 └── Departments
      ├── Doctors
      ├── Nurses
      └── (Future: Billing, Lab)

Patients → Appointments → Staff (Doctor)

src/app
 ├── add-patient
 ├── centers/
 ├── centers.component.ts              // list page
 ├── center-form.component.ts         // add/edit dialog
 ├── center-details/                  // MAIN HUB
 │     ├── center-details.component.ts
 │     ├── center-sidebar.component.ts
 │     ├── center-header.component.ts
 │
 │     ├── departments/
 │     │     └── departments.component.ts
 │
 │     ├── staff/
 │     │     └── staff.component.ts
 │
 │     ├── rooms/        (future)
 │     ├── labs/         (future)
 │     └── facilities/   (future)
 ├── patient-view
 │     └── clinical
 │           ├── appointment-dialog
 │           ├── clinical-record-dialog