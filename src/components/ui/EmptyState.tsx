import { Paper, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export const EmptyState = ({ title, description, action }: EmptyStateProps) => (
  <Paper variant="outlined" sx={{ p: 4 }}>
    <Stack spacing={1} sx={{ alignItems: "center", textAlign: "center" }}>
      <Typography variant="h6" component="p">
        {title}
      </Typography>
      {description && (
        <Typography color="text.secondary">{description}</Typography>
      )}
      {action}
    </Stack>
  </Paper>
);
