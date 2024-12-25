import React, { lazy, Suspense } from "react";

import { setWindowMsg } from "./../home";
import { dialogInfo, launchWindowFunc } from "./actions";
import { AppWindow } from "./folder";

const height = 275;
const width = 325;

export function CodeWindow(setwMsg: setWindowMsg): launchWindowFunc {
  const Dialog = lazy(() => import("../components/dialog"));

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
            x={x - dialogWidth / 2}
            y={y - dialogHeight / 2}
            width={dialogWidth}
            height={dialogHeight}
            UI={{
              title: "code",
              noCenter: true,
            }}
            windowId={windowId}
            minHeight={height}
            minWidth={width}
            hitCloseCallback={closeWindow}
          >
            <CodeBody setwMsg={setwMsg} />
          </Dialog>
        </Suspense>
      ),
    });
  };
}

const CodeBody = ({ setwMsg }: { setwMsg: setWindowMsg }) => {
  return (
    <AppWindow
      setwMsg={setwMsg}
      icons={[
        {
          name: "projects",
          url: "https://purarue.xyz/projects",
          icon: "/images/frontend/laptop.png",
        },
        {
          name: "data",
          icon: "/images/frontend/barchart.png",
        },
        {
          name: "dotfiles",
          icon: "/images/frontend/dotfiles.png",
          url: "https://github.com/purarue/dotfiles",
        },
        {
          name: "tools",
          icon: "/images/frontend/gear.png",
          url: "https://purarue.xyz/x/notes/tools/",
        },
      ]}
    />
  );
};
