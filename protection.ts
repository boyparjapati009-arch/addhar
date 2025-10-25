const AADHAAR_PROTECT_URL = 'https://raw.githubusercontent.com/TheWhiteHat1/aadhar-protect-/main/aadhaarprotect%2Cjson';
const NUMBER_PROTECT_URL = 'https://raw.githubusercontent.com/TheWhiteHat1/protect/main/protect.json';

export async function fetchProtectedAadhaars(): Promise<string[]> {
  try {
    const response = await fetch(AADHAAR_PROTECT_URL);
    if (!response.ok) {
      console.error('Failed to fetch protected Aadhaar list');
      return [];
    }
    const data = await response.json();
    return data.aadhaar_numbers || [];
  } catch (error) {
    console.error('Error fetching or parsing protected Aadhaar list:', error);
    return [];
  }
}

export async function fetchProtectedNumbers(): Promise<string[]> {
  try {
    const response = await fetch(NUMBER_PROTECT_URL);
    if (!response.ok) {
      console.error('Failed to fetch protected numbers list');
      return [];
    }
    const data = await response.json();
    return data.protected_numbers || [];
  } catch (error) {
    console.error('Error fetching or parsing protected numbers list:', error);
    return [];
  }
}
