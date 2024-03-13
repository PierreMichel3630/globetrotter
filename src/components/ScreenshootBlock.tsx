import { Box, Typography } from "@mui/material";

interface Screenshoot {
  label: string;
  image: string;
}

interface Props {
  screenshots: Array<Screenshoot>;
}

export const ScreenshootBlock = ({ screenshots }: Props) => {
  return (
    <Box sx={{ display: "flex", overflowX: "auto", gap: 1, p: 1 }}>
      {screenshots.map((screenshot, index) => (
        <Box
          key={index}
          sx={{
            p: 1,
            backgroundColor: "white",
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h4" sx={{ mb: 1 }}>
            {screenshot.label}
          </Typography>
          <img src={screenshot.image} width={120} />
        </Box>
      ))}
    </Box>
  );
};
