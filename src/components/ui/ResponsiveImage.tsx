import { Box } from "@mui/material";

type ResponsiveImageProps = {
  mobile: string;
  tablet: string;
  desktop: string;
  alt: string;
};

export const ResponsiveImage = ({
  mobile,
  tablet,
  desktop,
  alt,
}: ResponsiveImageProps) => (
  <picture>
    <source media="(min-width: 1024px)" srcSet={desktop} />
    <source media="(min-width: 640px)" srcSet={tablet} />
    <Box
      component="img"
      src={mobile}
      alt={alt}
      sx={{ display: "block", width: "100%", height: "auto" }}
    />
  </picture>
);
