// Tipagem complementar para os dados de inspeção
export type InspectionSummary = {
    id: string;
    dataInspecao: Date;
    status: string | null;
    isFinished: boolean | null;
    vehicleId: string;
    userId: string;
};

// Tipagem para os dados agrupados por dia
export type InspectionDateGroup = {
    date: string;
    count: number;
};

// Tipagem para o resumo de status
export type StatusSummary = {
    finished: number;
    unfinished: number;
    total: number;
    finishedPercentage: number;
};

// Tipagem para o formato final do dashboard
export type DashboardData = {
    inspectionsByDate: InspectionDateGroup[];
    statusSummary: StatusSummary;
};




// Definição do tipo para os dados
export interface VehicleInspection {
    id: string;
    userId: string;
    startId: string;
    endId: string;
    vehicleId: string;
    createdAt: string;
    updatedAt: string;
    user: {
      name: string;
    };
    start: {
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
      truck: string;
      descricaoTruck: string;
      quartoEixo: string | null;
      descricaoQuartoEixo: string | null;
      avariasCabine: string;
      descricaoAvariasCabine: string | null;
      bauPossuiAvarias: string;
      descricaoAvariasBau: string | null;
      funcionamentoParteEletrica: string;
      descricaoParteEletrica: string | null;
      createdAt: string;
      updatedAt: string | null;
      kilometer: string;
      isFinished: boolean;
      extintor: string;
    };
    end: {
      id: string;
      userId: string;
      vehicleId: string;
      vehicleKey: string | null;
      dataInspecao: string;
      status: string;
      crlvEmDia?: string;
      certificadoTacografoEmDia: string;
      nivelAgua: string;
      nivelOleo: string;
      eixo: string;
      dianteira: string;
      descricaoDianteira: string;
      tracao: string;
      descricaoTracao: string;
      truck: string;
      descricaoTruck: string;
      quartoEixo: string | null;
      descricaoQuartoEixo: string | null;
      avariasCabine: string;
      descricaoAvariasCabine: string | null;
      bauPossuiAvarias: string;
      descricaoAvariasBau: string | null;
      funcionamentoParteEletrica: string;
      descricaoParteEletrica: string | null;
      createdAt: string;
      updatedAt: string | null;
      kilometer: string;
      isFinished: boolean;
      extintor: string;
    };
    vehicle: {
      make: string;
      plate: string;
      model: string;
    }
  }
  
  // Tipos para os filtros
  export interface FilterOptions {
    status: string;
    responsavel: string;
    periodo: string;
    placa: string;
  }