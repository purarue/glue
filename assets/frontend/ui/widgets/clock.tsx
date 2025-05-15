import React, { lazy, Suspense, useEffect, useRef } from "react";

import { setWindowMsg } from "./../home";
import { dialogInfo, launchWindowFunc } from "./../windows/actions";

const minHeight = 100;
const minWidth = 100;

const Dialog = lazy(() => import("../components/dialog"));

export function Clock(setwMsg: setWindowMsg): launchWindowFunc {
  return () => {
    const { browserWidth, windowId, closeWindow } = dialogInfo({
      size: {
        height: minHeight,
        width: minHeight,
      },
      setwMsg,
    });
    setwMsg({
      spawn: true,
      windowId: windowId,
      windowObj: (
        <Suspense fallback={null}>
          <Dialog
            // spawn in the top right corner
            x={browserWidth - minWidth - 50}
            y={30}
            width={minWidth}
            height={minHeight}
            windowId={windowId}
            minHeight={minHeight}
            minWidth={minWidth}
            isResizable={false}
            // disableBodyDragging={true}
            hitCloseCallback={closeWindow}
          >
            <ClockBody />
          </Dialog>
        </Suspense>
      ),
    });
  };
}

const ClockBody = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const innerHeight = minHeight - 5;
  const innerWidth = minWidth - 5;

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const tileSize = 1.05;

    const offCanvas = document.createElement("canvas");
    offCanvas.height = innerHeight / tileSize;
    offCanvas.width = innerWidth / tileSize;

    const visibleCtx = canvasRef.current.getContext("2d")!;
    visibleCtx.imageSmoothingEnabled = false;

    // referenced:
    // https://www.w3schools.com/graphics/canvas_clock.asp
    const ctx = offCanvas.getContext("2d")!;
    let radius = offCanvas.height / 2;
    // remap the current drawing context to the middle of
    // the canvas (the center of the clock)
    ctx.translate(radius, radius);
    radius = radius * 0.9;

    const _drawFace = () => {
      const grad = ctx.createRadialGradient(
        0,
        0,
        radius * 0.95,
        0,
        0,
        radius * 1.05,
      );
      grad.addColorStop(0, "#333");
      grad.addColorStop(0.5, "white");
      grad.addColorStop(1, "#333");

      const _drawRoundedRect = (
        x: number,
        y: number,
        width: number,
        height: number,
        borderRadius: number,
      ) => {
        ctx.beginPath();
        ctx.moveTo(x + borderRadius, y);
        ctx.lineTo(x + width - borderRadius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + borderRadius);
        ctx.lineTo(x + width, y + height - borderRadius);
        ctx.quadraticCurveTo(
          x + width,
          y + height,
          x + width - borderRadius,
          y + height,
        );
        ctx.lineTo(x + borderRadius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - borderRadius);
        ctx.lineTo(x, y + borderRadius);
        ctx.quadraticCurveTo(x, y, x + borderRadius, y);
        ctx.closePath();
      };

      // clock background, rounded rectangle
      const squareWidth = radius * 1.8;
      const squareHeight = radius * 1.8;
      const squareBorderRadius = radius * 0.3;

      _drawRoundedRect(
        -squareWidth / 2,
        -squareHeight / 2,
        squareWidth,
        squareHeight,
        squareBorderRadius,
      );
      ctx.fillStyle = "#eee";
      ctx.fill();

      // edge gradient
      ctx.strokeStyle = grad;
      ctx.lineWidth = radius * 0.15;
      _drawRoundedRect(
        -squareWidth / 2,
        -squareHeight / 2,
        squareWidth,
        squareHeight,
        squareBorderRadius * 0.9,
      );

      // center square
      ctx.beginPath();
      const sideLength = radius * 0.15;
      ctx.rect(-sideLength / 2, -sideLength / 2, sideLength, sideLength);
      // ctx.arc(0, 0, radius * 0.1, 0, 2 * Math.PI);
      ctx.fillStyle = "#333";
      ctx.fill();
    };

    const _drawNumbers = () => {
      ctx.font = `normal normal 700 ${radius * 0.3}px arial`;
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      const drawDistance = radius * 0.68;
      for (let num = 1; num < 13; num++) {
        let ang = (num * Math.PI) / 6;
        ctx.rotate(ang);
        ctx.translate(0, -1 * drawDistance);
        ctx.rotate(-ang);

        // just render 12, 3, 6, 9
        if (num % 3 !== 0) {
          // render a tick
          ctx.rotate(ang);
          ctx.beginPath();
          ctx.moveTo(0, -radius * 0.16);
          ctx.lineTo(0, -radius * 0.2);
          ctx.strokeStyle = "#333";
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.rotate(-ang);
        } else {
          // render text
          ctx.fillText(num.toString(), 0, 0);
        }
        ctx.rotate(ang);
        ctx.translate(0, drawDistance);
        ctx.rotate(-ang);
      }
    };

    const _drawHand = (pos: number, length: number, width: number) => {
      ctx.beginPath();
      ctx.lineWidth = width;
      ctx.lineCap = "round";
      ctx.moveTo(0, 0);
      ctx.rotate(pos);
      ctx.lineTo(0, -length);
      ctx.stroke();
      ctx.rotate(-pos);
    };

    const _drawTime = () => {
      const now = new Date();
      let hour = now.getHours();
      let minute = now.getMinutes();
      let second = now.getSeconds();
      //hour
      hour = hour % 12;
      hour =
        (hour * Math.PI) / 6 +
        (minute * Math.PI) / (6 * 60) +
        (second * Math.PI) / (360 * 60);
      _drawHand(hour, radius * 0.5, radius * 0.09);
      //minute
      minute = (minute * Math.PI) / 30 + (second * Math.PI) / (30 * 60);
      _drawHand(minute, radius * 0.8, radius * 0.07);
      // second
      second = (second * Math.PI) / 30;
      _drawHand(second, radius * 0.9, radius * 0.02);
    };

    const _clear = () => {
      ctx.clearRect(
        -radius * 2,
        -radius * 2,
        offCanvas.width,
        offCanvas.height,
      );
    };

    // copy it onto the real canvas, so its pixelated because
    // its scaling the image up
    const _copyCanvas = () => {
      visibleCtx.clearRect(0, 0, innerWidth, innerHeight);
      visibleCtx.drawImage(offCanvas, 0, 0, innerWidth, innerHeight);
    };

    const launchSequence = () => {
      _clear();
      // draw main body, then the numbers, then the time
      // 0ms, 50ms, 100ms?
      _drawFace();
      _copyCanvas();
      setTimeout(() => {
        // draw this a few times, because it seems to do some weird
        // image scaling/pixelation thing because of the upscaling
        _drawNumbers();
        _drawNumbers();
        _drawNumbers();
        _drawNumbers();
        _copyCanvas();
      }, 100);
      setTimeout(() => {
        _drawTime();
        _copyCanvas();
      }, 200);
    };

    launchSequence();

    // gets called once a second
    const drawClock = () => {
      _clear();
      _drawFace();
      _drawNumbers();
      _drawTime();
      _copyCanvas();
    };

    const interval = window.setInterval(() => {
      drawClock();
    }, 1000);

    return () => {
      if (ctx) {
        ctx.reset();
      }
      if (visibleCtx) {
        visibleCtx.reset();
      }
      window.clearInterval(interval);
      offCanvas.remove();
    };
  }, [canvasRef.current]);
  return (
    <div
      className="clock"
      style={{
        width: innerHeight,
        height: innerWidth,
      }}
    >
      <canvas
        ref={canvasRef}
        height={innerHeight}
        width={innerWidth}
        style={{
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
};
