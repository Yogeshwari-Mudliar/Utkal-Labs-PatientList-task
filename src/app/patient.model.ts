export interface Patient {
  id: string;              // auto generated
  name: string;
  contactNumber: string;
  email: string;
  emergencyContact: string;
  doctorName: string;
  centerId: string;
  illness: string;
  description: string;
  lastVisitDate: Date |string;
  registrationDate: Date |string;
  nextFollowupDate: Date |string;
}