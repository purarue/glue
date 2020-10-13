import React, { useState, Dispatch, SetStateAction, ChangeEvent } from "react";
import { setWindowMsg } from "./../home";
import {
  getWindowDimensions,
  jitterCenterLocation,
} from "./../components/dimensions";
import Dialog from "../components/dialog";
import { fullScreenDialogScale, launchWindowFunc } from "./actions";
import CanvasDraw from "react-canvas-draw";
// TODO isMobile from user agent, display disabled message

const minHeight = 400;
const minWidth = 300;

export function PaintWindow(setwMsg: setWindowMsg): launchWindowFunc {
  return () => {
    const { browserWidth, browserHeight } = getWindowDimensions();
    const { x, y } = jitterCenterLocation();
    const dialogWidth = browserWidth * fullScreenDialogScale;
    const dialogHeight = browserHeight * fullScreenDialogScale;
    const windowId = Date.now().toString();
    const dialogObj = (
      <>
        <Dialog
          x={x - dialogWidth / 2}
          y={y - dialogHeight / 2}
          width={dialogWidth}
          height={dialogHeight}
          title="paint"
          windowId={windowId}
          minHeight={minHeight}
          minWidth={minWidth}
          disableBodyDragging={true}
          // when close it hit, set the message to kill this window
          hitCloseCallback={() => setwMsg({ spawn: false, windowId: windowId })}
        >
          <Paint />
        </Dialog>
      </>
    );
    // when the icon is clicked, set the message to spawn this window
    setwMsg({
      spawn: true,
      windowId: windowId,
      windowObj: dialogObj,
    });
  };
}

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
    browserWidth * fullScreenDialogScale * paintCanvasScale
  );
  const canvasHeight = Math.max(
    minHeight * paintCanvasScale,
    browserHeight *
      fullScreenDialogScale *
      (paintCanvasScale * paintCanvasScale)
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
        />
      </div>
      <div className="paint-canvas">
        <CanvasDraw {...canvasProps} />
      </div>
    </div>
  );
};

function randomColor(): string {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

function randomColorArray(n: number): string[] {
  const randomColors = Array(n);
  for (let i = 0; i < n; i++) {
    randomColors[i] = randomColor();
  }
  return randomColors;
}

function isColor(strColor: string): boolean {
  if (strColor.startsWith("#")) {
    return true;
  }
  let s = new Option().style;
  s.color = strColor;
  return s.color == strColor;
}

interface IColorPicker {
  initialColor: string;
  initialRadius: number;
  setCurrentColor: Dispatch<SetStateAction<string>>;
  setBrushSize: Dispatch<SetStateAction<number>>;
  paletteSize?: number;
}

const PaintControls = ({
  initialColor,
  initialRadius,
  setCurrentColor,
  setBrushSize,
  paletteSize,
}: IColorPicker) => {
  let pSize = paletteSize ?? 10;

  const [chosenColor, setChosenColor] = useState<string>(initialColor);
  const [radius, setRadius] = useState<number>(initialRadius);
  const [error, setError] = useState<string | null>(null);
  const [colorPalette, setColorPalette] = useState<string[]>(
    randomColorArray(pSize)
  );

  return (
    <div className="color-picker">
      <div className="color-controls">
        <div className="color-input">
          <div
            className="selected-color palette-box"
            style={{
              backgroundColor: chosenColor,
            }}
          ></div>
          <input
            type="number"
            name="brush-size"
            value={radius}
            style={{
              maxWidth: 40,
            }}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const parsedVal: number = parseInt(e.target.value);
              if (isNaN(parsedVal)) {
                setError(`Could not convert ${e.target.value} to an number`);
              } else {
                setError(null);
                setBrushSize(parsedVal);
              }
              setRadius(isNaN(parsedVal) ? initialRadius : parsedVal);
            }}
          />
          <input
            type="text"
            name="color"
            value={chosenColor}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const candidateColor: string = e.target.value;
              setChosenColor(candidateColor); // so that the input field actually works
              if (!isColor(candidateColor)) {
                setError(`${candidateColor} is not a valid color`);
              } else {
                setError(null);
                setCurrentColor(candidateColor);
              }
            }}
          />
          <a
            href="#"
            className="input-go pixel unlinkify"
            onClick={() => {
              setColorPalette(randomColorArray(pSize));
              const newCol = randomColor();
              setChosenColor(newCol);
              setCurrentColor(newCol);
            }}
          >
            RANDOMIZE
          </a>
        </div>
        <span>{error ?? ""}</span>
      </div>
      <div className="color-palette">
        {colorPalette.map((palColor: string) => {
          return (
            <div
              key={palColor}
              className="palette-box"
              style={{
                backgroundColor: palColor,
              }}
              onClick={() => {
                setError(null);
                setChosenColor(palColor);
                setCurrentColor(palColor);
              }}
            ></div>
          );
        })}
      </div>
    </div>
  );
};