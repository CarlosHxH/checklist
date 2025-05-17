// src/utils/index.ts

/**
 * Retorna as datas de início e fim para os últimos 30 dias
 * @returns Objeto com startDate (data inicial) e endDate (data atual)
 */
export function getLast30Days() {
  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999); // Fim do dia atual

  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 29); // 30 dias atrás (incluindo hoje)
  startDate.setHours(0, 0, 0, 0); // Início do dia

  return { startDate, endDate };
}

/**
 * Formata uma data para exibição
 * @param date Data a ser formatada
 * @returns String no formato DD/MM
 */
export function formatDateShort(date: Date): string {
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`;
}

/**
 * Gera um array com as representações de datas dos últimos 30 dias
 * @returns Array de strings no formato DD/MM
 */
export function getLast30DaysLabels(): string[] {
  const { startDate } = getLast30Days();
  const labels: string[] = [];

  for (let i = 0; i < 30; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    labels.push(formatDateShort(date));
  }

  return labels;
}

export function getFullYear(): { startDate: Date, endDate: Date } {
  const currentYear = new Date().getFullYear();
  const startDate = new Date(currentYear, 0, 1);
  const endDate = new Date(currentYear + 1, 0, 1);
  return { startDate, endDate };
}

export async function fileToBase64(file: Blob): Promise<string> {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Fallback for mime type
    const mimeType = 'type' in file ? (file as File).type : 'application/octet-stream';

    return `data:${mimeType};base64,${buffer.toString('base64')}`;
  } catch (error) {
    console.error('Error converting file to base64:', error);
    throw error;
  }
}

/*export async function fileToBase64(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  return `data:${file.type};base64,${buffer.toString('base64')}`;
}
*/

export async function getBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      resolve(reader.result)
    }
    reader.onerror = reject
  })
}

export function getDaysInMonth(
  month: number = new Date().getMonth() + 1,
  year: number = new Date().getFullYear()
) {
  const date = new Date(year, month, 0);
  const monthName = date.toLocaleDateString("pt-BR", {
    month: "short",
  });
  const daysInMonth = date.getDate();
  const days = [];
  let i = 1;
  while (days.length < daysInMonth) {
    days.push(`${monthName} ${i}`);
    i += 1;
  }
  return days;
}

export function filterInspections(obj: any, searchTerm: string): string[] {
  const results: string[] = [];
  function recursiveSearch(current: any, path: string[] = []) {
    // Se for null ou undefined, retorna
    if (current === null || current === undefined) return;
    // Se for string, verifica se inclui o termo buscado
    if (typeof current === "string") {
      if (current.toLowerCase().includes(searchTerm.toLowerCase())) {
        results.push([...path, current].join(" > "));
      }
      return;
    }
    // Se for array, percorre cada elemento
    if (Array.isArray(current)) {
      current.forEach((item, index) => {
        recursiveSearch(item, [...path, `[${index}]`]);
      });
      return;
    }
    // Se for objeto, percorre suas propriedades
    if (typeof current === "object") {
      Object.entries(current).forEach(([key, value]) => recursiveSearch(value, [...path, key]));
    }
  }
  recursiveSearch(obj);
  return results || obj;
}

export function formatDate(date: Date | string, format = 'yyyy-MM-dd') {
  if(typeof date === 'string') date = new Date(date);
  const pad = (num: number): string => num.toString().padStart(2, '0');
  return format
    .replace('yyyy', date.getFullYear().toString())
    .replace('yy', date.getFullYear().toString().slice(2))
    .replace('MM', pad(date.getMonth() + 1))
    .replace('dd', pad(date.getDate()))
    .replace('HH', pad(date.getHours()))
    .replace('mm', pad(date.getMinutes()))
    .replace('ss', pad(date.getSeconds()));
}

interface CSVOptions {
  filename?: string;
  delimiter?: string;
  headers?: string[];
  dateFormat?: string;
}

/**
 * Utility class to handle CSV exports
 */
export class CSVExporter {
  private static formatDate(date: Date, format = 'yyyy-MM-dd') {
    const pad = (num: number): string => num.toString().padStart(2, '0');

    return format
      .replace('yyyy', date.getFullYear().toString())
      .replace('MM', pad(date.getMonth() + 1))
      .replace('dd', pad(date.getDate()))
      .replace('HH', pad(date.getHours()))
      .replace('mm', pad(date.getMinutes()))
      .replace('ss', pad(date.getSeconds()));
  }

  private static formatValue(value: any): string {
    if (value === null || value === undefined) return '';
    if (value instanceof Date) return this.formatDate(value);
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  }

  /**
   * Exports array of objects to CSV
   */
  static export<T extends object>(
    data: T[],
    options: CSVOptions = {}
  ): void {
    const {
      filename = `export_${this.formatDate(new Date(), 'yyyy-MM-dd_HHmmss')}.csv`,
      delimiter = ';',
      headers,
      dateFormat
    } = options;

    if (!data.length) {
      console.warn('No data to export');
      return;
    }

    // Get headers from first object if not provided
    const csvHeaders = headers || Object.keys(data[0]);

    // Create CSV content
    const csvContent = [
      // Headers row
      csvHeaders.join(delimiter),
      // Data rows
      ...data.map(item =>
        csvHeaders
          .map(header => {
            const value = (item as any)[header];

            // Format date if dateFormat is provided
            if (value instanceof Date && dateFormat) {
              return this.formatDate(value, dateFormat);
            }

            // Escape values containing delimiter or quotes
            const formattedValue = this.formatValue(value);
            if (formattedValue.includes(delimiter) || formattedValue.includes('"')) {
              return `"${formattedValue.replace(/"/g, '""')}"`;
            }

            return formattedValue;
          })
          .join(delimiter)
      )
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    /*
    if (navigator.msSaveBlob) { // IE 10+
      navigator.msSaveBlob(blob, filename);
      return;
    }*/

    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
/*
// Example usage:
interface User {
  id: number;
  name: string;
  email: string;
  birthDate: Date;
  active: boolean;
  metadata?: Record<string, any>;
}
/*
// Example data
const users: User[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    birthDate: new Date('1990-05-15'),
    active: true,
    metadata: { role: 'admin' }
  },
  // ... more users
];
/*
// Basic usage
CSVExporter.exportToCSV(users);

// Advanced usage with options
CSVExporter.exportToCSV(users, {
  filename: 'users_export.csv',
  delimiter: ';',
  headers: ['ID', 'Name', 'Email', 'Birth Date', 'Status', 'Metadata'],
  dateFormat: 'dd/MM/yyyy'
});*/