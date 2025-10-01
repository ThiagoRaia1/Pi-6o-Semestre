/**
 * Converte uma data no formato `Date` ou `string` (ISO)
 * para o formato brasileiro `dd/MM/yyyy`.
 *
 * @param date - A data a ser formatada. Pode ser um objeto `Date` ou uma string no formato ISO.
 * @returns A data formatada como string no padrão brasileiro (ex: "01/10/2025").
 *
 * @example
 * ```ts
 * formatDateToBR("2025-10-01"); // "01/10/2025"
 * formatDateToBR(new Date("2025-10-01")); // "01/10/2025"
 * ```
 */
export function formatDateToBR(date: Date | string): string {
  // converte para Date se necessário
  const d = date instanceof Date ? date : new Date(date);

  // usa getUTC* para pegar a data sem aplicar fuso horário
  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const year = d.getUTCFullYear();

  return `${day}/${month}/${year}`;
}

/**
 * Converte uma data no formato `Date` ou `string` (ISO)
 * para o formato `yyyy/MM/dd`.
 *
 * @param date - A data a ser formatada. Pode ser um objeto `Date` ou uma string no formato ISO.
 * @returns A data formatada como string no padrão brasileiro (ex: "2025-10-01").
 *
 * @example
 * ```ts
 * formatDateToBR("2025-10-01"); // "01/10/2025"
 * formatDateToBR(new Date("2025-10-01")); // "01/10/2025"
 * ```
 */
export function DateDataToString(date: Date | string): string {
  // converte para Date se necessário
  const d = date instanceof Date ? date : new Date(date);

  // usa getUTC* para pegar a data sem aplicar fuso horário
  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const year = d.getUTCFullYear();

  return `${year}-${month}-${day}`;
}
