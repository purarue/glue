import React, { lazy, Suspense } from "react";

import { setWindowMsg } from "./../home";
import { dialogInfo, fullScreenDialogScale, launchWindowFunc } from "./actions";

const minHeight = 400;
const minWidth = 300;

export function PaintWindow(setwMsg: setWindowMsg): launchWindowFunc {
  const Dialog = lazy(() => import("./../components/dialog"));
  const PaintBody = lazy(() => import("./paint_internal"));

  return () => {
    const { x, y, dialogWidth, dialogHeight, windowId, closeWindow } =
      dialogInfo({
        scale: fullScreenDialogScale,
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
