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
