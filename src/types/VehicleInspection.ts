// Type definition for the inspection data
export interface VehicleInspection {
  id: string;
  vehicle: {
    make: string;
    model: string;
    year: string;
    plate: string;
    eixo: string;
    cidadeBase: string;
  };
  dataInspecao: string;
  status: string;
  crlvEmDia: string;
  certificadoTacografoEmDia: string;
  nivelAgua: string;
  nivelOleo: string;
  dianteira: string;
  tracao: string;
  truck: string;
  avariasCabine: string;
  bauPossuiAvarias: string;
  funcionamentoParteEletrica: string;
}
