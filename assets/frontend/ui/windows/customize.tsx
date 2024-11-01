import React, { useEffect, useState } from "react";

import { setWindowMsg } from "./../home";
import Dialog from "../components/dialog";
import { dialogInfo, launchWindowFunc } from "./actions";
import { PaintControls } from "./paint";
import {
  Context,
  AppContextConsumer,
  setBackgroundColor,
} from "../../app_provider";

const minHeight = 220;
const minWidth = 400;

export function CustomizeWindow(setwMsg: setWindowMsg): launchWindowFunc {
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
