import { z } from "zod";
/*
interface PhotoData {
  description?: string;
  photo: string;
  type: 'documento' | 'tacografo' | 'extintor' | 'vehicle';
}*/
const PhotoSchema = z.object({
  photo: z.string(),
  type: z.string().optional().nullable(),
  description: z.string().optional().nullable()
});

export const InspectionSchema = z.object({
  id:                         z.string().optional(),
  status:                     z.enum(["INICIO", "FINAL","INSPECAO"]),
  kilometer:                  z.string(),
  userId:                     z.string().min(1),
  vehicleId:                  z.string().min(1),
  crlvEmDia:                  z.enum(["SIM", "NÃO"]),
  certificadoTacografoEmDia:  z.enum(["SIM", "NÃO"]),
  nivelAgua:                  z.enum(["NORMAL", "BAIXO", "CRITICO"]),
  nivelOleo:                  z.enum(["NORMAL", "BAIXO", "CRITICO"]),
  
  eixo:                       z.string(),
  dianteira:                  z.string().optional().nullable(),
  descricaoDianteira:         z.string().optional().nullable(),
  tracao:                     z.string().optional().nullable(),
  descricaoTracao:            z.string().optional().nullable(),
  truck:                      z.string().optional().nullable(),
  descricaoTruck:             z.string().optional().nullable(),
  quartoEixo:                 z.string().optional().nullable(),
  descricaoQuartoEixo:        z.string().optional().nullable(),

  avariasCabine:              z.enum(["SIM", "NÃO"]),
  descricaoAvariasCabine:     z.string().optional().nullable(),
  bauPossuiAvarias:           z.enum(["SIM", "NÃO"]),
  descricaoAvariasBau:        z.string().optional().nullable(),
  funcionamentoParteEletrica: z.enum(["BOM", "RUIM"]),
  descricaoParteEletrica:     z.string().optional().nullable(),
  
  isFinished:                 z.boolean().optional(),
  
  user:                       z.any(),
  vehicle:                    z.any(),

  fotoDocumento:              z.any(),
  fotoTacografo:              z.any(),
  fotoExtintor:               z.any(),
  
  extintor:                   z.string().optional().nullable(),
  
  photos:                     z.array(PhotoSchema).optional(),
});

export type InspectionFormData = z.infer<typeof InspectionSchema>;
export type PhotoData = z.infer<typeof PhotoSchema>;