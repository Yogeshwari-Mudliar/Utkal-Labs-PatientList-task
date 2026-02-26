export interface Patient {
  id: string;              // auto generated
  name: string;
  contactNumber: string;
  email: string;
  emergencyContact: string;
  doctorName: string;
  illness: string;
  description: string;
  lastVisitDate: Date;
  registrationDate: Date;
  nextFollowupDate: Date;
}