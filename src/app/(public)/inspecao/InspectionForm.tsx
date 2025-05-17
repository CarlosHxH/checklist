"use client";
import useSWR from "swr";
import React from "react";
import { fetcher } from "@/lib/ultils";
import Loading from "@/components/Loading";
import { useSession } from "next-auth/react";
import ButtonLabel from "@/components/ButtonLabel";
import { TextField, Button, Grid, Typography, Paper, Divider, Box } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { InspectionFormData } from "@/types/InspectionSchema";
import { EixoSection, Vehicle } from "@/components/EixoSection";
import ComboBox from "@/components/ComboBox";
import Link from "next/link";
import PhotoUploader from "@/components/_ui/PhotoUploader";

const InspectionForm: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { data: vehicles, error } = useSWR<Vehicle[], { [key: string]: any }>(`/api/v1/vehicles`, fetcher);

  const { register, watch, control, setValue, handleSubmit, formState: { errors, isSubmitting } } = useForm<InspectionFormData>({
    defaultValues: { 
      userId: session?.user?.id, 
      status: 'INSPECAO', 
      vehicleId: "", 
      eixo: "0", 
      isFinished: true 
    }
  });

  const avariasCabine = watch("avariasCabine");
  const bauPossuiAvarias = watch("bauPossuiAvarias");
  const funcionamentoParteEletrica = watch("funcionamentoParteEletrica");

  React.useEffect(() => {
    if (avariasCabine === "NÃO") setValue("descricaoAvariasCabine", undefined);
    if (bauPossuiAvarias === "NÃO") setValue("descricaoAvariasBau", undefined);
    if (funcionamentoParteEletrica === "BOM") setValue("descricaoParteEletrica", undefined);
  }, [avariasCabine, bauPossuiAvarias, funcionamentoParteEletrica, setValue]);

  const onSubmit = async (data: InspectionFormData) => {
    try {
      // Create FormData object
      const formData = new FormData();
      
      // Add all fields to FormData
      Object.entries(data).forEach(([key, value]) => {
        // Skip photos and specific photo fields as we'll handle them separately
        if (key !== 'photos' && key !== 'fotoDocumento' && key !== 'fotoTacografo' && key !== 'fotoExtintor') {
          if (value !== undefined && value !== null) {
            formData.append(key, String(value));
          }
        }
      });
      
      // Add documento photo if exists
      if (data.fotoDocumento) {
        formData.append('photos', data.fotoDocumento);
        formData.append('photoTypes', JSON.stringify({
          fileName: data.fotoDocumento.name,
          type: 'documento',
          description: 'Documento do veículo'
        }));
      }

      // Add tacografo photo if exists
      if (data.fotoTacografo) {
        formData.append('photos', data.fotoTacografo);
        formData.append('photoTypes', JSON.stringify({
          fileName: data.fotoTacografo.name,
          type: 'tacografo',
          description: 'Tacógrafo'
        }));
      }

      // Add extintor photo if exists
      if (data.fotoExtintor) {
        formData.append('photos', data.fotoExtintor);
        formData.append('photoTypes', JSON.stringify({
          fileName: data.fotoExtintor.name,
          type: 'extintor',
          description: 'Extintor'
        }));
      }

      // Add vehicle photos if they exist
      if (data.photos && Array.isArray(data.photos)) {
        data.photos.forEach((photoObj, index) => {
          if (photoObj.photo) {
            formData.append('photos', photoObj.photo);
            formData.append('photoTypes', JSON.stringify({
              fileName: photoObj.photo,
              type: 'vehicle',
              description: `Veiculo ${index + 1}`
            }));
          }
        });
      }

      // Send FormData to the server
      const response = await fetch('/api/v1/inspecao', {
        method: 'POST',
        body: formData, // No need to set Content-Type header as browser will set it with boundary
      });

      if (!response.ok) {
        throw new Error('Falha ao criar inspeção');
      }
      
      //const result = await response.json();
      router.push('/');
    } catch (error) {
      console.error('Erro ao enviar os dados:', error);
      alert('Erro ao criar a inspeção!');
    }
  };

  if (!vehicles) return <Loading />;
  if (error) return <div>Erro de carregamento dos veículos <Link href={'/'}>Voltar</Link></div>;

  const selectedVehicleId = watch("vehicleId");
  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId);

  return (
    <Box sx={{ p: 3, maxWidth: 800, margin: "auto",boxShadow:"0px 0px 2px #ccc"  }}>
      {isSubmitting && <Loading />}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography variant="h4" gutterBottom>CRIAR INSPEÇÃO</Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}><Divider>Dados do usuário</Divider></Grid>

          <Grid item xs={12}>
            <ButtonLabel disabled label="Viagem" name="status" options={["INSPECAO"]} control={control} rules={{ required: "Este campo é obrigatório" }} />
          </Grid>

          <Grid item xs={12} md={6}>
            <ComboBox name="vehicleId" label="Selecione um veículo" options={vehicles.map((v) => ({ label: `${v.plate} - ${v.model}`, value: v.id }))} control={control} rules={{ required: 'Veículo é obrigatório' }} />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField type="number" {...register("kilometer", { required: "Este campo é obrigatório" })} fullWidth size="small" label="Quilometragem:" />
          </Grid>

          <Grid item xs={12}><Divider>Documentos</Divider></Grid>

          <Grid item xs={12}  md={selectedVehicle?.tacografo?6:12}>
            <ButtonLabel label="CRLV em dia?" name="crlvEmDia" options={["SIM", "NÃO"]} control={control} rules={{ required: "Este campo é obrigatório" }} />
            <Controller
              name="photos"
              control={control}
              render={({ field }) => (
                <PhotoUploader
                  name="fotoDocumento"
                  label="FOTO DO DOCUMENTO"
                  onChange={async (photos: File[]) => {
                    if (photos && photos.length > 0) {
                      setValue("fotoDocumento", photos[0]);
                    }
                  }}
                />
              )}
            />
          </Grid>

          {selectedVehicle?.tacografo && <Grid item xs={12} md={6}>
            <ButtonLabel label="Cert. Tacografo em Dia?" name="certificadoTacografoEmDia" options={["SIM", "NÃO"]} control={control} rules={{ required: "Este campo é obrigatório" }} />
            <Controller
              name="photos"
              control={control}
              render={({ field }) => (
                <PhotoUploader
                  name="fotoTacografo"
                  label="FOTO DO DOCUMENTO"
                  onChange={async (photos: File[]) => {
                    if (photos && photos.length > 0) {
                      setValue("fotoTacografo", photos[0]);
                    }
                  }}
                />
              )}
            />
          </Grid>}

          <Grid item xs={12}><Divider>Níveis</Divider></Grid>

          <Grid item xs={12} md={6}>
            <ButtonLabel label="Nível Água" name="nivelAgua" control={control} options={["NORMAL", "BAIXO", "CRITICO"]} rules={{ required: "Este campo é obrigatório" }} />
          </Grid>

          <Grid item xs={12} md={6}>
            <ButtonLabel label="Nível Óleo" name="nivelOleo" options={["NORMAL", "BAIXO", "CRITICO"]} control={control} rules={{ required: "Este campo é obrigatório" }} />
          </Grid>

          {selectedVehicle && (
            <>
              <Grid item xs={12}><Divider>Situação dos Pneus</Divider></Grid>
              <EixoSection eixoNumber={1} label="DIANTEIRA" fieldName="dianteira" selectedVehicle={selectedVehicle} control={control} register={register} watch={watch} setValue={setValue} />
              <EixoSection eixoNumber={2} label="TRAÇÃO" fieldName="tracao" selectedVehicle={selectedVehicle} control={control} register={register} watch={watch} setValue={setValue} />
              <EixoSection eixoNumber={3} label="TRUCK" fieldName="truck" selectedVehicle={selectedVehicle} control={control} register={register} watch={watch} setValue={setValue} />
              <EixoSection eixoNumber={4} label="QUARTO EIXO" fieldName="quartoEixo" selectedVehicle={selectedVehicle} control={control} register={register} watch={watch} setValue={setValue} />
            </>
          )}

          <Grid item xs={12}><Divider>Avarias</Divider></Grid>

          <Grid item xs={12} md={6}>
            <ButtonLabel label="Avarias na Cabine" name="avariasCabine" options={["NÃO", "SIM"]} control={control} rules={{ required: "Este campo é obrigatório" }} />
            {watch("avariasCabine") === "SIM" && (
              <TextField {...register("descricaoAvariasCabine", { required: "Este campo é obrigatório" })} label="Qual avaria?" error={!!errors.descricaoAvariasCabine} multiline fullWidth rows={2} />
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            <ButtonLabel label="Avarias no Baú" name="bauPossuiAvarias" options={["NÃO", "SIM"]} control={control} rules={{ required: "Este campo é obrigatório" }} />
            {watch("bauPossuiAvarias") === "SIM" && (
              <TextField {...register("descricaoAvariasBau", { required: "Este campo é obrigatório" })} label="Qual defeito?" error={!!errors.descricaoAvariasBau} multiline fullWidth rows={2} />
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            <Divider>Elétrica</Divider>
            <ButtonLabel label="Parte Elétrica" name="funcionamentoParteEletrica" options={["BOM", "RUIM"]} control={control} rules={{ required: "Este campo é obrigatório" }} />
            {watch("funcionamentoParteEletrica") === "RUIM" && (
              <TextField {...register("descricaoParteEletrica", { required: "Este campo é obrigatório" })} label="Qual defeito?" error={!!errors.descricaoParteEletrica} multiline fullWidth rows={2} />
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            <Divider>EXTINTOR</Divider>
            <ButtonLabel label="EXTINTOR EM DIAS?" name="extintor" options={["SIM", "NÃO"]} control={control} rules={{ required: "Este campo é obrigatório" }} />
            <Controller
              name="photos"
              control={control}
              render={({ field }) => (
                <PhotoUploader
                  name="fotoExtintor"
                  label="FOTO DO DOCUMENTO"
                  onChange={async (photos: File[]) => {
                    if (photos && photos.length > 0) {
                      setValue("fotoExtintor", photos[0]);
                    }
                  }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Divider>FOTO DO VEICULO</Divider>
            <Typography color="error">Minimo 4 fotos</Typography>
            <Controller
              name="photos"
              control={control}
              render={({ field }) => (
                <PhotoUploader
                  name="photos"
                  label="Foto do veículo"
                  multiple
                  isRemoved={true}
                  onChange={async (photos: File[]) => {
                    const processedPhotos = await Promise.all(
                      photos.map(async (f, i) => ({
                        photo: new File([f], f.name, { type: f.type }),
                        type: 'vehicle',
                        description: `Veículo foto-${i + 1}`
                      }))
                    );
                    field.onChange(processedPhotos);
                  }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={12}>
            {Object.keys(errors).length > 0 && (
              <Typography color="error" align="center" gutterBottom>
                {errors.root?.message || "Existem campos obrigatórios não preenchidos!"}
              </Typography>
            )}
            <Button 
              fullWidth 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default InspectionForm;