/** Countries for the phone field. United States first and default. Dial codes without the plus. */
export type Country = { iso: string; name: string; dial: string };

export const DEFAULT_COUNTRY = "US";

export const COUNTRIES: Country[] = [
  { iso: "US", name: "United States", dial: "1" },
  { iso: "CA", name: "Canada", dial: "1" },
  { iso: "GB", name: "United Kingdom", dial: "44" },
  { iso: "AU", name: "Australia", dial: "61" },
  { iso: "NZ", name: "New Zealand", dial: "64" },
  { iso: "IE", name: "Ireland", dial: "353" },
  { iso: "AR", name: "Argentina", dial: "54" },
  { iso: "AT", name: "Austria", dial: "43" },
  { iso: "BS", name: "Bahamas", dial: "1" },
  { iso: "BE", name: "Belgium", dial: "32" },
  { iso: "BM", name: "Bermuda", dial: "1" },
  { iso: "BR", name: "Brazil", dial: "55" },
  { iso: "KY", name: "Cayman Islands", dial: "1" },
  { iso: "CL", name: "Chile", dial: "56" },
  { iso: "CN", name: "China", dial: "86" },
  { iso: "CO", name: "Colombia", dial: "57" },
  { iso: "CR", name: "Costa Rica", dial: "506" },
  { iso: "CY", name: "Cyprus", dial: "357" },
  { iso: "CZ", name: "Czech Republic", dial: "420" },
  { iso: "DK", name: "Denmark", dial: "45" },
  { iso: "DO", name: "Dominican Republic", dial: "1" },
  { iso: "EG", name: "Egypt", dial: "20" },
  { iso: "FI", name: "Finland", dial: "358" },
  { iso: "FR", name: "France", dial: "33" },
  { iso: "DE", name: "Germany", dial: "49" },
  { iso: "GR", name: "Greece", dial: "30" },
  { iso: "HK", name: "Hong Kong", dial: "852" },
  { iso: "HU", name: "Hungary", dial: "36" },
  { iso: "IS", name: "Iceland", dial: "354" },
  { iso: "IN", name: "India", dial: "91" },
  { iso: "ID", name: "Indonesia", dial: "62" },
  { iso: "IL", name: "Israel", dial: "972" },
  { iso: "IT", name: "Italy", dial: "39" },
  { iso: "JM", name: "Jamaica", dial: "1" },
  { iso: "JP", name: "Japan", dial: "81" },
  { iso: "KE", name: "Kenya", dial: "254" },
  { iso: "KW", name: "Kuwait", dial: "965" },
  { iso: "LU", name: "Luxembourg", dial: "352" },
  { iso: "MY", name: "Malaysia", dial: "60" },
  { iso: "MT", name: "Malta", dial: "356" },
  { iso: "MX", name: "Mexico", dial: "52" },
  { iso: "MC", name: "Monaco", dial: "377" },
  { iso: "NL", name: "Netherlands", dial: "31" },
  { iso: "NG", name: "Nigeria", dial: "234" },
  { iso: "NO", name: "Norway", dial: "47" },
  { iso: "PA", name: "Panama", dial: "507" },
  { iso: "PE", name: "Peru", dial: "51" },
  { iso: "PH", name: "Philippines", dial: "63" },
  { iso: "PL", name: "Poland", dial: "48" },
  { iso: "PT", name: "Portugal", dial: "351" },
  { iso: "PR", name: "Puerto Rico", dial: "1" },
  { iso: "QA", name: "Qatar", dial: "974" },
  { iso: "SA", name: "Saudi Arabia", dial: "966" },
  { iso: "SG", name: "Singapore", dial: "65" },
  { iso: "ZA", name: "South Africa", dial: "27" },
  { iso: "KR", name: "South Korea", dial: "82" },
  { iso: "ES", name: "Spain", dial: "34" },
  { iso: "SE", name: "Sweden", dial: "46" },
  { iso: "CH", name: "Switzerland", dial: "41" },
  { iso: "TW", name: "Taiwan", dial: "886" },
  { iso: "TH", name: "Thailand", dial: "66" },
  { iso: "TT", name: "Trinidad and Tobago", dial: "1" },
  { iso: "TR", name: "Turkey", dial: "90" },
  { iso: "AE", name: "United Arab Emirates", dial: "971" },
  { iso: "UY", name: "Uruguay", dial: "598" },
  { iso: "VN", name: "Vietnam", dial: "84" },
];

export function countryOf(iso: string): Country {
  return COUNTRIES.find((c) => c.iso === iso) ?? COUNTRIES[0];
}

/** Digits of the local number, with a leading 1 (US style) or trunk 0 removed. */
export function nationalDigits(iso: string, number: string): string {
  const c = countryOf(iso);
  let d = number.replace(/[^0-9]/g, "");
  if (c.dial === "1" && d.length === 11 && d.startsWith("1")) d = d.slice(1);
  if (c.dial !== "1" && c.dial !== "39") d = d.replace(/^0+/, "");
  return d;
}

/** True when the number is a plausible length for the country. */
export function validLocalNumber(iso: string, number: string): boolean {
  const c = countryOf(iso);
  const d = nationalDigits(iso, number);
  if (c.dial === "1") return d.length === 10;
  return d.length >= 6 && d.length + c.dial.length <= 15;
}

/** E.164, for example +17045551234. */
export function toE164(iso: string, number: string): string {
  return `+${countryOf(iso).dial}${nationalDigits(iso, number)}`;
}

/** Split a stored number back into a country and local number (best effort, US first). */
export function splitPhone(value: string): { iso: string; number: string } {
  const v = value.trim();
  if (!v.startsWith("+")) return { iso: DEFAULT_COUNTRY, number: v };
  const d = v.replace(/[^0-9]/g, "");
  const byLength = [...COUNTRIES].sort((a, b) => b.dial.length - a.dial.length);
  const hit = byLength.find((c) => d.startsWith(c.dial) && c.dial !== "1") ?? (d.startsWith("1") ? countryOf("US") : null);
  if (!hit) return { iso: DEFAULT_COUNTRY, number: v };
  return { iso: hit.iso, number: d.slice(hit.dial.length) };
}
