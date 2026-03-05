export interface ClinicalRecord {
  id: string;
  patientId: string;
  appointmentId: string;
  appointmentDate: string;
  prescription: string;
  note: string;
  attachments: UploadedFile[];
  createdAt: string;
}

export interface UploadedFile {
  name: string;
  type: string;
  size: number;
  base64: string;
}