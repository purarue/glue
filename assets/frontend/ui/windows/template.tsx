// this isn't used for any page, its the file I copy/paste when starting a new window
import React, { lazy, Suspense } from "react";

import { setWindowMsg } from "./../home";
import { dialogInfo, launchWindowFunc } from "./actions";

const height = 300;
const width = 250;

export function Window(setwMsg: setWindowMsg): launchWindowFunc {
  const Dialog = lazy(() => import("../components/dialog"));

  return () => {
    const { x, y, dialogWidth, dialogHeight, windowId, closeWindow } =
      dialogInfo({
        size: {
          height: height,
          width: height,
        },
        setwMsg,
      });
    setwMsg({
      spawn: true,
      windowId: windowId,
      windowObj: (
        <Suspense fallback={null}>
          <Dialog
            x={x - dialogWidth / 2}
            y={y - dialogHeight / 2}
            width={width}
            height={height}
            UI={{
              title: "title",
            }}
            windowId={windowId}
            minHeight={height - 100}
            minWidth={width - 100}
            hitCloseCallback={closeWindow}
          >
            <Body />
          </Dialog>
        </Suspense>
      ),
    });
  };
}

const Body = () => {
  return <>Body</>;
};
