"use client";
import useSWR from "swr";
import React, { useState, useEffect } from "react";
import { fetcher } from "@/lib/ultils";
import Loading from "@/components/Loading";
import { useSession } from "next-auth/react";
import ButtonLabel from "@/components/ButtonLabel";
import { TextField, Button, Grid, Typography, Divider, Box, Alert } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { InspectionFormData } from "@/types/InspectionSchema";
import ComboBox from "@/components/ComboBox";
import Link from "next/link";
import PhotoUploader from "@/components/_ui/PhotoUploader";

export interface Option {
  [key: string]: any;
  setValue: (name: keyof InspectionFormData, value: any) => void;
}

export interface Vehicle extends Option {
  id: string;
  plate: string;
  model: string;
  eixo: string;
  tacografo?: boolean;
}

export interface EixoSectionProps {
  eixoNumber: number;
  label: string;
  fieldName: keyof InspectionFormData;
  selectedVehicle?: Vehicle;
  control: any;
  register: any;
  watch: any;
  setValue: any;
}

// Extracted to its own component for better readability
export const EixoSection: React.FC<EixoSectionProps> = ({ 
  eixoNumber, 
  label, 
  fieldName, 
  selectedVehicle, 
  control, 
  register, 
  watch, 
  setValue 
}) => {
  if (!selectedVehicle || Number(selectedVehicle.eixo) < Number(eixoNumber)) return null;
  
  const currentValue = watch(fieldName);
  const field = `descricao${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}` as keyof InspectionFormData;

  useEffect(() => {
    if (currentValue === "BOM") setValue(field, "");
  }, [currentValue, field]);

  return (
    <Grid item xs={12} md={6}>
      <ButtonLabel 
        label={label} 
        name={fieldName} 
        options={["BOM", "RUIM"]} 
        control={control} 
        rules={{ required: "Este campo é obrigatório" }} 
      />
      {currentValue === "RUIM" && (
        <TextField 
          {...register(field, { required: "Este campo é obrigatório" })} 
          label="Qual Defeito?" 
          multiline 
          fullWidth 
          rows={2} 
          error={!!watch(`${field}_error`)}
          helperText={watch(`${field}_error`)}
        />
      )}
    </Grid>
  );
};

const InspectionForm: React.FC<{ type: "INICIO" | "FINAL"; id: string }> = ({ type, id }) => {
  const [submitting, setSubmitting] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { data: session } = useSession();
  
  const { data: vehicles, error: vehiclesError, isLoading: vehiclesLoading } = useSWR<Vehicle[]>(
    `/api/v1/vehicles`, 
    fetcher
  );
  const isExistingTrip = !["CREATE"].includes(id.toUpperCase());
  
  const {
    register, 
    watch, 
    control, 
    setValue, 
    reset, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm<InspectionFormData>({
    mode: "onChange",
    defaultValues: {
      status: type,
      userId: session?.user?.id,
    }
  });


  const selectedVehicleId = watch("vehicleId");
  const selectedVehicle = vehicles && vehicles?.find((v) => v.id === (isExistingTrip ? id : selectedVehicleId));

  // Load trip data if editing existing trip
  useEffect(() => {
    if (!isExistingTrip || !session?.user?.id) return;

    setLoadingData(true);
    fetch(`/api/v1/viagens/${id}`)
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch trip data');
        return response.json();
      })
      .then(data => {
        // Reset form with the appropriate data based on inspection type
        reset(type === "INICIO" ? data.start : data.end || {});
        setValue("userId", session.user.id);
        setValue("vehicleId", data.vehicleId);
        setValue("status", type);
      })
      .catch(err => {
        console.error('Error fetching trip data:', err);
        setError('Failed to load trip data. Please try again.');
      })
      .finally(() => setLoadingData(false));
  }, [id, isExistingTrip, reset, session?.user?.id, type, setValue]);

  // Set vehicle data when selected or loaded
  useEffect(() => {
    if (selectedVehicle) {
      setValue("eixo", selectedVehicle.eixo);
    }
  }, [selectedVehicle, setValue]);

  // Reset description fields based on main field values
  useEffect(() => {
    const avariasCabine = watch("avariasCabine");
    const bauPossuiAvarias = watch("bauPossuiAvarias");
    const funcionamentoParteEletrica = watch("funcionamentoParteEletrica");

    if (avariasCabine === "NÃO") setValue("descricaoAvariasCabine", '');
    if (bauPossuiAvarias === "NÃO") setValue("descricaoAvariasBau", '');
    if (funcionamentoParteEletrica === "BOM") setValue("descricaoParteEletrica", '');
  }, [watch, setValue]);



  const onSubmit = async (data: InspectionFormData) => {
    setSubmitting(true);
    setError(null);
    
    try {
      const formData = new FormData();
      // Append all form fields except photos
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'photos' && value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      // Append photos
      if (data.photos && Array.isArray(data.photos)) {
        data.photos.forEach((photo: any, index: number) => {
          if (photo && photo.photo) {
            formData.append('photos', photo.photo.slice(0,10));
            formData.append(`photoTypes[${index}]`, photo.type || 'vehicle');
            formData.append(`photoDescriptions[${index}]`, photo.description || `Veículo foto-${index + 1}`);
          }
        });
      }

      const response = await fetch(`/api/v1/viagens/${id}`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json()
        console.log({errorData})
        errorData.catch(() => null);
        throw new Error(errorData?.message || 'Failed to submit form');
      }

      // Success - redirect to home
      router.push('/');
    } catch (err: any) {
      console.error('Error submitting form:', err);
      setError(err.message || "Erro ao enviar os dados!");
    } finally {
      setTimeout(() => {
        setSubmitting(false);
      }, 1000);
    }
  };

  if (vehiclesLoading || loadingData) return <Loading />;
  
  if (vehiclesError || !vehicles) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h6">Erro ao carregar os veículos</Typography>
        <Link href={'/'}>Voltar</Link>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 800, margin: "auto", mt: 2, mb: 4, boxShadow:"0px 0px 2px #ccc" }}>
      {isSubmitting && <Loading />}
      
      <Typography variant="h4" gutterBottom align="center">
        {isExistingTrip ? `Editar inspeção - ${type}` : `Nova inspeção - ${type}`}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Divider sx={{ mb: 2 }}>Dados do usuário</Divider>
          </Grid>

          <Grid item xs={12}>
            <ButtonLabel 
              disabled 
              label="Viagem" 
              name="status" 
              options={["INICIO", "FINAL"]} 
              control={control} 
              rules={{ required: "Este campo é obrigatório" }} 
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <ComboBox 
              disabled={isExistingTrip} 
              name="vehicleId" 
              label="Selecione um veículo" 
              options={vehicles.map((v) => ({ label: `${v.plate} - ${v.model}`, value: v.id }))} 
              control={control} 
              rules={{ required: 'Veículo é obrigatório' }} 
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField 
              type="number" 
              {...register("kilometer", { required: "Este campo é obrigatório" })} 
              fullWidth 
              size="small" 
              label="Quilometragem:" 
              error={!!errors.kilometer}
              helperText={errors.kilometer?.message}
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 1 }}>Documentos</Divider>
          </Grid>

          <Grid item xs={12} md={selectedVehicle?.tacografo ? 6 : 12}>
            <ButtonLabel 
              label="CRLV em dia?" 
              name="crlvEmDia" 
              options={["SIM", "NÃO"]} 
              control={control} 
              rules={{ required: "Este campo é obrigatório" }} 
            />
          </Grid>

          {selectedVehicle?.tacografo && (
            <Grid item xs={12} md={6}>
              <ButtonLabel 
                label="Cert. Tacografo em Dia?" 
                name="certificadoTacografoEmDia" 
                options={["SIM", "NÃO"]} 
                control={control} 
                rules={{ required: "Este campo é obrigatório" }} 
              />
            </Grid>
          )}

          <Grid item xs={12}>
            <Divider sx={{ my: 1 }}>Níveis</Divider>
          </Grid>

          <Grid item xs={12} md={6}>
            <ButtonLabel 
              label="Nível Água" 
              name="nivelAgua" 
              control={control} 
              options={["NORMAL", "BAIXO", "CRITICO"]} 
              rules={{ required: "Este campo é obrigatório" }} 
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <ButtonLabel 
              label="Nível Óleo" 
              name="nivelOleo" 
              options={["NORMAL", "BAIXO", "CRITICO"]} 
              control={control} 
              rules={{ required: "Este campo é obrigatório" }} 
            />
          </Grid>

          {selectedVehicle && (
            <>
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }}>Situação dos Pneus</Divider>
              </Grid>
              
              <EixoSection 
                eixoNumber={1} 
                selectedVehicle={selectedVehicle} 
                label="DIANTEIRA" 
                fieldName="dianteira" 
                control={control} 
                register={register} 
                watch={watch} 
                setValue={setValue} 
              />
              
              <EixoSection 
                eixoNumber={2} 
                selectedVehicle={selectedVehicle} 
                label="TRAÇÃO" 
                fieldName="tracao" 
                control={control} 
                register={register} 
                watch={watch} 
                setValue={setValue} 
              />
              
              <EixoSection 
                eixoNumber={3} 
                selectedVehicle={selectedVehicle} 
                label="TRUCK" 
                fieldName="truck" 
                control={control} 
                register={register} 
                watch={watch} 
                setValue={setValue} 
              />
              
              <EixoSection 
                eixoNumber={4} 
                selectedVehicle={selectedVehicle} 
                label="QUARTO EIXO" 
                fieldName="quartoEixo" 
                control={control} 
                register={register} 
                watch={watch} 
                setValue={setValue} 
              />
            </>
          )}

          <Grid item xs={12}>
            <Divider sx={{ my: 1 }}>Avarias</Divider>
          </Grid>

          <Grid item xs={12} md={6}>
            <ButtonLabel 
              label="Avarias na Cabine" 
              name="avariasCabine" 
              options={["NÃO", "SIM"]} 
              control={control} 
              rules={{ required: "Este campo é obrigatório" }} 
            />
            {watch("avariasCabine") === "SIM" && (
              <TextField 
                {...register("descricaoAvariasCabine", { required: "Este campo é obrigatório" })} 
                label="Qual avaria?" 
                error={!!errors.descricaoAvariasCabine} 
                helperText={errors.descricaoAvariasCabine?.message}
                multiline 
                fullWidth 
                rows={2} 
              />
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            <ButtonLabel 
              label="Avarias no Baú" 
              name="bauPossuiAvarias" 
              options={["NÃO", "SIM"]} 
              control={control} 
              rules={{ required: "Este campo é obrigatório" }} 
            />
            {watch("bauPossuiAvarias") === "SIM" && (
              <TextField 
                {...register("descricaoAvariasBau", { required: "Este campo é obrigatório" })} 
                label="Qual defeito?" 
                error={!!errors.descricaoAvariasBau} 
                helperText={errors.descricaoAvariasBau?.message}
                multiline 
                fullWidth 
                rows={2} 
              />
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            <Divider sx={{ mb: 2 }}>Elétrica</Divider>
            <ButtonLabel 
              label="Parte Elétrica" 
              name="funcionamentoParteEletrica" 
              options={["BOM", "RUIM"]} 
              control={control} 
              rules={{ required: "Este campo é obrigatório" }} 
            />
            {watch("funcionamentoParteEletrica") === "RUIM" && (
              <TextField 
                {...register("descricaoParteEletrica", { required: "Este campo é obrigatório" })} 
                label="Qual defeito?" 
                error={!!errors.descricaoParteEletrica} 
                helperText={errors.descricaoParteEletrica?.message}
                multiline 
                fullWidth 
                rows={2} 
              />
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            <Divider sx={{ mb: 2 }}>Extintor</Divider>
            <ButtonLabel 
              label="EXTINTOR EM DIAS?" 
              name="extintor" 
              options={["SIM", "NÃO"]} 
              control={control} 
              rules={{ required: "Este campo é obrigatório" }} 
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }}>Foto da frente do veículo</Divider>
            <Controller
              name="photos"
              control={control}
              render={({ field }) => (
                <PhotoUploader
                  name="photos"
                  label="Foto do veículo"
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

          <Grid item xs={12} sx={{ mt: 2 }}>
            {Object.keys(errors).length > 0 && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                Existem campos obrigatórios não preenchidos!
              </Alert>
            )}
            
            <Button 
              disabled={submitting || Object.keys(errors).length > 0} 
              fullWidth 
              type="submit" 
              variant="contained" 
              color="primary"
              size="large"
            >
              {submitting ? 'Salvando...' : 'Salvar'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default InspectionForm;