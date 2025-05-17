export interface User {
    id: string;
    name: string;
  }
  
  export interface InspectionDetail {
    start: any;
    id: string;
    userId: string;
    vehicleId: string;
    vehicleKey: string | null;
    dataInspecao: string;
    status: string;
    crlvEmDia: string;
    certificadoTacografoEmDia: string;
    nivelAgua: string;
    nivelOleo: string;
    eixo: string;
    dianteira: string;
    descricaoDianteira: string;
    tracao: string;
    descricaoTracao: string;
    truck: string | null;
    descricaoTruck: string | null;
    quartoEixo: string | null;
    descricaoQuartoEixo: string | null;
    avariasCabine: string;
    descricaoAvariasCabine: string | null;
    bauPossuiAvarias: string;
    descricaoAvariasBau: string | null;
    funcionamentoParteEletrica: string;
    descricaoParteEletrica: string;
    fotoVeiculo: string | null;
    createdAt: string;
    updatedAt: string | null;
    kilometer: string;
    isFinished: boolean;
  }
  
  export interface InspectionData {
    [x: string]: any;
    vehicle: any;
    id: string;
    userId: string;
    startId: string | null;
    endId: string | null;
    createdAt: string;
    updatedAt: string;
    user: User;
    start: InspectionDetail | null;
    end: InspectionDetail | null;
  }