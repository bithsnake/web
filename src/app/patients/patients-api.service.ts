import { API_BASE_URL } from "@/lib/api";
import { Patient } from "@/lib/types";

export async function getPatientById(id: number): Promise<Response> {
  return fetch(`${API_BASE_URL}/patients/${id}`, {
    method: "DELETE",
  });
}

export async function getAllPatients(): Promise<Response> {
  return fetch(`${API_BASE_URL}/patients`);
}
