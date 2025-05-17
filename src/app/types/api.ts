// types/api.ts

// Inspection correction request types
export interface InspectionUpdateData {
  nivelAgua?: string;
  nivelOleo?: string;
  avariasCabine?: string;
  bauPossuiAvarias?: string;
  funcionamentoParteEletrica?: string;
  descricaoAvariasCabine?: string | null;
  descricaoAvariasBau?: string | null;
  descricaoParteEletrica?: string | null;
  resolvidoPor: string;
  observacoes?: string | null;
}

export interface InspectionUpdateRequest {
  section: "start" | "end";
  data: InspectionUpdateData;
}

export interface InspectionUpdateResponse {
  message: string;
  data: any;
  correction: {
    id: string;
    inspectionId: string;
    section: string;
    resolvidoPor: string;
    observacoes: string | null;
    userId: string;
    createdAt: string;
  };
}

// Error response
export interface ErrorResponse {
  error: string;
}
