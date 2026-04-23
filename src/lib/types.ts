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

export type CreateReminderRequest = {
  appointmentId: number;
  patientId: number;
  message: string;
};

export type FieldTranslations = {
  [key: string]: string;
};

export type ObjectDetailsTableProps<T extends Record<string, unknown>> = {
  data: T | null | undefined;
  fieldTranslations?: FieldTranslations;
  emptyText?: string;
  typeColorMap?: Record<string, string>;
};

export type AppointmentStatusType =
  | "SCHEDULED"
  | "ONGOING"
  | "COMPLETED"
  | "CANCELED"
  | "DELETED";
export type AppointmentStatus =
  | "Scheduled"
  | "Ongoing"
  | "Completed"
  | "Canceled"
  | "Deleted";

export type AppointmentType =
  | "CHECKUP"
  | "CLEANING"
  | "FILLING"
  | "EXTRACTION"
  | "ROOT_CANAL"
  | "ORTHODONTIC"
  | "PROSTHODONTIC"
  | "PEDIATRIC"
  | "EMERGENCY"
  | "OTHER"
  | "FOLLOW_UP"
  | "CONSULTATION";

export type Appointment = {
  id: number;
  name: string;
  type: AppointmentType;
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
  type: AppointmentType;
};

export const APPOINTMENT_STATUS: Record<
  AppointmentStatusType,
  AppointmentStatusType
> = {
  SCHEDULED: "SCHEDULED",
  ONGOING: "ONGOING",
  COMPLETED: "COMPLETED",
  CANCELED: "CANCELED",
  DELETED: "DELETED",
};

export const APPOINTMENT_TYPE: Record<AppointmentType, AppointmentType> = {
  CHECKUP: "CHECKUP",
  CLEANING: "CLEANING",
  FILLING: "FILLING",
  EXTRACTION: "EXTRACTION",
  ROOT_CANAL: "ROOT_CANAL",
  ORTHODONTIC: "ORTHODONTIC",
  PROSTHODONTIC: "PROSTHODONTIC",
  PEDIATRIC: "PEDIATRIC",
  EMERGENCY: "EMERGENCY",
  OTHER: "OTHER",
  FOLLOW_UP: "FOLLOW_UP",
  CONSULTATION: "CONSULTATION",
};

export const APPOINTMENT_OBJ_MAP: Record<keyof Appointment, string> = {
  id: "ID",
  name: "Name",
  status: "Status",
  type: "Type",
  userId: "User ID",
  patientId: "Patient ID",
  date: "Date",
  createdAt: "Created At",
  updatedAt: "Updated At",
};

export const APPOINTMENT_TYPE_OBJ_MAP: Record<AppointmentType, string> = {
  CHECKUP: "Checkup",
  CLEANING: "Cleaning",
  FILLING: "Filling",
  EXTRACTION: "Extraction",
  ROOT_CANAL: "Root Canal",
  ORTHODONTIC: "Orthodontic",
  PROSTHODONTIC: "Prosthodontic",
  PEDIATRIC: "Pediatric",
  EMERGENCY: "Emergency",
  OTHER: "Other",
  FOLLOW_UP: "Follow-up",
  CONSULTATION: "Consultation",
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
  | "DELETED"
  | "OVERDUE";

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
  OVERDUE: "OVERDUE",
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
  typeColorMap?: Record<string, string>;
  onRowClick?: (row: T) => void;
  onAction?: (row: T) => void;
  actionLabel?: string | ((row: T) => string);
  isActionDisabled?: (row: T) => boolean;
};

export type StatusTagTone =
  | "success"
  | "warning"
  | "info"
  | "danger"
  | "neutral";

// Pastel accents for appointment type badges.
export const APPOINTMENT_TYPE_COLOR_TONE_MAP = {
  CHECKUP: "#7FC8F8",
  CLEANING: "#9BE7C4",
  FILLING: "#F7C59F",
  EXTRACTION: "#F2A7A7",
  ROOT_CANAL: "#C7C9F4",
  ORTHODONTIC: "#A8DADC",
  PROSTHODONTIC: "#B8E0A5",
  PEDIATRIC: "#FFD6A5",
  EMERGENCY: "#F6B0C3",
  OTHER: "#D6D6D6",
  FOLLOW_UP: "#BFD7EA",
  CONSULTATION: "#CDEAC0",
} as const satisfies Record<AppointmentType, string>;

export type Reminder = {
  id: number;
  appointmentId: number;
  message: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
} & {
  appointment?: {
    name?: string;
  };
};

export type AppointMentWidgetItem = {
  upcoming: Appointment[];
  past: Appointment[];
  cancelled: Appointment[];
};

export type BillingWidgetItem = {
  pending: Billing[];
  paid: Billing[];
  overdue: Billing[];
  draft: Billing[];
};

export type ReminderWidgetItem = {
  data: Reminder[];
};

export type DashboardWidgetItems = {
  appointMentWidgetItem: AppointMentWidgetItem;
  billingWidgetItem: BillingWidgetItem;
  remindersWidgetItem: ReminderWidgetItem;
};
