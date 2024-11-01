import React from "react";

import { setWindowMsg } from "./../home";
import Dialog from "../components/dialog";
import { dialogInfo, launchWindowFunc } from "./actions";
import { AppWindow } from "./folder";

const minHeight = 275;
const minWidth = 325;

const scale = 0.36;

export function CodeWindow(setwMsg: setWindowMsg): launchWindowFunc {
  return () => {
    const { x, y, dialogWidth, dialogHeight, windowId, closeWindow } =
      dialogInfo({
        scale: scale,
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
          x={x - dialogWidth / 2}
          y={y - dialogHeight / 2}
          width={dialogWidth}
          height={dialogHeight}
          UI={{
            title: "code",
            noCenter: true,
          }}
          windowId={windowId}
          minHeight={minHeight}
          minWidth={minWidth}
          hitCloseCallback={closeWindow}
        >
          <CodeBody setwMsg={setwMsg} />
        </Dialog>
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
