import { Paper, Typography } from "@mui/material";

type EmptyStateProps = {
  title: string;
  description?: string;
};

export const EmptyState = ({ title, description }: EmptyStateProps) => (
  <Paper variant="outlined" sx={{ p: 4, textAlign: "center" }}>
    <Typography variant="h6" component="p">
      {title}
    </Typography>
    {description && (
      <Typography color="text.secondary">{description}</Typography>
    )}
  </Paper>
);
