// types.ts
export interface VehicleInspection {
    id: string;
    placa: string;
    modelo: string;
    crlvEmDia: boolean;
    certificadoTacografoEmDia: boolean;
    avariasCabine: boolean;
    bauPossuiAvarias: boolean;
    funcionamentoParteEletrica: boolean;
    dataInspecao: string;
  }