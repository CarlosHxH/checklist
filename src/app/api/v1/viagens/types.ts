export type InspectionPhoto = {
    id: string;
    inspectionId: string;
    description?: string | null;
    photo: string;
    createdAt: Date;
    type?: string | null;
  };
  
  export type Inspection = {
    id: string;
    userId: string;
    vehicleId: string;
    vehicleKey?: string | null;
    dataInspecao?: Date | null;
    status?: string | null;
    crlvEmDia?: string | null;
    certificadoTacografoEmDia?: string | null;
    nivelAgua?: string | null;
    nivelOleo?: string | null;
    eixo?: string | null;
    dianteira?: string | null;
    descricaoDianteira?: string | null;
    tracao?: string | null;
    descricaoTracao?: string | null;
    truck?: string | null;
    descricaoTruck?: string | null;
    quartoEixo?: string | null;
    descricaoQuartoEixo?: string | null;
    avariasCabine?: string | null;
    descricaoAvariasCabine?: string | null;
    bauPossuiAvarias?: string | null;
    descricaoAvariasBau?: string | null;
    funcionamentoParteEletrica?: string | null;
    descricaoParteEletrica?: string | null;
    createdAt: Date;
    updatedAt?: Date | null;
    kilometer?: string | null;
    isFinished?: boolean | null;
    extintor?: string | null;
    photos?: InspectionPhoto[];
    fotoDocumento?: InspectionPhoto[];
    fotoTacografo?: InspectionPhoto[];
    fotoExtintor?: InspectionPhoto[];
    fotoVeiculo?: InspectionPhoto[];
  };
  
  export type Inspect = {
    id: string;
    userId: string;
    startId?: string | null;
    endId?: string | null;
    vehicleId?: string | null;
    createdAt: Date;
    updatedAt: Date;
    start?: Inspection | null;
    end?: Inspection | null;
  };