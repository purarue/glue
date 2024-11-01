// this isn't used for any page, its the file I copy/paste when starting a new window
import React from "react";

import { setWindowMsg } from "./../home";
import Dialog from "../components/dialog";
import { dialogInfo, launchWindowFunc } from "./../windows/actions";

const minHeight = 100;
const minWidth = 100;

export function Clock(setwMsg: setWindowMsg): launchWindowFunc {
  return () => {
    const { browserWidth, windowId, closeWindow } = dialogInfo({
      minSize: {
        height: minHeight,
        width: minHeight,
      },
      setwMsg,
    });
    setwMsg({
      spawn: true,
      windowId: windowId,
      windowObj: (
        <Dialog
          // spawn in the top right corner
          x={browserWidth - minWidth - 50}
          y={30}
          width={minWidth}
          height={minHeight}
          windowId={windowId}
          minHeight={minHeight}
          minWidth={minWidth}
          hitCloseCallback={closeWindow}
        >
          <ClockBody />
        </Dialog>
      ),
    });
  };
}

// want to render something that looks pixelated,
// maybe split it into a grid and then do some
// math to render clock hands nicely?

const ClockBody = () => {
  return (
    <div
      style={{
        width: minWidth,
        height: minHeight,
        border: "3px solid red",
      }}
    >
      CLOCK
    </div>
  );
};
