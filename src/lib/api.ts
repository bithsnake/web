export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:1000";

export const api = {
  get: async function <T>(resource: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}/${resource}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        cache: "no-cache",
      },
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "No response body");
      throw new Error(`API GET request failed: ${response.status} ${response.statusText}. Response body: ${body}`);
    }

    return (await response.json()) as T;
  },

  post: async function <T, K>(resource: string, data: K): Promise<Response> {
    const response = await fetch(`${API_BASE_URL}${resource}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "No response body");
      throw new Error(`API POST request failed: ${response.status} ${response.statusText}. Response body: ${body}`);
    }

    return await response;
  },
};
