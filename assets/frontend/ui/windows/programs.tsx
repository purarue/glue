import React, { lazy, Suspense } from "react";

import { setWindowMsg } from "./../home";
import { dialogInfo, launchWindowFunc } from "./actions";
import { AppWindow } from "./folder";

const minHeight = 275;
const minWidth = 325;

export function ProgramWindow(setwMsg: setWindowMsg): launchWindowFunc {
  const Dialog = lazy(() => import("../components/dialog"));

  return () => {
    const { x, y, dialogWidth, dialogHeight, windowId, closeWindow } =
      dialogInfo({
        size: {
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
            x={x - dialogWidth / 2}
            y={y - dialogHeight / 2}
            width={dialogWidth}
            height={dialogHeight}
            UI={{
              noCenter: true,
              title: "programs",
            }}
            windowId={windowId}
            minHeight={minHeight}
            minWidth={minWidth}
            hitCloseCallback={closeWindow}
          >
            <AppBody setwMsg={setwMsg} />
          </Dialog>
        </Suspense>
      ),
    });
  };
}

const AppBody = ({ setwMsg }: { setwMsg: setWindowMsg }) => {
  return (
    <AppWindow
      setwMsg={setwMsg}
      icons={[
        {
          name: "browser",
          icon: "/images/frontend/globe.png",
        },
        {
          name: "textedit",
          icon: "/images/frontend/texteditor.png",
        },
        {
          name: "paint",
          icon: "/images/frontend/paint.png",
        },
        {
          name: "customize",
          icon: "/images/frontend/hammer_wrench.png",
        },
      ]}
    />
  );
};
