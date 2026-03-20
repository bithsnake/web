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
