import React, { lazy, memo, Suspense } from "react";

import { setWindowMsg } from "./../home";
import { dialogInfo, launchWindowFunc } from "./actions";
import TapLink from "./../components/taplink";

const minHeight = 400;
const minWidth = 250;

const scale = 0.4;

export function DataWindow(setwMsg: setWindowMsg): launchWindowFunc {
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
            width={dialogWidth}
            height={dialogHeight}
            UI={{
              title: "data",
            }}
            windowId={windowId}
            minHeight={minHeight}
            minWidth={minWidth}
            hitCloseCallback={closeWindow}
          >
            <DataBody />
          </Dialog>
        </Suspense>
      ),
    });
  };
}

const DataBody = memo(() => {
  return (
    <div className="data-body">
      <p>
        For a while, I{"'"}ve been involved with writing{" "}
        <TapLink
          href="https://purarue.xyz/projects/"
          target="_blank"
          rel="noreferrer"
        >
          data exporters
        </TapLink>{" "}
        (saving and parsing data from applications and websites I use)
      </p>
      <p>
        My{" "}
        <TapLink
          href="https://github.com/purarue/HPI"
          target="_blank"
          rel="noreferrer"
        >
          HPI
        </TapLink>{" "}
        (Human Programming Interface) repository acts as a sort of entrypoint to
        all of my data, allowing me to do quick queries against data from old
        websites, tools, browser histories, etc.
      </p>
      <p>
        {`The 'Media Feed' here also heavily leans on HPI to get data from the many online media websites I use`}
      </p>
      <p>
        See{" "}
        <TapLink
          href="https://purarue.xyz/x/blog/ramblings-journal-art-technology/"
          target="_blank"
        >
          blog post
        </TapLink>{" "}
        for a reflection on a bit of how I think about using the tools/data.
      </p>
    </div>
  );
});
