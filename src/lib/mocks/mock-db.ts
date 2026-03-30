import mockDataJson from "./mock-data.json";
import {
  Appointment,
  AppointmentType,
  Billing,
  BillingStatus,
  CreateAppointmentRequest,
  CreateBillingRequest,
  CreatePatientRequest,
  DashboardWidgetItems,
  Patient,
  Reminder,
  UpdateBillingRequest,
} from "@/lib/types";

export type DoctorOption = {
  id: number;
  name?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
};

type RawPatient = {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

type RawAppointment = {
  id: number;
  name: string;
  type: AppointmentType;
  status: Appointment["status"];
  userId: number;
  patientId: number;
  date: string;
  createdAt: string;
  updatedAt: string;
};

type RawBilling = {
  id: number;
  appointmentId: number;
  amount: number;
  description: string | null;
  status: BillingStatus;
  createdAt: string;
  updatedAt: string;
};

type RawReminder = {
  id: number;
  appointmentId: number;
  message: string;
  date: string;
  createdAt: string;
  updatedAt: string;
};

type RawDb = {
  patients: RawPatient[];
  doctors: DoctorOption[];
  appointments: RawAppointment[];
  billings: RawBilling[];
  reminders: RawReminder[];
};

const STORAGE_KEY = "dentis-portfolio-mock-db-v1";

function toDate(value: string): Date {
  return new Date(value);
}

function fromDate(value: Date): string {
  return value.toISOString();
}

function toPatient(raw: RawPatient): Patient {
  return {
    ...raw,
    createdAt: toDate(raw.createdAt),
    updatedAt: toDate(raw.updatedAt),
  };
}

function fromPatient(patient: Patient): RawPatient {
  return {
    ...patient,
    createdAt: fromDate(patient.createdAt),
    updatedAt: fromDate(patient.updatedAt),
  };
}

function toAppointment(raw: RawAppointment): Appointment {
  return {
    ...raw,
    date: toDate(raw.date),
    createdAt: toDate(raw.createdAt),
    updatedAt: toDate(raw.updatedAt),
  };
}

function fromAppointment(appointment: Appointment): RawAppointment {
  return {
    ...appointment,
    date: fromDate(appointment.date),
    createdAt: fromDate(appointment.createdAt),
    updatedAt: fromDate(appointment.updatedAt),
  };
}

function toBilling(raw: RawBilling): Billing {
  return {
    ...raw,
    createdAt: toDate(raw.createdAt),
    updatedAt: toDate(raw.updatedAt),
  };
}

function fromBilling(billing: Billing): RawBilling {
  return {
    ...billing,
    createdAt: fromDate(billing.createdAt),
    updatedAt: fromDate(billing.updatedAt),
  };
}

function toReminder(raw: RawReminder, appointments: Appointment[]): Reminder {
  const appointment = appointments.find((item) => item.id === raw.appointmentId);
  return {
    ...raw,
    date: toDate(raw.date),
    createdAt: toDate(raw.createdAt),
    updatedAt: toDate(raw.updatedAt),
    appointment: {
      name: appointment?.name,
    },
  };
}

function defaultDb(): RawDb {
  const seed = mockDataJson as {
    patients: RawPatient[];
    doctors: DoctorOption[];
    appointments: RawAppointment[];
    billings: RawBilling[];
    reminders: RawReminder[];
  };

  return {
    patients: [...seed.patients],
    doctors: [...seed.doctors],
    appointments: [...seed.appointments],
    billings: [...seed.billings],
    reminders: [...seed.reminders],
  };
}

function readDb(): RawDb {
  if (typeof window === "undefined") {
    return defaultDb();
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const initial = defaultDb();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }

  try {
    const parsed = JSON.parse(stored) as RawDb;
    if (
      !Array.isArray(parsed?.patients) ||
      !Array.isArray(parsed?.doctors) ||
      !Array.isArray(parsed?.appointments) ||
      !Array.isArray(parsed?.billings) ||
      !Array.isArray(parsed?.reminders)
    ) {
      throw new Error("Invalid mock db");
    }

    return parsed;
  } catch {
    const fallback = defaultDb();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fallback));
    return fallback;
  }
}

function writeDb(raw: RawDb): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(raw));
}

function now(): Date {
  return new Date();
}

function nextId(values: number[]): number {
  if (values.length === 0) {
    return 1;
  }

  return Math.max(...values) + 1;
}

export const mockDb = {
  getPatients(): Patient[] {
    const db = readDb();
    return db.patients.map(toPatient);
  },

  getPatientById(id: number): Patient | undefined {
    return this.getPatients().find((item) => item.id === id);
  },

  createPatient(payload: CreatePatientRequest): Patient {
    const db = readDb();
    const timestamp = now();
    const newPatient: Patient = {
      id: nextId(db.patients.map((item) => item.id)),
      name: payload.name,
      email: payload.email,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    db.patients.push(fromPatient(newPatient));
    writeDb(db);

    return newPatient;
  },

  updatePatient(
    id: number,
    patch: { name?: string; email?: string },
  ): Patient {
    const db = readDb();
    const found = db.patients.find((item) => item.id === id);

    if (!found) {
      throw new Error("Patient not found");
    }

    if (typeof patch.name === "string") {
      found.name = patch.name;
    }

    if (typeof patch.email === "string") {
      found.email = patch.email;
    }

    found.updatedAt = now().toISOString();
    writeDb(db);

    return toPatient(found);
  },

  deletePatient(id: number): { success: boolean } {
    const db = readDb();
    db.patients = db.patients.filter((item) => item.id !== id);
    writeDb(db);
    return { success: true };
  },

  getAppointments(): Appointment[] {
    const db = readDb();
    return db.appointments.map(toAppointment);
  },

  getAppointmentById(id: number): Appointment | undefined {
    return this.getAppointments().find((item) => item.id === id);
  },

  getDoctors(): DoctorOption[] {
    const db = readDb();
    return [...db.doctors];
  },

  createAppointment(payload: CreateAppointmentRequest): Appointment {
    const db = readDb();
    const timestamp = now();
    const newAppointment: Appointment = {
      id: nextId(db.appointments.map((item) => item.id)),
      name: payload.name,
      patientId: payload.patientId,
      userId: payload.userId,
      type: payload.type,
      status: "Scheduled",
      date: new Date(payload.date),
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    db.appointments.push(fromAppointment(newAppointment));
    writeDb(db);

    return newAppointment;
  },

  softDeleteAppointment(id: number): { success: boolean } {
    const db = readDb();
    db.appointments = db.appointments.map((item) =>
      item.id === id
        ? {
            ...item,
            status: "Deleted",
            updatedAt: now().toISOString(),
          }
        : item,
    );
    writeDb(db);
    return { success: true };
  },

  getBillings(): Billing[] {
    const db = readDb();
    return db.billings.map(toBilling);
  },

  getBillingById(id: number): Billing | undefined {
    return this.getBillings().find((item) => item.id === id);
  },

  createBilling(payload: CreateBillingRequest): Billing {
    const db = readDb();
    const timestamp = now();
    const newBilling: Billing = {
      id: nextId(db.billings.map((item) => item.id)),
      appointmentId: payload.appointmentId,
      amount: payload.amount,
      description: payload.description ?? null,
      status: "DRAFT",
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    db.billings.push(fromBilling(newBilling));
    writeDb(db);

    return newBilling;
  },

  updateBilling(payload: UpdateBillingRequest): Billing {
    const db = readDb();
    const found = db.billings.find((item) => item.id === payload.id);

    if (!found) {
      throw new Error("Billing not found");
    }

    if (typeof payload.amount === "number") {
      found.amount = payload.amount;
    }

    if (payload.description !== undefined) {
      found.description = payload.description;
    }

    found.updatedAt = now().toISOString();
    writeDb(db);

    return toBilling(found);
  },

  softDeleteBilling(id: number): { success: boolean } {
    const db = readDb();
    db.billings = db.billings.map((item) =>
      item.id === id
        ? {
            ...item,
            status: "DELETED",
            updatedAt: now().toISOString(),
          }
        : item,
    );
    writeDb(db);
    return { success: true };
  },

  getDashboardWidgetsList(): DashboardWidgetItems {
    const appointments = this.getAppointments();
    const billings = this.getBillings();
    const db = readDb();
    const reminders = db.reminders.map((item) => toReminder(item, appointments));
    const currentTime = Date.now();

    const upcoming = appointments
      .filter(
        (item) =>
          item.status.toUpperCase() === "SCHEDULED" &&
          new Date(item.date).getTime() >= currentTime,
      )
      .sort((a, b) => +new Date(a.date) - +new Date(b.date));

    const past = appointments
      .filter((item) => item.status.toUpperCase() === "COMPLETED")
      .sort((a, b) => +new Date(b.date) - +new Date(a.date));

    const cancelled = appointments.filter(
      (item) => item.status.toUpperCase() === "CANCELED",
    );

    const pending = billings.filter(
      (item) => item.status === "INVOICED" || item.status === "DRAFT",
    );

    const paid = billings.filter((item) => item.status === "PAID");
    const overdue = billings.filter((item) => item.status === "OVERDUE");
    const draft = billings.filter((item) => item.status === "DRAFT");

    return {
      appointMentWidgetItem: {
        upcoming,
        past,
        cancelled,
      },
      billingWidgetItem: {
        pending,
        paid,
        overdue,
        draft,
      },
      remindersWidgetItem: {
        data: reminders,
      },
    };
  },

  resetToSeedData(): void {
    writeDb(defaultDb());
  },
};
