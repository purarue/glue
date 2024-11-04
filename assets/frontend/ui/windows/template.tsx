// this isn't used for any page, its the file I copy/paste when starting a new window
import React, { lazy, Suspense } from "react";

import { setWindowMsg } from "./../home";
import { dialogInfo, launchWindowFunc } from "./actions";

const minHeight = 150;
const minWidth = 250;

const scale = 0.5;

export function Window(setwMsg: setWindowMsg): launchWindowFunc {
  const Dialog = lazy(() => import("../components/dialog"));

  return () => {
    const { x, y, dialogWidth, dialogHeight, windowId, closeWindow } =
      dialogInfo({
        scale: scale,
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
        <Suspense fallback={null}>
          <Dialog
            x={x - dialogWidth / 2}
            y={y - dialogHeight / 2}
            width={minWidth}
            height={minHeight}
            UI={{
              title: "title",
            }}
            windowId={windowId}
            minHeight={minHeight}
            minWidth={minWidth}
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
