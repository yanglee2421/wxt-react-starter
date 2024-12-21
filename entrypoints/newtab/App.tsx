import {
  alpha,
  Box,
  createTheme,
  CssBaseline,
  Fab,
  styled,
  ThemeProvider,
} from "@mui/material";
import React from "react";
import snowVillage from "./snowVillage.jpg";
import { loadSlim } from "@tsparticles/slim";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSnowPreset } from "@tsparticles/preset-snow";
import { useSyncStore } from "@/hooks/useSyncStore";
import { SettingsOutlined } from "@mui/icons-material";

const particlesInit = initParticlesEngine(async (e) => {
  await loadSnowPreset(e);
  await loadSlim(e);
});

const bgHref = new URL(snowVillage, import.meta.url).href;

const StyledImg = styled("img")({
  position: "absolute",
  inset: 0,
  zIndex: -2,
});

const SnowBg = () => {
  React.use(particlesInit);

  const [width, setWidth] = React.useState(0);
  const [height, setHeight] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setWidth(width);
      setHeight(height);
    });

    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  const alphaVal = useSyncStore((s) => s.alpha);
  const set = useSyncStore((s) => s.set);

  return (
    <Box
      ref={containerRef}
      sx={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%" }}
    >
      <StyledImg width={width} height={height} src={bgHref} draggable={false} />
      <Particles options={{ preset: "snow", background: { opacity: 0 } }} />
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundColor: (t) => alpha(t.palette.common.black, alphaVal / 100),
          zIndex: -1,
        }}
      ></Box>
      <Fab
        size="small"
        sx={{
          position: "absolute",
          bottom: 36,
          right: 36,
          backgroundColor: theme.palette.action.focus,
        }}
        onClick={() => set({ alpha: 100 - alphaVal })}
      >
        <SettingsOutlined color="action" />
      </Fab>
    </Box>
  );
};

const theme = createTheme({ palette: { mode: "dark" } });

export const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <React.Suspense>
        <SnowBg />
      </React.Suspense>
    </ThemeProvider>
  );
};