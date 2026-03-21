export type Patient = {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreatePatientRequest = {
  name: string;
  email: string;
};

export type FieldTranslations = {
  [key: string]: string;
};

export type ObjectDetailsTableProps<T extends Record<string, unknown>> = {
  data: T | null | undefined;
  fieldTranslations?: FieldTranslations;
  emptyText?: string;
};

export type AppointmentStatus = "Scheduled" | "Completed" | "Canceled";

export type Appointment = {
  id: number;
  name: string;
  status: AppointmentStatus;
  userId: number;
  patientId: number;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateAppointmentRequest = {
  name: string;
  patientId: number;
  userId: number;
  date: string;
};

export const APPOINTMENT_OBJ_MAP: Record<keyof Appointment, string> = {
  id: "ID",
  name: "Name",
  status: "Status",
  userId: "User ID",
  patientId: "Patient ID",
  date: "Date",
  createdAt: "Created At",
  updatedAt: "Updated At",
};

export type AppointmentDetails = Appointment & {
  patient: Patient;
};

export type UpdateAppointmentRequest = {
  id: number;
  patientId?: number;
  date?: Date;
  name?: string;
};

export type CreateBillingRequest = {
  appointmentId: number;
  amount: number;
  description?: string;
};

export type UpdateBillingRequest = {
  id: number;
  amount?: number;
  description?: string;
};

export type BillingStatus =
  | "DRAFT"
  | "INVOICED"
  | "PAID"
  | "CANCELED"
  | "DELETED";

export type Billing = {
  id: number;
  appointmentId: number;
  amount: number;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  status: BillingStatus;
};

// export enum BillingStatusEnum {
//   DRAFT = "DRAFT",
//   INVOICED = "INVOICED",
//   PAID = "PAID",
//   CANCELED = "CANCELED",
//   DELETED = "DELETED",
// }

export const BILLING_STATUS: Record<BillingStatus, BillingStatus> = {
  DRAFT: "DRAFT",
  INVOICED: "INVOICED",
  PAID: "PAID",
  CANCELED: "CANCELED",
  DELETED: "DELETED",
};

export const BILLING_OBJ_MAP: Record<keyof Billing, string> = {
  id: "ID",
  appointmentId: "Appointment ID",
  amount: "Amount",
  description: "Description",
  status: "Status",
  createdAt: "Created At",
  updatedAt: "Updated At",
};

export type ObjectsTableProps<T extends Record<string, unknown>> = {
  data: T[] | null | undefined;
  fieldTranslations?: FieldTranslations;
  emptyText?: string;
  onRowClick?: (row: T) => void;
  onAction?: (row: T) => void;
  actionLabel?: string | ((row: T) => string);
  isActionDisabled?: (row: T) => boolean;
};
