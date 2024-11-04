import React, { useState } from "react";

import { BrowserView, MobileView } from "react-device-detect";
import CanvasDraw from "react-canvas-draw";
import { getWindowDimensions } from "./../components/dimensions";
import { fullScreenDialogScale } from "./actions";
import { PaintControls } from "./customize";

const minHeight = 400;
const minWidth = 300;

const PaintBody = () => {
  return (
    <>
      <BrowserView>
        <Paint />
      </BrowserView>
      <MobileView>
        <p
          style={{
            width: "100%",
            textAlign: "center",
            marginLeft: "1rem",
            marginRight: "1rem",
          }}
        >
          Sorry, painting doesn't work on mobile...
        </p>
      </MobileView>
    </>
  );
};

const paintDefaultProps = {
  onChange: null,
  loadTimeOffset: 5,
  lazyRadius: 30,
  catenaryColor: "#0a0302",
  hideGrid: true,
  disabled: false,
  imgSrc: "",
  saveData: null,
  immediateLoading: false,
  hideInterface: false,
};

const paintCanvasScale = 0.75;
const defaultColor = "black";
const defaultRadius = 12;

const Paint = () => {
  const [chosenColor, setChosenColor] = useState<string>(defaultColor);
  const [radius, setRadius] = useState<number>(defaultRadius);

  const { browserWidth, browserHeight } = getWindowDimensions();

  // a bit less than the dialog dimensions
  const canvasWidth = Math.max(
    minWidth * paintCanvasScale,
    browserWidth * fullScreenDialogScale * paintCanvasScale,
  );
  const canvasHeight = Math.max(
    minHeight * paintCanvasScale,
    browserHeight *
      fullScreenDialogScale *
      (paintCanvasScale * paintCanvasScale),
  );

  // interpolate current dimensions
  const canvasProps = {
    ...paintDefaultProps,
    canvasWidth: canvasWidth,
    canvasHeight: canvasHeight,
    brushColor: chosenColor,
    brushRadius: radius,
  };

  return (
    <div className="paint-body">
      <div className="paint-controls">
        <PaintControls
          initialColor={defaultColor}
          initialRadius={defaultRadius}
          setCurrentColor={setChosenColor}
          setBrushSize={setRadius}
          paletteSize={15}
        />
      </div>
      <div className="paint-canvas">
        <CanvasDraw {...canvasProps} />
      </div>
    </div>
  );
};

export default PaintBody;
