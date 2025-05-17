export const fakeArray = (value: number) =>
  Array.from({ length: value }, (_, i) => i + 1);

export const fetcher = (url: string) => fetch(url).then((r) => r.json());

export const hoje = (() => new Date().toLocaleString("pt-BR"))();
/*
export const formatDate = (dateString: string | Date) => {
  return new Date(dateString).toLocaleDateString("pt-BR");
};*/

// Formatar a data para exibição
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export const stringToDate = (isoString: string) => {
  return isoString.slice(0, 16);
};

export const today = () => new Date().toISOString().split("T")[0];
export type AnyObject = { [key: string]: any };

/**
 * Function to find a string in an object's properties.
 * @param obj - The object to search through.
 * @param searchString - The string to search for.
 * @returns An array of keys where the search string is found.
 */
export function findObject(obj: AnyObject, searchString: string): string[] {
  const foundKeys: string[] = [];

  // Helper function to recursively search through the object
  function search(obj: AnyObject) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];

        // Check if the value is a string and contains the search string
        if (typeof value === "string" && value.includes(searchString)) {
          foundKeys.push(key);
        }

        // If the value is an object, search recursively
        if (typeof value === "object" && value !== null) {
          search(value);
        }
      }
    }
  }

  search(obj);
  return foundKeys;
}

/**
 * Filtra um array de itens com base em múltiplos critérios de filtro
 * @param array O array a ser filtrado
 * @param filters Um objeto com chaves representando propriedades e valores representando critérios de filtro
 * @returns Um novo array contendo apenas os itens que correspondem a todos os filtros
 */
export function multiFilter<T extends Record<string, any>>(
  array: T[],
  filters: Record<string, string | null | undefined>
): T[] {
  return array.filter((item) => {
    return Object.entries(filters).every(([key, value]) => {
      // Se o valor do filtro for nulo ou indefinido, não aplica o filtro
      if (!value) return true;

      const filterValues = value.split(",").map((v) => v.trim().toLowerCase());
      const itemValue = String(item[key]).toLowerCase();

      // Verifica se algum dos valores do filtro corresponde ao valor do item
      return filterValues.some((filterValue) => {
        // Lida com comparações numéricas
        if (!isNaN(Number(itemValue)) && !isNaN(Number(filterValue))) {
          return Number(itemValue) === Number(filterValue);
        }
        // Lida com inclusões de string
        return itemValue.includes(filterValue);
      });
    });
  });
}
