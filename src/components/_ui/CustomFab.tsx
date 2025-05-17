"use client";
import { type MouseEventHandler } from "react";
import Link from "next/link";
import Fab from "@mui/material/Fab";
import { Edit as EditIcon, Add as AddIcon } from "@mui/icons-material";

interface Props {
  href?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  variant?: "Plus" | "Edit";
  color?: "primary" | "success" | "error" | "info" | "warning";
}

const fabStyles = {
  position: "fixed",
  bottom: 20,
  right: 30,
} as const;

export default function CustomFab({ href, onClick, variant = "Plus", color = 'primary' }: Props) {
  const Icon = variant === "Edit" ? EditIcon : AddIcon;

  const fabElement = (
    <Fab sx={fabStyles} color={color}><Icon /></Fab>
  );

  if (href) return <Link href={href}>{fabElement}</Link>;
  
  return (
    <Fab onClick={onClick} sx={fabStyles} color={color}><Icon /></Fab>
  );
}