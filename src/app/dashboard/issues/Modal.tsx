'use client';
import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Grid, CircularProgress, Alert, Divider, Box, Tabs, Tab, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { Save as SaveIcon, Close as CloseIcon } from '@mui/icons-material';
import ButtonLabel from '@/components/_ui/ButtonLabel';
import { useForm, FormProvider, Controller } from 'react-hook-form';

interface Vehicle {
  id?: string;
  plate?: string;
  model?: string;
}

interface InspectionData {
  start?: {
    nivelAgua: string;
    nivelOleo: string;
    avariasCabine: string;
    bauPossuiAvarias: string;
    funcionamentoParteEletrica: string | null;
    descricaoAvariasCabine: string | null;
    descricaoAvariasBau?: string | null;
    descricaoParteEletrica: string | null;
    dianteira: string | null;
    descricaoDianteira: string | null;
    tracao: string | null;
    descricaoTracao: string | null;
    truck: string | null;
    descricaoTruck: string | null;
    quartoEixo: string | null;
    descricaoQuartoEixo: string | null;
  };
  end?: {
    nivelAgua: string;
    nivelOleo: string;
    avariasCabine: string;
    bauPossuiAvarias: string;
    funcionamentoParteEletrica: string | null;
    descricaoAvariasCabine: string | null;
    descricaoAvariasBau?: string | null;
    descricaoParteEletrica: string | null;
    dianteira: string | null;
    descricaoDianteira: string | null;
    tracao: string | null;
    descricaoTracao: string | null;
    truck: string | null;
    descricaoTruck: string | null;
    quartoEixo: string | null;
    descricaoQuartoEixo: string | null;
  };
  vehicle?: Vehicle;
}


interface FormDataType {
  nivelAgua: string;
  nivelOleo: string;
  avariasCabine: string;
  bauPossuiAvarias: string;
  funcionamentoParteEletrica: string;
  descricaoAvariasCabine: string;
  descricaoAvariasBau: string;
  descricaoParteEletrica: string;
  resolvidoPor: string;
  observacoes: string;
  dianteira: string;
  descricaoDianteira: string;
  tracao: string;
  descricaoTracao: string;
  truck: string;
  descricaoTruck: string;
  quartoEixo: string;
  descricaoQuartoEixo: string;
}

interface StatusUpdateModalProps {
  open: boolean;
  onClose: () => void;
  inspectionData: InspectionData;
  onSave: (data: { section: 'start' | 'end'; data: any }) => Promise<void>;
  loading?: boolean;
}

const StatusUpdateModal: React.FC<StatusUpdateModalProps> = ({ open, onClose, inspectionData, onSave, loading = false }) => {
  const [tabValue, setTabValue] = useState(0);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const startForm = useForm<FormDataType>({
    defaultValues: {
      nivelAgua: inspectionData?.start?.nivelAgua || '',
      nivelOleo: inspectionData?.start?.nivelOleo || '',
      avariasCabine: inspectionData?.start?.avariasCabine || '',
      bauPossuiAvarias: inspectionData?.start?.bauPossuiAvarias || '',
      funcionamentoParteEletrica: inspectionData?.start?.funcionamentoParteEletrica || '',
      descricaoAvariasCabine: inspectionData?.start?.descricaoAvariasCabine || '',
      descricaoAvariasBau: inspectionData?.start?.descricaoAvariasBau || '',
      descricaoParteEletrica: inspectionData?.start?.descricaoParteEletrica || '',
      resolvidoPor: '',
      observacoes: '',
      dianteira: inspectionData?.start?.dianteira || '',
      descricaoDianteira: inspectionData?.start?.descricaoDianteira || '',
      tracao: inspectionData?.start?.tracao || '',
      descricaoTracao: inspectionData?.start?.descricaoTracao || '',
      truck: inspectionData?.start?.truck || '',
      descricaoTruck: inspectionData?.start?.descricaoTruck || '',
      quartoEixo: inspectionData?.start?.quartoEixo || '',
      descricaoQuartoEixo: inspectionData?.start?.descricaoQuartoEixo || '',
    }
  });

  const endForm = useForm<FormDataType>({
    defaultValues: {
      nivelAgua: inspectionData?.end?.nivelAgua || '',
      nivelOleo: inspectionData?.end?.nivelOleo || '',
      avariasCabine: inspectionData?.end?.avariasCabine || '',
      bauPossuiAvarias: inspectionData?.end?.bauPossuiAvarias || '',
      funcionamentoParteEletrica: inspectionData?.end?.funcionamentoParteEletrica || '',
      descricaoAvariasCabine: inspectionData?.end?.descricaoAvariasCabine || '',
      descricaoAvariasBau: inspectionData?.end?.descricaoAvariasBau || '',
      descricaoParteEletrica: inspectionData?.end?.descricaoParteEletrica || '',
      resolvidoPor: '',
      observacoes: '',
      dianteira: inspectionData?.end?.dianteira || '',
      descricaoDianteira: inspectionData?.end?.descricaoDianteira || '',
      tracao: inspectionData?.end?.tracao || '',
      descricaoTracao: inspectionData?.end?.descricaoTracao || '',
      truck: inspectionData?.end?.truck || '',
      descricaoTruck: inspectionData?.end?.descricaoTruck || '',
      quartoEixo: inspectionData?.end?.quartoEixo || '',
      descricaoQuartoEixo: inspectionData?.end?.descricaoQuartoEixo || '',
    }
  });

  // Get the current form based on the active tab
  const currentForm = tabValue === 0 ? startForm : endForm;
  const { control, handleSubmit, watch, setValue, reset, formState: { errors } } = currentForm;

  // Watch for values that affect conditional fields
  const avariasCabine = watch('avariasCabine');
  const bauPossuiAvarias = watch('bauPossuiAvarias');
  const funcionamentoParteEletrica = watch('funcionamentoParteEletrica');


  useEffect(() => {
    // Reset forms when inspectionData changes
    if (inspectionData?.start) {
      startForm.reset({
        nivelAgua: inspectionData.start.nivelAgua || '',
        nivelOleo: inspectionData.start.nivelOleo || '',
        avariasCabine: inspectionData.start.avariasCabine || '',
        bauPossuiAvarias: inspectionData.start.bauPossuiAvarias || '',
        funcionamentoParteEletrica: inspectionData.start.funcionamentoParteEletrica || '',
        descricaoAvariasCabine: inspectionData.start.descricaoAvariasCabine || '',
        descricaoAvariasBau: inspectionData.start.descricaoAvariasBau || '',
        descricaoParteEletrica: inspectionData.start.descricaoParteEletrica || '',
        resolvidoPor: '',
        observacoes: '',
        dianteira: inspectionData.start.dianteira || '',
        descricaoDianteira: inspectionData.start.descricaoDianteira || '',
        tracao: inspectionData.start.tracao || '',
        descricaoTracao: inspectionData.start.descricaoTracao || '',
        truck: inspectionData.start.truck || '',
        descricaoTruck: inspectionData.start.descricaoTruck || '',
        quartoEixo: inspectionData.start.quartoEixo || '',
        descricaoQuartoEixo: inspectionData.start.descricaoQuartoEixo || '',
      });
    }

    if (inspectionData?.end) {
      endForm.reset({
        nivelAgua: inspectionData.end.nivelAgua || '',
        nivelOleo: inspectionData.end.nivelOleo || '',
        avariasCabine: inspectionData.end.avariasCabine || '',
        bauPossuiAvarias: inspectionData.end.bauPossuiAvarias || '',
        funcionamentoParteEletrica: inspectionData.end.funcionamentoParteEletrica || '',
        descricaoAvariasCabine: inspectionData.end.descricaoAvariasCabine || '',
        descricaoAvariasBau: inspectionData.end.descricaoAvariasBau || '',
        descricaoParteEletrica: inspectionData.end.descricaoParteEletrica || '',
        resolvidoPor: '',
        observacoes: '',
        dianteira: inspectionData.end.dianteira || '',
        descricaoDianteira: inspectionData.end.descricaoDianteira || '',
        tracao: inspectionData.end.tracao || '',
        descricaoTracao: inspectionData.end.descricaoTracao || '',
        truck: inspectionData.end.truck || '',
        descricaoTruck: inspectionData.end.descricaoTruck || '',
        quartoEixo: inspectionData.end.quartoEixo || '',
        descricaoQuartoEixo: inspectionData.end.descricaoQuartoEixo || '',
      });
    }
  }, [inspectionData, startForm, endForm]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setSuccess(false);
    setError('');
  };

  const resetForm = () => {
    startForm.reset();
    endForm.reset();
    setSuccess(false);
    setError('');
  };

  const onSubmit = async (data: FormDataType) => {
    try {
      setSuccess(false);
      setError('');

      const currentSection = tabValue === 0 ? 'start' : 'end';
      if (!data.resolvidoPor) {
        setError('Por favor, preencha quem resolveu o problema.');
        return;
      }

      await onSave({
        section: currentSection,
        data: data
      });

      setSuccess(true);
      onClose(); // Fechar o modal diretamente após o salvamento bem-sucedido
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar as alterações.');
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const hasIssues = (section: 'start' | 'end') => {
    const data = inspectionData?.[section];
    if (!data) return false;

    return (
      data.nivelAgua != 'NORMAL' ||
      data.nivelOleo != 'NORMAL' ||
      data.avariasCabine === 'SIM' ||
      data.bauPossuiAvarias === 'SIM' ||
      data.funcionamentoParteEletrica === 'RUIM' ||
      data?.dianteira === 'RUIM' ||
      data?.tracao === 'RUIM' ||
      data?.truck === 'RUIM' ||
      data?.quartoEixo === 'RUIM'
    );
  };

  const renderFormFields = (section: 'start' | 'end') => {
    const data = inspectionData?.[section];
    if (!data) {
      return (
        <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
          Dados de {section === 'start' ? 'início' : 'fim'} da viagem não disponíveis.
        </Typography>
      );
    }

    if (!hasIssues(section)) {
      return (
        <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
          Não há problemas ou avarias para corrigir no {section === 'start' ? 'início' : 'fim'} da viagem.
        </Typography>
      );
    }

    const EixoSection: React.FC<{
      name: "dianteira" | "tracao" | "truck" | "quartoEixo";
      label: string;
      descricao: "descricaoDianteira" | "descricaoTracao" | "descricaoTruck" | "descricaoQuartoEixo"; }> =
      ({ name, label, descricao }) => {
      if (!(data && data[name] === 'RUIM')) return null;
      return (
        <Grid item xs={12} md={6}>
          <Controller name={name} control={control} render={({ field }) => (
            <ButtonLabel name={name} label={label} options={["BOM", "RUIM"]} onChange={(value) => setValue(name,value)} />
          )}/>
          <Controller name={descricao} control={control} render={({ field }) => (<TextField {...field} label="Qual Defeito?" multiline fullWidth rows={2} />)} />
        </Grid>
      );
    }

    return (
      <FormProvider {...currentForm}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {(data.nivelAgua != 'NORMAL' || data.nivelOleo != 'NORMAL') && (
              <>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" fontWeight="bold">Níveis de Fluidos</Typography>
                  <Divider sx={{ mb: 1 }} />
                </Grid>
                {data.nivelAgua != 'NORMAL' && (
                  <Grid item xs={12} sm={6}>
                    <Controller name="nivelAgua" control={control} render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel>Nível de Água</InputLabel>
                        <Select {...field} label="Nível de Água">
                          <MenuItem value="BAIXO">BAIXO</MenuItem>
                          <MenuItem value="CRITICO">CRITICO</MenuItem>
                          <MenuItem value="NORMAL">OK (Corrigido)</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                    />
                  </Grid>
                )}
                {data.nivelOleo != 'NORMAL' && (
                  <Grid item xs={12} sm={6}>
                    <Controller name="nivelOleo" control={control} render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel>Nível de Óleo</InputLabel>
                        <Select {...field} label="Nível de Óleo">
                          <MenuItem value="BAIXO">BAIXO</MenuItem>
                          <MenuItem value="CRITICO">CRITICO</MenuItem>
                          <MenuItem value="NORMAL">OK (Corrigido)</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                    />
                  </Grid>
                )}
              </>
            )}

            {[data.avariasCabine, data.bauPossuiAvarias].includes("SIM") && (
              <>
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold">Avarias</Typography>
                  <Divider sx={{ mb: 1 }} />
                </Grid>
                {data.avariasCabine === 'SIM' && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <Controller name="avariasCabine" control={control} render={({ field }) => (
                        <FormControl fullWidth>
                          <InputLabel>Avarias na Cabine</InputLabel>
                          <Select {...field} label="Avarias na Cabine">
                            <MenuItem value="SIM">Com Avarias</MenuItem>
                            <MenuItem value="NÃO">Corrigido</MenuItem>
                          </Select>
                        </FormControl>
                      )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller name="descricaoAvariasCabine" control={control} render={({ field }) => (
                        <TextField {...field} fullWidth label="Descrição das Avarias na Cabine" disabled={avariasCabine !== 'SIM'} multiline rows={2} />)}
                      />
                    </Grid>
                  </>
                )}
                {data.bauPossuiAvarias === 'SIM' && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <Controller name="bauPossuiAvarias" control={control} render={({ field }) => (
                        <FormControl fullWidth>
                          <InputLabel>Avarias no Baú</InputLabel>
                          <Select {...field} label="Avarias no Baú">
                            <MenuItem value="SIM">Com Avarias</MenuItem>
                            <MenuItem value="NÃO">Corrigido</MenuItem>
                          </Select>
                        </FormControl>
                      )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller name="descricaoAvariasBau" control={control} render={({ field }) => (
                        <TextField {...field} fullWidth label="Descrição das Avarias no Baú" disabled={bauPossuiAvarias !== 'SIM'} multiline rows={2} />
                      )}
                      />
                    </Grid>
                  </>
                )}
              </>
            )}

            {data.funcionamentoParteEletrica === "RUIM" && (
              <>
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold">Parte Elétrica</Typography>
                  <Divider sx={{ mb: 1 }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller name="funcionamentoParteEletrica" control={control} render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Funcionamento da Parte Elétrica</InputLabel>
                      <Select {...field} label="Funcionamento da Parte Elétrica">
                        <MenuItem value="RUIM">PROBLEMAS</MenuItem>
                        <MenuItem value="BOM">OK (Corrigido)</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller name="descricaoParteEletrica" control={control} render={({ field }) => (
                    <TextField {...field} fullWidth label="Descrição dos Problemas Elétricos" disabled={funcionamentoParteEletrica !== 'RUIM'} multiline rows={2} />
                  )} />
                </Grid>
              </>
            )}

            {[data.dianteira, data.tracao, data.truck, data.quartoEixo].includes('RUIM') && (
              <Grid item xs={12}><Divider>Situação dos Pneus</Divider></Grid>
            )}

            <EixoSection name='dianteira' descricao='descricaoDianteira' label='Dianteira' />
            <EixoSection name='tracao' descricao='descricaoTracao' label='Tração' />
            <EixoSection name='truck' descricao='descricaoTruck' label='Truck' />
            <EixoSection name='quartoEixo' descricao='descricaoQuartoEixo' label='Quarto Eixo' />

            {hasIssues(section) && (
              <>
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold">Informações da Correção</Typography>
                  <Divider sx={{ mb: 1 }} />
                </Grid>
                <Grid item xs={12}>
                  <Controller name="resolvidoPor" control={control} rules={{ required: "Campo obrigatório" }} render={({ field, fieldState }) => (
                    <TextField {...field} required fullWidth label="Resolvido por" placeholder="Nome do responsável pela correção" error={!!fieldState.error} helperText={fieldState.error?.message || ''} />
                  )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller name="observacoes" control={control} render={({ field }) => (
                    <TextField {...field} fullWidth label="Observações" multiline rows={3} placeholder="Detalhes sobre as correções realizadas" />
                  )} />
                </Grid>
              </>
            )}
          </Grid>
        </form>
      </FormProvider>
    );
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle component="div">
        <Typography variant="h6" component="div">
          Atualizar Status de Problemas e Avarias
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          Veículo: {inspectionData?.vehicle?.plate} - {inspectionData?.vehicle?.model}
        </Typography>
      </DialogTitle>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="inspection tabs">
          <Tab label="Início da Viagem" disabled={!inspectionData?.start || !hasIssues('start')} />
          <Tab label="Fim da Viagem" disabled={!inspectionData?.end || !hasIssues('end')} />
        </Tabs>
      </Box>

      <DialogContent>
        {success && (<Alert severity="success" sx={{ mb: 2 }}>Alterações salvas com sucesso!</Alert>)}
        {error && !success && (<Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>)}
        {tabValue === 0 ? renderFormFields('start') : renderFormFields('end')}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button startIcon={<CloseIcon />} onClick={handleClose} color="inherit">
          Cancelar
        </Button>

        <Button
          startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
          onClick={handleSubmit(onSubmit)}
          color="primary"
          variant="contained"
          disabled={loading || (tabValue === 0 && !hasIssues('start')) || (tabValue === 1 && !hasIssues('end'))}
        >
          {loading ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StatusUpdateModal;