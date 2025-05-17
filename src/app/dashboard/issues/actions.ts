import { fetcher } from "@/lib/ultils";
import useSWR from "swr";

export const dataSource = {
    fields: [
        { field: 'vehicle', headerName: 'Veiculo', flex: 1 },
        { field: 'model', headerName: 'Modelo', flex: 1 },
        { field: 'user', headerName: 'Usuario', flex: 1 },
        { field: 'dataInicial', headerName: 'Data Inicio', flex: 1 },
        { field: 'dataFinal', headerName: 'Data Final', flex: 1 },
        { field: 'status', headerName: 'Status', flex: 1 },
    ],
    getMany: async () => {
        const { data, isLoading } = useSWR('/api/v2/dashboard/viagens', fetcher);/*
        // Fetch data from server ?${queryParams.toString()}
        const res = await fetch(`/api/v2/dashboard/viagens`, {
            method: 'GET',
        });
        const resJson = await res.json();

        if (!res.ok) {
            throw new Error(resJson.error);
        }*/
        return {
            data,
            itemCount: data.length,
            isLoading
        };
    },
    getOne: async (id:string| number) => {
        // Fetch record from server
        const res = await fetch(`/api/v2/dashboard/issues/${id}`, {
            method: 'GET',
        });
        const resJson = await res.json();

        if (!res.ok) {
            throw new Error(resJson.error);
        }
        return resJson;
    },
    createOne: async (data:object) => {
        // Create record in the server
        const res = await fetch('/api/v2/dashboard/issues', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' },
        });
        const resJson = await res.json();

        if (!res.ok) {
            throw new Error(resJson.error);
        }
        return resJson;
    },
    updateOne: async (id:string|number, data:object) => {
        // Update record in the server
        const res = await fetch(`/api/v2/dashboard/issues/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' },
        });
        const resJson = await res.json();

        if (!res.ok) {
            throw new Error(resJson.error);
        }
        return resJson;
    },
    deleteOne: async (id:string|number) => {
        // Delete record in the server
        const res = await fetch(`/api/v2/dashboard/issues/${id}`, {
            method: 'DELETE',
        });

        if (!res.ok) {
            throw new Error((res as any)?.error);
        }
    },
    validate: (formValues:object) => {
        let issues: { message: string; path: [keyof object] }[] = [];
        /*
                if (!formValues.title) {
                    issues = [...issues, { message: 'Title is required', path: ['title'] }];
                }
                if (!formValues.text) {
                    issues = [...issues, { message: 'Text is required', path: ['text'] }];
                }
        */
        return { issues };
    },
};
