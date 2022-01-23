import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import classes from "./App.module.scss";
import useResizeObserver from "@react-hook/resize-observer";
import {
  Slider,
  IconButton,
  ThemeProvider,
  createTheme,
  Stack,
  Toolbar,
  Box,
  Typography,
} from "@mui/material";
import { DarkModeOutlined, LightModeOutlined } from "@mui/icons-material";

const dpr = () => window.devicePixelRatio ?? 1;
const useSize = (
  target: React.MutableRefObject<HTMLElement | undefined>
): DOMRect | Record<string, never> => {
  const [size, setSize] = useState<DOMRect | Record<string, never>>({});

  useLayoutEffect(() => {
    setSize(target.current?.getBoundingClientRect() ?? {});
  }, [target]);

  useResizeObserver(
    target as unknown as React.MutableRefObject<HTMLElement>,
    (entry) => setSize(entry.contentRect)
  );
  return size;
};
type FireworkParticle = { life: number;olife: number;x: number; y: number; vx: number; vy: number; r: number; color: { r: number; g: number; b: number; } };
function App() {
  const containerRef = useRef<HTMLElement>();
 
  const nodesRef = useRef<FireworkParticle[]>([]);

  const { width: containerWidth = 1, height: containerHeight = 1 } =
    useSize(containerRef);
  const [canvasNode, setCanvasNode] = useState<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasNode) {
      var dp = dpr();
      var width = containerWidth;
      var height = containerHeight;

      canvasNode.width = width*dp;
      canvasNode.height = height*dp;
      var context: CanvasRenderingContext2D = canvasNode.getContext(
        "2d"
      ) as CanvasRenderingContext2D;

      const tick = () => {
        context.resetTransform();
        context.scale(dp, dp);
        context.globalCompositeOperation = 'source-over';
        context.fillStyle = "rgba(0,0,0,0.1)";
        context.fillRect(0, 0, width, height);
        let ooo = height / 10;
        
        if (Math.random() > 0.5) {
          nodesRef.current.push({ x: Math.random() * width, y: height, vx: (Math.random() * 2 - 1) * ooo, vy: -4*ooo+(Math.random() * 2 - 1) * ooo*2, color: { r: Math.random(), g: Math.random(), b: Math.random() }, r: 2, life: 2000,olife: 2000 });
        }
        let nen = [];
        for (let n of nodesRef.current) {
          n.life -= 1000 / 60;
          n.x += n.vx * 1 / 60;
          n.y += n.vy * 1 / 60;
          n.vy +=  1 / 60*2*ooo;
          if (n.life > 0) {
            nen.push(n);
            let m = (n.life) / n.olife+Math.log2(n.r)*1;
            context.globalCompositeOperation = 'lighter';
            context.fillStyle = `rgba(${Math.floor(n.color.r * 255*m)},${Math.floor(n.color.g * 255*m)},${Math.floor(n.color.b * 255*m)},1)`;
            // console.log(context.fillStyle )
            let rr =n.r;
            context.fillRect(n.x-rr/2, n.y-rr/2, rr, rr);
          } else {
            if (n.r > 1) {
              let nnr = n.r / 2;
              const c = { r: Math.random(), g: Math.random(), b: Math.random() };
              for (let i = 0; i < 100; i++){
                let oa = Math.random() * Math.PI * 2;
                let or = Math.random()+0.1;
                let ox = Math.cos(oa)*or;
                let oy = Math.sin(oa)*or-1;
                nen.push({ x: n.x, y: n.y, vx: ox * ooo+n.vx*0, vy:  oy* ooo+n.vy*0, color: c, r: nnr, life:n.olife/2, olife:n.olife/2,  });
        
              }
            }
          }
        }
        nodesRef.current = nen;
      };
      const intt = window.setInterval(tick, 1000 / 60);
      return () => {
        window.clearInterval(intt);
      };
    }
  }, [containerWidth, containerHeight]);
  return (
    <ThemeProvider
      theme={createTheme({ palette: { mode: "dark" } })}
    >
      <div className={classes.App}>
        <div
          className={classes.canvasContainer}
          ref={(el) => (containerRef.current = el ?? undefined)}
        >
          <canvas
            ref={(node) => setCanvasNode(node)}
            className={classes.canvas}
          />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
