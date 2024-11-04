import React, {
  ChangeEvent,
  Dispatch,
  lazy,
  SetStateAction,
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";

import { setWindowMsg } from "./../home";
import { dialogInfo, launchWindowFunc } from "./actions";
import {
  Context,
  AppContextConsumer,
  setBackgroundColor,
} from "../../app_provider";
import { isColor, randomColorArray } from "../../color";

const minHeight = 220;
const minWidth = 400;

interface IColorPicker {
  initialColor: string;
  initialRadius?: number;
  setCurrentColor: Dispatch<SetStateAction<string>>;
  setBrushSize?: Dispatch<SetStateAction<number>>;
  paletteSize?: number;
}

// Also used in the customize window

const defaultRadius = 12;

export const PaintControls = ({
  initialColor,
  initialRadius,
  setCurrentColor,
  setBrushSize,
  paletteSize,
}: IColorPicker) => {
  let pSize = paletteSize ?? 10;

  const [chosenColor, setChosenColor] = useState<string>(initialColor);
  const [radius, setRadius] = useState<number>(initialRadius ?? defaultRadius);
  const [error, setError] = useState<string | null>(null);
  const [colorPalette, setColorPalette] = useState<string[]>(
    randomColorArray(pSize),
  );

  const colorRef = useRef<HTMLInputElement>(null);

  const handleRandomizeButton = () => {
    const newArr = randomColorArray(pSize);
    setColorPalette(newArr);
    // pick one of the random colors from the new palette
    const newCol = newArr[Math.floor(Math.random() * pSize)];
    setChosenColor(newCol);
    setCurrentColor(newCol);
  };

  const handleColorChange = (toColor: string) => {
    setError(null);
    setChosenColor(toColor);
    setCurrentColor(toColor);
  };

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
          {initialRadius !== undefined && (
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
                  if (setBrushSize) {
                    setBrushSize(parsedVal);
                  }
                }
                setRadius(isNaN(parsedVal) ? initialRadius : parsedVal);
              }}
            />
          )}
          <input
            ref={colorRef}
            type="text"
            name="color"
            value={chosenColor}
            onTouchEnd={() => colorRef.current!.focus()}
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
            onClick={handleRandomizeButton}
            onTouchEnd={handleRandomizeButton}
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
              onClick={() => handleColorChange(palColor)}
              onTouchEnd={() => handleColorChange(palColor)}
            ></div>
          );
        })}
      </div>
    </div>
  );
};

export function CustomizeWindow(setwMsg: setWindowMsg): launchWindowFunc {
  const Dialog = lazy(() => import("../components/dialog"));

  return () => {
    const { x, y, windowId, closeWindow } = dialogInfo({
      scale: 1.0,
      minSize: {
        height: minHeight,
        width: minWidth,
      },
      setwMsg,
    });
    setwMsg({
      spawn: true,
      windowId: windowId,
      windowObj: (
        <Suspense fallback={null}>
          <Dialog
            x={x - minWidth / 2}
            y={y - minHeight / 2}
            width={minWidth}
            height={minHeight}
            UI={{
              title: "customize",
            }}
            windowId={windowId}
            minHeight={minHeight}
            minWidth={minWidth}
            hitCloseCallback={closeWindow}
          >
            <AppContextConsumer>
              {(value: Context) => {
                return <CustomizeBody ctx={value} />;
              }}
            </AppContextConsumer>
          </Dialog>
        </Suspense>
      ),
    });
  };
}

interface ICustomizeBody {
  ctx: Context;
}

const CustomizeBody = ({ ctx }: ICustomizeBody) => {
  const [bgColor, setBgColor] = useState<string>(ctx.backgroundColor);

  // when setBgColor is called from the PaintControls
  // set the global background color
  useEffect(() => {
    // if this isn't a color and is an empty string, the global app
    // context is set, but since there's a higher div with a fallback
    // color as the default, still looks like everything works
    setBackgroundColor(ctx.setContext, bgColor);
  }, [bgColor]);

  return (
    <div className="customize-body">
      <div className="description">Set the background color!</div>
      <PaintControls
        initialColor={ctx.backgroundColor}
        setCurrentColor={setBgColor}
      />
    </div>
  );
};
