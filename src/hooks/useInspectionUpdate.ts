// hooks/useInspectionUpdate.ts
import axios from "axios";
import { useState } from "react";
import { useSWRConfig } from "swr";

interface InspectionUpdateRequest {
  // Adicione aqui os campos necessários para a requisição
  status?: string;
  // outros campos conforme necessário
}

interface InspectionUpdateResponse {
  // Adicione aqui os campos retornados pela API
  success: boolean;
  // outros campos conforme necessário
}

// Handle saving updated status
interface SaveStatusData {
  section: "start" | "end";
  data: InspectionUpdateRequest;
}

export const useInspectionUpdate = ( id: string, { onSuccess, onError }: { onSuccess: (data?: any) => void; onError: (error: Error | string) => void; }
) => {
  const [loading, setLoading] = useState(false);
  const { mutate } = useSWRConfig();

  const updateStatus = async (data: SaveStatusData): Promise<void> => {
    try {
      setLoading(true);

      const response = await axios.put(`/api/v1/dashboard/viagens/${id}/update-status`, data);
      if (response.status !== 201) {
        throw new Error("Falha ao atualizar o status!");
      }
      // Invalidar o cache para acionar uma atualização
      mutate("/api/v1/dashboard/viagens");
      mutate(`/api/v1/dashboard/viagens/${id}`);
      const responseData: InspectionUpdateResponse = response.data;
      onSuccess(responseData);
    } catch (error) {
      onError(
        error instanceof Error ? error : new Error("Erro ao atualizar status!")
      );
    } finally {
      setLoading(false);
    }
  };

  return { updateStatus, loading };
};
