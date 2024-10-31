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
      dialogInfo(
        scale,
        {
          height: minHeight,
          width: minWidth,
        },
        setwMsg,
      );
    const dialogObj = (
      <>
        <Dialog
          noCenter={true}
          x={x - dialogWidth / 2}
          y={y - dialogHeight / 2}
          width={dialogWidth}
          height={dialogHeight}
          title="Code"
          windowId={windowId}
          minHeight={minHeight}
          minWidth={minWidth}
          hitCloseCallback={closeWindow}
        >
          <CodeBody setwMsg={setwMsg} />
        </Dialog>
      </>
    );
    // when the icon is clicked, set the message to spawn this window
    setwMsg({
      spawn: true,
      windowId: windowId,
      windowObj: dialogObj,
    });
  };
}

const CodeBody = ({ setwMsg }: { setwMsg: setWindowMsg }) => {
  return (
    <AppWindow
      setwMsg={setwMsg}
      icons={[
        {
          name: "Projects",
          url: "https://purarue.xyz/projects",
          icon: "/images/frontend/laptop.png",
        },
        {
          name: "Data",
          icon: "/images/frontend/barchart.png",
        },
        {
          name: "Dotfiles",
          icon: "/images/frontend/dotfiles.png",
          url: "https://github.com/purarue/dotfiles",
        },
        {
          name: "Tools",
          icon: "/images/frontend/gear.png",
          url: "https://purarue.xyz/x/notes/tools/",
        },
      ]}
    />
  );
};
