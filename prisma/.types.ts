export interface User {
    id: string;
    email: string;
    emailVerified?: Date;
    password?: string;
    name?: string;
    image?: string;
    createdAt: Date;
    role?: string;
    accounts: Account[];
    vehicles: Vehicle[];
    inspections: Inspection[];
  }
  
  export interface Account {
    id: string;
    userId: string;
    type: string;
    provider: string;
    providerAccountId: string;
    refresh_token?: string;
    access_token?: string;
    expires_at?: number;
    token_type?: string;
    scope?: string;
    id_token?: string;
    session_state?: string;
    user: User;
  }
  
  export interface Vehicle {
    id: string;
    make: string;
    model: string;
    year: number;
    plate: string;
    userId: string;
    user: User;
    inspections: Inspection[];
  }
  
  export interface Inspection {
    id: string;
    userId: string;
    vehicleId: string;
    dataInspecao: Date;
    crlvEmDia: boolean;
    fotoCRLV?: string;
    certificadoTacografoEmDia: boolean;
    fotoTacografo?: string;
    nivelAgua?: string;
    fotoNivelAgua?: string;
    nivelOleo?: string;
    fotoNivelOleo?: string;
    situacaoPneus?: string;
    fotosPneusBom?: string;
    motivoPneuRuim?: string;
    fotosPneusRuim?: string;
    pneuFurado: boolean;
    fotoPneuFurado?: string;
    avariasCabine: boolean;
    descricaoAvariasCabine?: string;
    fotosAvariasCabine?: string;
    bauPossuiAvarias: boolean;
    descricaoAvariasBau?: string;
    fotosAvariasBau?: string;
    funcionamentoParteEletrica: boolean;
    motivoParteEletricaRuim?: string;
    fotosParteEletricaRuim?: string;
    sugestao?: string;
    user: User;
    vehicle: Vehicle;
  }