'use client'
import { LogoutOutlined } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import { signOut } from 'next-auth/react'

export default function LogoutButton() {
  return (
    <IconButton color="inherit" size='large' aria-label="Sair" onClick={() => signOut()}>
      <LogoutOutlined />
    </IconButton>
  )
}