import { AppBar, Container, Link, Toolbar } from "@mui/material";
import { Link as RouterLink, Outlet } from "react-router-dom";

export const AppLayout = () => (
  <>
    <AppBar position="static" elevation={0}>
      <Toolbar>
        <Link
          component={RouterLink}
          to="/"
          color="inherit"
          underline="none"
          variant="h6"
        >
          Car inventory
        </Link>
      </Toolbar>
    </AppBar>

    <Container component="main" maxWidth="lg" sx={{ py: 4 }}>
      <Outlet />
    </Container>
  </>
);
