const BASE_URL = "http://localhost:3001";

export async function getData(endpoint) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`);

    if (!response.ok) {
      throw new Error("Data not found");
    }
    const data = await response.json();
    //console.table(data);
    return data;
  } catch (error) {
    throw error;
  }
}
