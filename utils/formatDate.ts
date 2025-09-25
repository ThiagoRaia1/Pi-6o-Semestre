export function formatDateToBR(date: Date): string {
  // converte para Date se necessário
  const d = date instanceof Date ? date : new Date(date);

  // usa getUTC* para pegar a data sem aplicar fuso horário
  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const year = d.getUTCFullYear();

  return `${day}/${month}/${year}`;
}
