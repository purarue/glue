import React, {
  useEffect,
  Dispatch,
  SetStateAction,
  useState,
  useRef,
  lazy,
  Suspense,
} from "react";
import clsx from "clsx";

import { Context, AppContextConsumer } from "../app_provider";
import { PageHits } from "../api_model";
import DesktopIcon from "./components/desktop_icon";
import TapLink from "./components/taplink";
import { getAction, launchWindowFunc } from "./windows/actions";
import { IconData } from "../data";
import { getWindowDimensions } from "./components/dimensions";
import { ok } from "../utils";
import { hash } from "../build";
import { AUTOLAUNCH_WIDGETS } from "./widgets/launch";

// represents the current windows on the screen
// windowId is epoch time/some unique integer
// as a string
interface IWindowMap {
  [windowId: string]: any;
}

// start with no windows
const windowDefault: IWindowMap = {};
export type setWindowFunc = Dispatch<SetStateAction<IWindowMap>>;

// represents a message from an icon to the state
// these messages cause windows to spawn/kill(close)
interface _windowMsg {
  spawn: boolean; // opposite of spawn is kill, removes the windowId
  windowId: string;
  windowObj?: any;
}

type windowMsg = _windowMsg | undefined;
const windowMsgDefault: windowMsg = undefined;
export type setWindowMsg = Dispatch<SetStateAction<windowMsg>>;

function removeWindow(
  windows: IWindowMap,
  excludeWindowId: string,
): IWindowMap {
  const newWindows: IWindowMap = {};
  Object.keys(windows).forEach((wId) => {
    if (wId !== excludeWindowId) {
      newWindows[wId] = windows[wId];
    }
  });
  return newWindows;
}

// rectangles the user can draw on the screen
interface _draggedRect {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  browserWidth: number;
  browserHeight: number;
}
type draggedRect = _draggedRect | undefined;
const draggedRectDefault = undefined;
const dragBuffer = 3; // to make sure nothing weird happens with scrollbar, keep a small buffer

const desktopRenderTick = 60;

// increment the state for which icons should be shown
function renderDesktopIconFrame(
  currentFrame: number,
  frameCount: number,
  setLoadingFunc: Dispatch<SetStateAction<number>>,
): void {
  // there are desktop icons to render
  if (currentFrame < frameCount) {
    setLoadingFunc((oldFrame) => {
      return oldFrame + 1;
    });
    setTimeout(() => {
      renderDesktopIconFrame(currentFrame + 1, frameCount, setLoadingFunc);
    }, desktopRenderTick);
  }
}

const Geocities = () => {
  // a hidden icon (easter egg) which when clicked takes you to my old site
  //
  // every minute or so, show the image for a second
  // if hovering, always show the image
  const [timerShow, setTimerShow] = useState(false);
  const [hovering, setHovering] = useState(false);

  const scheduleLoop = () => {
    // some amount of MS between 15 and 45 seconds
    const ms = (30 * Math.random() + 15) * 1000;
    setTimeout(() => {
      setTimerShow(true);
      setTimeout(() => {
        setTimerShow(false);
        scheduleLoop();
      }, 4000);
    }, ms);
  };

  useEffect(() => {
    scheduleLoop();
  }, []);

  return (
    <TapLink
      aria-label="link to old geocities website"
      href="https://purarue.xyz/geocities/"
      className="menu-toolbar-item menu-bar-item unlinkify geocities"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <img
        src="/images/frontend/geocities.gif"
        alt="geocities"
        width="3rem"
        style={{
          display: hovering || timerShow ? "inline-block" : "none",
        }}
      />
    </TapLink>
  );
};

const CurrentlyListeningRender = (props: { enabled: boolean }) => {
  if (props.enabled === true) {
    const Render = lazy(() => import("../currently_listening"));
    return (
      <Suspense fallback={null}>
        <Render />
      </Suspense>
    );
  }

  return null;
};

function Home() {
  // currently displayed floating windows
  const [guiWindows, setWindows] = useState(windowDefault);

  // state which acts sort of like a message interface for spawning/killing gui windows
  // this is needed because the getAction defines a closure, so it doesn't
  // have access to the current state of gui windows is
  // when windows are created, they set themself here, and then are
  // added using setWindows in this scope. If they're to be killed, they
  // add the object with spawn: false; and they're filtered out of the window list
  const [wMsg, setwMsg]: [windowMsg, setWindowMsg] = useState(windowMsgDefault);

  // what icon the user currently has clicked/highlighted
  // use the icon caption as the key
  const [selectedIcon, setSelectedIcon] = useState("");

  // animate icons appearing on screen
  const [loading, setLoading] = useState<number>(0);

  // start animating desktop icons when this loads
  useEffect(() => {
    renderDesktopIconFrame(loading, IconData.length, setLoading);
  }, []);

  const launchWidgets = useRef<boolean | undefined>(undefined);

  useEffect(() => {
    // they've already been launched
    if (launchWidgets.current === false) {
      return;
    }

    // once all the icons have loaded, then launch widgets
    if (loading >= IconData.length) {
      launchWidgets.current = false;

      // launch widgets, with some time between
      // TODO: maybe jitter
      AUTOLAUNCH_WIDGETS.forEach((w, i) => {
        setTimeout(
          () => {
            w(setwMsg)();
          },
          (i + 1) * 300,
        );
      });
    }
  }, [launchWidgets.current, loading]);

  // handle window spawn/kill
  useEffect(() => {
    // if we have a new message (spawn/kill window), do something with it
    if (wMsg !== undefined) {
      // if we have a window to spawn
      if (wMsg!.spawn) {
        setWindows({
          ...guiWindows,
          // [] interpolates the value as the keyname
          [wMsg!.windowId]: wMsg.windowObj!,
        });
      } else {
        // we have a window to kill
        setWindows(removeWindow(guiWindows, wMsg!.windowId));
      }
      setwMsg(undefined);
    }
  }, [wMsg]); // only call the useEffect hook when wMsg changes

  // let the user draw rectangles on the desktop
  const [dragRect, setDragRect] = useState<draggedRect>(draggedRectDefault);

  const createRect = (x: number, y: number) => {
    const { browserHeight, browserWidth } = getWindowDimensions();
    setDragRect({
      x1: x,
      x2: x,
      y1: y,
      y2: y,
      browserHeight: browserHeight,
      browserWidth: browserWidth,
    });
  };

  const updateRect = (x: number, y: number) => {
    // bounds checking
    if (x > dragRect!.browserWidth) {
      x = dragRect!.browserWidth - 3;
    } else if (x <= 0) {
      x = dragBuffer;
    }
    if (y > dragRect!.browserHeight) {
      y = dragRect!.browserHeight - 3;
    } else if (y <= 0) {
      y = dragBuffer;
    }
    setDragRect({
      ...dragRect!,
      x2: x,
      y2: y,
    });
  };

  const deleteRect = () => {
    setDragRect(undefined);
  };

  // TODO: [low priority] on resize, 'update'? somehow the dialogs; so that if its off the page, it resnaps/moves to the current viewport
  return (
    <>
      <div id="menu-bar">
        <TapLink
          href="/"
          id="site-title"
          className="menu-toolbar-item menu-bar-item unlinkify pixel-large"
        >
          <h1>purarue</h1>
        </TapLink>
        <Geocities />
        <HeaderRight />
      </div>
      <div id="window-body">
        <div id="desktop-body">
          <div
            id="home-icons-window-wrapper"
            // capture events for drawing the rectangle
            onMouseDown={(event) => {
              createRect(event.clientX, event.clientY);
            }}
            onMouseMove={(event) => {
              if (dragRect !== undefined) {
                updateRect(event.clientX, event.clientY);
              }
            }}
            onMouseUp={deleteRect}
            onMouseLeave={deleteRect}
          >
            {/* dialog/windows */}
            <div id="floating-windows">
              {Object.keys(guiWindows).map((wid) => (
                <div key={wid.toString()}>{guiWindows[wid]}</div>
              ))}
            </div>
            {dragRect !== undefined ? <DragRect {...dragRect} /> : <></>}
            <div id="home-icons-container" className="icon-container">
              {IconData.map((el, i) => {
                const action: string | launchWindowFunc = getAction(
                  el,
                  setwMsg,
                );
                const isURL: boolean =
                  typeof action === "string" || action instanceof String;
                return (
                  <div
                    key={el.name}
                    className={clsx(
                      "home-icon",
                      selectedIcon == el.name && "selected",
                      i >= loading && "home-icon-hide",
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
            <OSVersion />
          </div>
        </div>
      </div>
      <CurrentlyListeningRender enabled={loading >= IconData.length} />
    </>
  );
}

const DragRect = React.memo((props: _draggedRect) => {
  // by default, assume the user dragged down and to the right
  let topLeftX: number = props.x1;
  let topLeftY: number = props.y1;
  let height: number = props.y2 - props.y1;
  let width: number = props.x2 - props.x1;
  // if the user dragged left, x2 > x1
  if (props.x1 >= props.x2) {
    topLeftX = props.x2;
    width = props.x1 - props.x2;
  }
  // if user dragged up
  if (props.y1 >= props.y2) {
    topLeftY = props.y2;
    height = props.y1 - props.y2;
  }
  return (
    <div
      id="draggable-rect"
      style={{
        top: topLeftY,
        left: topLeftX,
        height: height,
        width: width,
      }}
    >
      <div className="draggable-rect-body"></div>
    </div>
  );
});

const HeaderRight = () => {
  return (
    <AppContextConsumer>
      {(value: Context) => {
        let hits: number = 0;
        if (ok(value.pageHits)) {
          hits = (value.pageHits as PageHits).count;
        }
        return (
          <div id="menu-right">
            <PageHitRender count={hits} />
          </div>
        );
      }}
    </AppContextConsumer>
  );
};

interface IPageHitRender {
  count: number;
}

const PageHitRender = React.memo(({ count }: IPageHitRender) => {
  return (
    <>
      <div className="page-hit-title">page hits:</div>
      {count
        .toString()
        .split("")
        .map((n: string, i: number) => {
          return (
            <div key={i} className="page-hit-box">
              {n}
            </div>
          );
        })}
    </>
  );
});

const OSVersion = React.memo(() => {
  const [hoveringImage, setHoveringImage] = useState(false);
  const [imageUrl, setImageUrl] = useState("/image/frontend/source-0.png");

  useEffect(() => {
    if (hoveringImage) {
      setImageUrl("/images/frontend/source.gif");
    } else {
      setImageUrl("/images/frontend/source-0.png");
    }
  }, [hoveringImage]);

  return (
    <span id="os-version">
      <div>purarue OS Build {hash}</div>
      <div
        className="save-icon"
        onMouseEnter={() => setHoveringImage(true)}
        onMouseLeave={() => setHoveringImage(false)}
      >
        <a href="https://github.com/purarue/glue" target="_blank">
          <img src={imageUrl} alt="source code" />
        </a>
      </div>
    </span>
  );
});

export default Home;
