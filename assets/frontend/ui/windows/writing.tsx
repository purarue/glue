import React, { lazy, Suspense } from "react";

import { setWindowMsg } from "./../home";
import { dialogInfo, launchWindowFunc } from "./actions";
import { AppWindow } from "./folder";

const height = 180;
const width = 300;

const Dialog = lazy(() => import("../components/dialog"));
export function WritingWindow(setwMsg: setWindowMsg): launchWindowFunc {
  return () => {
    const { x, y, dialogWidth, dialogHeight, windowId, closeWindow } =
      dialogInfo({
        size: {
          height: height,
          width: width,
        },
        setwMsg,
      });
    setwMsg({
      spawn: true,
      windowId: windowId,
      windowObj: (
        <Suspense fallback={null}>
          <Dialog
            UI={{
              noCenter: true,
              title: "writing",
            }}
            x={x - dialogWidth / 2}
            y={y - dialogHeight / 2}
            width={dialogWidth}
            height={dialogHeight}
            windowId={windowId}
            minHeight={height - 30}
            minWidth={width - 30}
            hitCloseCallback={closeWindow}
          >
            <WritingBody setwMsg={setwMsg} />
          </Dialog>
        </Suspense>
      ),
    });
  };
}

const WritingBody = ({ setwMsg }: { setwMsg: setWindowMsg }) => {
  return (
    <AppWindow
      setwMsg={setwMsg}
      icons={[
        {
          name: "blog",
          url: "https://purarue.xyz/x/blog/",
          icon: "/images/frontend/feather.png",
        },
        {
          name: "notes",
          url: "https://purarue.xyz/x/",
          icon: "/images/frontend/brain.png",
        },
      ]}
    />
  );
};
