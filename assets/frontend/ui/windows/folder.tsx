import React, { useState } from "react";
import { LinkInfo } from "../../data";
import { setWindowMsg } from "../home";
import { getAction, launchWindowFunc } from "./actions";
import clsx from "clsx";
import DesktopIcon from "../components/desktop_icon";

interface IAppWindow {
  icons: LinkInfo[];
  setwMsg: setWindowMsg;
}

export const AppWindow = (props: IAppWindow) => {
  // what icon the user currently has clicked/highlighted
  // use the icon caption as the key
  const [selectedIcon, setSelectedIcon] = useState("");

  return (
    <>
      <div className="icon-container dialog-icon-container">
        {props.icons.map((el) => {
          const action: string | launchWindowFunc = getAction(
            el,
            props.setwMsg,
          );
          const isURL: boolean =
            typeof action === "string" || action instanceof String;
          return (
            <div
              key={el.name}
              className={clsx(
                "home-icon",
                selectedIcon == el.name && "selected",
              )}
            >
              <DesktopIcon
                url={isURL ? (action as string) : undefined}
                click={!isURL ? (action as launchWindowFunc) : undefined}
                mouseEnter={() => setSelectedIcon(el.name)}
                mouseLeave={() => setSelectedIcon("")} // set to empty string, which means nothing is highlighted
                caption={el.name}
                iconurl={el.icon ?? "/favicon.ico"}
              />
            </div>
          );
        })}
      </div>
    </>
  );
};
