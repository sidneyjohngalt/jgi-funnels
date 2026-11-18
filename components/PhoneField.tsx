"use client";

import { COUNTRIES } from "@/lib/countries";
import s from "./phone.module.css";

/**
 * Country picker plus local number. Defaults to the United States (+1).
 * The parent keeps both values and turns them into E.164 with toE164().
 */
export default function PhoneField({
  country,
  number,
  onCountry,
  onNumber,
  selectClassName,
  inputClassName,
  numberLabel = "Mobile number",
  showLabels,
  invalid,
  describedBy,
  id = "f-phone",
  stacked,
}: {
  country: string;
  number: string;
  onCountry: (iso: string) => void;
  onNumber: (v: string) => void;
  selectClassName?: string;
  inputClassName?: string;
  numberLabel?: string;
  showLabels?: { country: string; labelClassName?: string };
  invalid?: boolean;
  describedBy?: string;
  id?: string;
  /** One field per row, for narrow cards. */
  stacked?: boolean;
}) {
  const selectId = `${id}-country`;
  return (
    <div className={stacked ? `${s.row} ${s.stacked}` : s.row}>
      <div className={s.cell}>
        {showLabels ? (
          <label htmlFor={selectId} className={showLabels.labelClassName}>
            {showLabels.country}
          </label>
        ) : null}
        <select
          id={selectId}
          className={`${selectClassName ?? ""} ${s.select}`}
          value={country}
          onChange={(e) => onCountry(e.target.value)}
          aria-label={showLabels ? undefined : "Country for your mobile number"}
          autoComplete="tel-country-code"
        >
          {COUNTRIES.map((c) => (
            <option key={c.iso} value={c.iso}>
              {c.name} (+{c.dial})
            </option>
          ))}
        </select>
      </div>
      <div className={s.cell}>
        {showLabels ? (
          <label htmlFor={id} className={showLabels.labelClassName}>
            {numberLabel}
          </label>
        ) : null}
        <input
          id={id}
          className={inputClassName}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          placeholder={showLabels ? undefined : numberLabel}
          aria-label={showLabels ? undefined : numberLabel}
          value={number}
          onChange={(e) => onNumber(e.target.value)}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
        />
      </div>
    </div>
  );
}
