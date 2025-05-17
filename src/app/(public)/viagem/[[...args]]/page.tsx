'use client';

import { Box } from "@mui/material";
import InspectionForm from "./InspectionForm";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { use } from "react";

export default function Page({ params }: { params: Promise<{ args: string[] }>}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [type, id] = resolvedParams.args;

  useEffect(() => {
    if (!type || !id || !["INICIO", "FINAL"].includes(type.toUpperCase())) {
      router.push('/');
    }
  }, [type, id, router]);

  if (!type || !id) return null;

  return (
    <Box component="main" sx={{ flex: 1 }}>
      <InspectionForm type={type.toUpperCase() as "INICIO" | "FINAL"} id={id}/>
    </Box>
  );
}