import React, { useRef, useEffect, useCallback, lazy, Suspense } from "react";

import { setWindowMsg } from "./../home";
import { getWindowDimensions, Point } from "./../components/dimensions";
import { launchWindowFunc } from "./actions";
import { randomColor } from "../../color";

const minHeight = 150;
const minWidth = 300;

function randInt(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function randomLocation(
  browserWidth: number,
  browserHeight: number,
  dialogHeight: number,
  dialogWidth: number,
): Point {
  const minX = -dialogWidth * 0.5;
  const minY = -dialogHeight * 0.5;
  const maxX = browserWidth - dialogWidth * 0.5;
  const maxY = browserHeight - dialogHeight * 0.5;
  return {
    x: randInt(minX, maxX),
    y: randInt(minY, maxY),
  };
}

export function VirusWindow(setwMsg: setWindowMsg): launchWindowFunc {
  const Dialog = lazy(() => import("../components/dialog"));

  return () => {
    const { browserWidth, browserHeight } = getWindowDimensions();
    const { x, y } = randomLocation(
      browserWidth,
      browserHeight,
      minHeight,
      minWidth,
    );
    const windowId = Date.now().toString();

    setwMsg({
      spawn: true,
      windowId: windowId,
      windowObj: (
        <Suspense fallback={null}>
          <Dialog
            x={x}
            y={y}
            width={minWidth}
            height={minHeight}
            minHeight={minHeight}
            minWidth={minWidth}
            UI={{
              title: "virus",
              titleObj: <VirusTitle />,
            }}
            windowId={windowId}
            hitCloseCallback={() => VirusWindow(setwMsg)()}
          >
            <VirusBodyMemo height={minHeight} width={minWidth} />
          </Dialog>
        </Suspense>
      ),
    });

    // setTimeout to spawn another one!
    setTimeout(
      () => {
        VirusWindow(setwMsg)();
      },
      randInt(250, 1000),
    );
  };
}

interface VirusBodyProps {
  height: number;
  width: number;
}

// create a matrix of refs. this is used to save the background
// color for a x,y location in the space
const createMatrixRefs = (xc: number, yc: number) => {
  const matrix = new Array<Array<React.RefObject<HTMLDivElement>>>(yc);
  for (let y = 0; y < yc; y++) {
    matrix[y] = new Array<React.RefObject<HTMLDivElement>>(xc);
    for (let x = 0; x < xc; x++) {
      matrix[y][x] = React.createRef<HTMLDivElement>();
    }
  }
  return matrix;
};

const VirusBody = ({ height, width }: VirusBodyProps) => {
  const xc = useRef<number>(Math.ceil(width / 10) + 2);
  const yc = useRef<number>(Math.ceil(height / 10) + 2);
  const matrixRefs = useRef<Array<Array<React.RefObject<HTMLDivElement>>>>(
    createMatrixRefs(xc.current, yc.current),
  );

  const randomizeMatrix = useCallback(() => {
    for (let y = 0; y < yc.current; y++) {
      for (let x = 0; x < xc.current; x++) {
        // 'current' is set once the x,y location is rendered
        // below
        if (matrixRefs.current[y][x].current) {
          matrixRefs.current[y][x].current!.style.backgroundColor =
            randomColor();
        }
      }
    }
  }, [xc, yc]);

  useEffect(() => {
    // fire off the first randomize
    randomizeMatrix();
    // set an interval to randomize the matrix every 1-2 seconds
    const interval = window.setInterval(
      () => {
        randomizeMatrix();
      },
      randInt(1000, 2000),
    );
    return () => clearInterval(interval);
  }, []);

  // create a flexbox with rows 10 pixels wide and high
  return (
    <div
      className="virus-body"
      style={{
        height: height + 20,
        width: width + 20,
        overflow: "hidden",
      }}
    >
      {/* This is not really performant since we're creating new arrays every time, but */}
      {/* that is also sort of on purpose. Its meant to spawn a bunch of these, start lagging the page */}
      {/* and cause gc to fire, as to mimic an actual popup scam/virus */}
      {Array.from({ length: yc.current }, (_, y) => {
        return (
          <div
            key={y}
            className="virus-row"
            style={{ display: "flex", flexDirection: "row" }}
          >
            {Array.from({ length: xc.current }, (_, x) => {
              return (
                <div
                  key={x}
                  // setting the ref here starts generating colors on the next setInterval call
                  ref={matrixRefs.current[y][x]}
                  className="virus-pixel"
                ></div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

const VirusBodyMemo = React.memo(VirusBody);

const VirusTitle = React.memo(() => {
  return (
    <div className="virus-title dialog-title-text pixel">
      <span className="vt-v">v</span>
      <span className="vt-i">i</span>
      <span className="vt-r">r</span>
      <span className="vt-u">u</span>
      <span className="vt-s">s</span>
    </div>
  );
});
