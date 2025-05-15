import React, { lazy, Suspense } from "react";

import { setWindowMsg } from "./../home";
import TapLink from "../components/taplink";
import { LinkInfo } from "../../data";
import { dialogInfo, launchWindowFunc } from "./actions";

const linkLineHeight = 30;
const defaultMinWidth = 320;

interface ILinkWindow {
  setwMsg: setWindowMsg;
  links: LinkInfo[];
  title: string;
  minWidth?: number;
  minHeight?: number;
}

const Dialog = lazy(() => import("../components/dialog"));
export function LinkWindow(props: ILinkWindow): launchWindowFunc {
  const minWidth = props.minWidth ?? defaultMinWidth;
  // 40 is a buffer for the menu bar
  const minHeight = props.minHeight ?? 40 + props.links.length * linkLineHeight;
  return () => {
    const { x, y, dialogWidth, dialogHeight, windowId, closeWindow } =
      dialogInfo({
        size: {
          height: minHeight,
          width: minHeight,
        },
        setwMsg: props.setwMsg,
      });
    props.setwMsg({
      spawn: true,
      windowId: windowId,
      windowObj: (
        <Suspense fallback={null}>
          <Dialog
            /* average af the center - minWidth and center - windowWidth
             * seems to work well for this window size on both mobile/desktop */
            x={(x - minWidth + (x - dialogWidth / 2)) / 2}
            y={Math.max(y - minHeight, y - dialogHeight / 2)}
            width={dialogWidth}
            height={dialogHeight}
            minHeight={minHeight}
            minWidth={minWidth}
            UI={{
              title: props.title,
            }}
            windowId={windowId}
            hitCloseCallback={closeWindow}
          >
            <div className="linklist">
              {props.links.map((el: LinkInfo) => (
                <div key={el.name} title={el.tooltip}>
                  <span>
                    <TapLink
                      className="linklist-item"
                      href={el.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {el.name}
                    </TapLink>
                  </span>
                </div>
              ))}
            </div>
          </Dialog>
        </Suspense>
      ),
    });
  };
}
