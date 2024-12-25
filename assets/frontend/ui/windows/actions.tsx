import { CubingWindow } from "./cubing";
import { MediaAccountsWindow } from "./media_accounts";
import { MiscWindow } from "./misc";
import { BrowserWindow } from "./browser";
import { TextEditorWindow } from "./texteditor";
import { PaintWindow } from "./paint";
import { CustomizeWindow } from "./customize";
import { ReadmeWindow } from "./readme";
import { GuestBookWindow } from "./guestbook";
import { VirusWindow } from "./virus";
import { LinkInfo } from "../../data";
import { setWindowMsg } from "./../home";
import { DataWindow } from "./data";
import { CodeWindow } from "./code";
import { WritingWindow } from "./writing";
import { ProgramWindow } from "./programs";
import {
  getWindowDimensions,
  jitterCenterLocation,
} from "../components/dimensions";

// pass it the setWindowMsg function, it returns a function which opens
// the window, and returns nothing
export type launchWindowFunc = () => void;

// type of functions which create functions which virtual windows (Paint/Cubing)
export type createsLaunchWindowFunc = (
  setwMsg: setWindowMsg,
) => launchWindowFunc;

// interface to define what happens when the user clicks on things

// custom pages implemented in react
interface IHashActionFunc {
  // weird that page is needed here
  // returns a function, which when passed the function to update
  // the setWindowMsg state, returns a launchWindowFunc (a
  // function which when called, launches a virtual dialog/window)
  [page: string]: createsLaunchWindowFunc;
}

// dont do 100% because of the margin on the home page
// 75% is of window height/width, not surrounding container
export const fullScreenDialogScale = 0.75;

// create a closure around the state. could probably also
// be done with useContext, but this works
//
// returns a function which receives the message interface
// as an argument,  which returns the function that launches this onClick
// action (open the dialog, does something on the page)
export const actions: IHashActionFunc = {
  readme: ReadmeWindow,
  cubing: CubingWindow,
  "media accts": MediaAccountsWindow,
  data: DataWindow,
  misc: MiscWindow,
  browser: BrowserWindow,
  "code📁": CodeWindow,
  "writing📁": WritingWindow,
  "programs📁": ProgramWindow,
  textedit: TextEditorWindow,
  paint: PaintWindow,
  customize: CustomizeWindow,
  "guest book": GuestBookWindow,
  not_a_virus: VirusWindow,
};

// returns what this icon does when its clicked
// see ../components/desktop_icon.tsx for what this can
// return. It either returns a function which launches the
// virtual window, or a string, which is the URL to create
// a link element from
export function getAction(
  el: LinkInfo,
  setwMsg: setWindowMsg,
): string | launchWindowFunc {
  const action: createsLaunchWindowFunc = actions[el.name];
  if (action !== undefined) {
    // create the closure so that actions have
    // access to the set window message functions
    return action(setwMsg);
  } else if (el.url !== undefined && el.url !== "") {
    return el.url;
  }
  return () =>
    window.alert("No URL or action defined for " + JSON.stringify(el));
}

interface Size {
  width: number;
  height: number;
}

export interface DialogInfo {
  browserHeight: number;
  browserWidth: number;
  x: number;
  y: number;
  dialogHeight: number;
  dialogWidth: number;
  windowId: string;
  closeWindow: () => void;
}

export function dialogInfo({
  size: minSize,
  setwMsg,
}: {
  size: Size;
  setwMsg: setWindowMsg;
}): DialogInfo {
  const { x, y } = jitterCenterLocation();
  const { browserHeight, browserWidth } = getWindowDimensions();
  const dialogWidth = minSize.width;
  const dialogHeight = minSize.height;
  const windowId = Date.now().toString();
  return {
    x,
    y,
    dialogWidth,
    dialogHeight,
    browserHeight,
    browserWidth,
    windowId,
    closeWindow: () => setwMsg({ spawn: false, windowId: windowId }),
  };
}
