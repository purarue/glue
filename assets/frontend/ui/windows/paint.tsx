import React, { lazy, Suspense } from "react";

import { setWindowMsg } from "./../home";
import { dialogInfo, launchWindowFunc } from "./actions";
import { getWindowDimensions } from "../components/dimensions";

const minHeight = 400;
const minWidth = 300;

export function PaintWindow(setwMsg: setWindowMsg): launchWindowFunc {
  const Dialog = lazy(() => import("./../components/dialog"));
  const PaintBody = lazy(() => import("./paint_internal"));

  return () => {
    const { browserHeight, browserWidth } = getWindowDimensions();
    const { x, y, dialogWidth, dialogHeight, windowId, closeWindow } =
      dialogInfo({
        size: {
          height: browserHeight * 0.75,
          width: browserWidth * 0.75,
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
            width={dialogWidth}
            height={dialogHeight}
            UI={{
              title: "paint",
            }}
            windowId={windowId}
            minHeight={minHeight}
            minWidth={minWidth}
            disableBodyDragging={true}
            hitCloseCallback={closeWindow}
          >
            <PaintBody />
          </Dialog>
        </Suspense>
      ),
    });
  };
}
