import { Stack, IconButton } from "@mui/material";
import { ThemeSwitcher } from "@toolpad/core/DashboardLayout";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

export default function ToolbarActionsSearch() {
    const router = useRouter()
    const { data: session } = useSession()
    return (
      <Stack direction="row">
        {["ADMIN","USER"].includes(session?.user.role||"DRIVER") && (
          <IconButton onClick={() => router.push('/dashboard')}>
            <AdminPanelSettingsIcon/>
          </IconButton>
        )}
        <ThemeSwitcher/>
      </Stack>
    );
  }