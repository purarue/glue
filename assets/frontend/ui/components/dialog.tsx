import React, {
  useState,
  useRef,
  useEffect,
  SetStateAction,
  Dispatch,
} from "react";
import clsx from "clsx";
import Repeatable from "react-repeatable";
import { Rnd } from "react-rnd";

import {
  AppContextConsumer,
  setSelectedWindow,
  Context,
} from "../../app_provider";

interface windowData {
  height: number;
  width: number;
  // size of the entire scrollable element
  fullY: number;
}

// hides parts of the dialog while they're animating/opening
interface windowParts {
  showBackground: boolean;
  showMenuBar: boolean;
  showBody: boolean;
  showExitButton: boolean;
  showScrollButtons: boolean;
}

const windowPartsDefault = {
  showBackground: false,
  showMenuBar: false,
  showBody: false,
  showExitButton: false,
  showScrollButtons: false,
};

interface UIWIndowProps {
  errorDialog: boolean;
  title?: any;
  dialogWidth: number;
  dialogHeight: number;
  disableBodyDragging: boolean;
  winData: windowData;
  scrollOffset: number;
  setScrollOffset: Dispatch<SetStateAction<number>>;
  setDragDisable: Dispatch<SetStateAction<boolean>>;
  setSelfSelectedCtx: () => void;
  hitCloseCallback: () => void;
  handleEnableRND: () => void;
  handleDisableRND: () => void;
  handleScrollUp: () => void;
  handleScrollDown: () => void;
  scrollRef: any;
  noCenter: boolean;
  msg: string | undefined;
  children: any | undefined;
}

const UIWindow = (props: UIWIndowProps) => {
  // animate windows
  const [winShow, setWinShow] = useState<windowParts>(windowPartsDefault);

  // do some setTimeOuts to load the menu bar/dialog body
  const showWindowParts = () => {
    setTimeout(() => {
      setWinShow((old: windowParts) => {
        return {
          ...old,
          showBackground: true,
        };
      });
      setTimeout(() => {
        setWinShow((old: windowParts) => {
          return {
            ...old,
            showMenuBar: true,
          };
        });
        setTimeout(() => {
          setWinShow((old: windowParts) => {
            return {
              ...old,
              showBody: true,
            };
          });
          setWinShow((old: windowParts) => {
            return {
              ...old,
              showExitButton: true,
            };
          });
          setWinShow((old: windowParts) => {
            return {
              ...old,
              showScrollButtons: true,
            };
          });
        }, 200);
      }, 200);
    }, 100);
  };

  useEffect(() => {
    // start animation for diffierent parts of the window
    showWindowParts();
  }, []);

  return (
    <div className={clsx("dialog", props.errorDialog && "error")}>
      <div
        className={clsx(
          "dialog-loading-container",
          winShow.showBackground || "dialog-part-hidden",
        )}
      >
        <div
          className={clsx(
            "dialog-menu-bar-container",
            winShow.showMenuBar || "dialog-part-hidden",
          )}
        >
          <div
            className={clsx(
              "dialog-menu-button dialog-exit-button",
              winShow.showExitButton || "dialog-part-hidden",
            )}
            role="button"
            onClick={props.hitCloseCallback}
            onTouchEnd={props.hitCloseCallback} // also close on touch events
            onMouseEnter={props.handleDisableRND}
            onMouseLeave={props.handleEnableRND}
          >
            <span>×</span>
          </div>
          {props.title}
          <div
            className={clsx(
              "dialog-menu-button dialog-up-button",
              winShow.showScrollButtons || "dialog-part-hidden",
            )}
            onTouchStart={props.handleDisableRND} // disable dragging when user starts touching
            onTouchEnd={() => {
              props.handleEnableRND();
              props.handleScrollUp(); // scroll on touch end, else you have to do weird double clicks
            }}
            onMouseEnter={props.handleDisableRND}
            onMouseLeave={props.handleEnableRND}
            onClick={props.handleScrollUp}
          >
            <Repeatable
              tag="button"
              type="button"
              repeatInterval={100}
              repeatCount={9999}
              onHold={props.handleScrollUp}
            >
              ▲
            </Repeatable>
          </div>
          <div
            className={clsx(
              "dialog-menu-button dialog-down-button",
              winShow.showScrollButtons || "dialog-part-hidden",
            )}
            onTouchStart={props.handleDisableRND}
            onTouchEnd={() => {
              props.handleEnableRND();
              props.handleScrollDown();
            }}
            onMouseEnter={props.handleDisableRND}
            onMouseLeave={props.handleEnableRND}
            onClick={props.handleScrollDown}
          >
            <Repeatable
              tag="button"
              type="button"
              repeatInterval={100}
              repeatCount={9999}
              onHold={props.handleScrollDown}
            >
              ▼
            </Repeatable>
          </div>
        </div>
        <div
          ref={props.scrollRef}
          className={clsx(
            "dialog-body",
            props.msg !== undefined && "dialog-message",
            winShow.showBody || "dialog-part-hidden",
            props.noCenter && "dialog-no-center",
          )}
          onWheel={(e) => {
            // console.log(e);
            e.preventDefault();
            let targetScrollHeight: number = props.scrollOffset + e.deltaY;
            // console.log(targetScrollHeight);

            // make sure this is within bounds, else default
            if (targetScrollHeight < 0) {
              targetScrollHeight = 0;
              // console.log("targetScrollHeight < 0");
            } else {
              const maxScrollHeight =
                props.winData.fullY - props.winData.height;
              if (targetScrollHeight > maxScrollHeight) {
                targetScrollHeight = maxScrollHeight;
                // console.log("targetScrollHeight > maxScrollHeight");
              }
            }
            // console.log("scrolling", targetScrollHeight);
            props.scrollRef.current.scrollTo({ top: targetScrollHeight });
            props.setScrollOffset(targetScrollHeight);
          }}
          // for elements that want it, disable/enable
          // dragging on the body when hovered
          onMouseEnter={() => {
            props.setDragDisable(props.disableBodyDragging);
          }}
          onClick={() => {
            props.setDragDisable(props.disableBodyDragging);
          }}
          onMouseLeave={props.handleEnableRND}
        >
          {
            // if the user provided a message, render it *and* the children
            props.msg !== undefined ? (
              <>
                {props.msg}
                {props.children}
              </>
            ) : (
              // else just render the children
              <> {props.children} </>
            )
          }
          <AutoFocusDialog setSelfFunc={props.setSelfSelectedCtx} />
        </div>
        {/* TODO: add scrollbar on the right offset, use scrollOffset, winData.x and winData.fullY to create the rect */}
        <div className="dialog-bottom-right-icon"></div>
      </div>
    </div>
  );
};

interface UIDialogProps {
  title?: string;
  titleObj?: any;
  // dont center icons
  noCenter?: boolean;
  isErr?: boolean;
  msg?: string;
}

interface WidgetDialogProps {}

interface IDialogProps {
  x: number;
  y: number;
  width?: number;
  height?: number;
  minWidth?: number;
  minHeight?: number;
  hitCloseCallback: () => void;
  windowId?: string;
  // dont allow user to drag while hovering body
  disableBodyDragging?: boolean;
  isResizable?: boolean;
  UI?: UIDialogProps;
  Widget?: WidgetDialogProps;
  children?: any;
}

const defaultDialogWidth = 200;
const defaultDialogHeight = 100;

// set the current window we are using as the 'top' window in global AppContext
function setSelfSelected(ctx: Context, windowId?: string) {
  setSelectedWindow(ctx.setContext, windowId);
}

interface UIDialogTitleProps {
  isErr?: boolean;
  titleObj?: any;
  title?: string;
}

const UIDialogTitle = (props: UIDialogTitleProps) => {
  const dialogTitle: string | null =
    props.title ?? (props.isErr ? "ERROR" : null);

  return (
    <div className="dialog-menu-title">
      {/* use the passed title object if one was given, else the dialog title*/}
      {props.titleObj ??
        (dialogTitle && (
          <div className="dialog-title-text pixel"> {dialogTitle} </div>
        ))}
    </div>
  );
};

const TopRightClose = (props: { hitCloseCallback: () => void }) => {
  return (
    <div
      className="top-right-close-container"
      onClick={(_e) => {
        props.hitCloseCallback();
      }}
    >
      <div className={"top-right-close pixel"}>x</div>
    </div>
  );
};

interface IWidgetTopRightClose {
  hitCloseCallback: () => void;
  disableBodyDragging: boolean;
  setDragDisable: Dispatch<SetStateAction<boolean>>;
  setSelfSelectedCtx: () => void;
  children: React.ReactNode;
}

const WidgetTopRightClose = (props: IWidgetTopRightClose) => {
  return (
    <div className="widget-container">
      <div
        className="widget-body"
        // onMouseEnter={() => props.setDragDisable(props.disableBodyDragging)}
        // onMouseLeave={() => props.setDragDisable(props.disableBodyDragging)}
      >
        <TopRightClose hitCloseCallback={props.hitCloseCallback} />
        {props.children}
      </div>
      <AutoFocusDialog setSelfFunc={props.setSelfSelectedCtx} />
    </div>
  );
};

const Dialog = (props: IDialogProps) => {
  // dialog related
  const dialogWidth = props.width ?? defaultDialogWidth;
  const dialogHeight = props.height ?? defaultDialogHeight;

  const disableBodyDragging = props.disableBodyDragging ?? false;
  const canResize = props.isResizable ?? true;

  // disable dragging/resizing while mousing over buttons
  const [dragDisable, setDragDisable] = useState<boolean>(false);
  const [resizable, setResizable] = useState<boolean>(true);

  const scrollRef = useRef<HTMLDivElement>(null);

  const handleEnableRND = () => {
    // in case the x button was clicked, make sure element still exists
    if (scrollRef) {
      setDragDisable(false);
      setResizable(true);
    }
  };

  const handleDisableRND = () => {
    if (scrollRef) {
      setDragDisable(true);
      setResizable(false);
    }
  };

  const defaultWindowData: windowData = {
    width: dialogWidth,
    height: dialogHeight,
    fullY: 0,
  };

  // scroll related
  const [scrollOffset, setScrollOffset] = useState<number>(0);
  const [winData, setWinData] = useState(defaultWindowData);

  const scrollTo = (height: number) => {
    if (scrollRef.current === null) {
      return;
    }
    scrollRef.current.scrollTo({ top: height });
    setScrollOffset(height);
  };

  const handleScrollUp = () => {
    scrollTo(Math.max(0, scrollOffset - winData.height / 3));
  };

  const handleScrollDown = () => {
    scrollTo(
      Math.min(
        winData.fullY - winData.height,
        scrollOffset + winData.height / 3,
      ),
    );
  };

  const saveElementData = () => {
    const el: HTMLDivElement | null = scrollRef.current;
    if (el === null) {
      return;
    }
    const elData: DOMRect = el.getBoundingClientRect();
    setWinData({
      height: elData.height,
      width: elData.width,
      fullY: el.scrollHeight,
    });
  };

  useEffect(() => {
    // onload, save element attributes
    saveElementData();
    // if this is only meant to be dragged by the title, disable dragging here
    // the arrow functions in the body check if this is disabled before firing the handleEnableRND
    if (disableBodyDragging) {
      setDragDisable(false);
    }
    scrollTo(0); // start at 0, to fix leftover client data from reloads?
  }, []);

  return (
    <AppContextConsumer>
      {(value: Context) => {
        // memoize this in this context so I dont recreate it a bunch
        const setSelfSelectedCtx = () => setSelfSelected(value, props.windowId);

        return (
          <Rnd
            default={{
              x: props.x,
              y: props.y,
              width: dialogWidth,
              height: dialogHeight,
            }}
            // bounds="#desktop-body"
            onResizeStop={saveElementData}
            onDragStop={saveElementData}
            minHeight={props.minHeight}
            minWidth={props.minWidth}
            disableDragging={dragDisable}
            enableResizing={canResize ? resizable : false}
            // onClick/Drag/Touch, increase z-index of this window
            onClick={setSelfSelectedCtx}
            onDragStart={setSelfSelectedCtx}
            onResizeStart={setSelfSelectedCtx}
            onTouchStart={setSelfSelectedCtx}
            onMouseDown={(event: MouseEvent) => {
              // when user clicks, drags or resizes a window
              // dont draw rectangles on the desktop
              event.stopPropagation();
            }}
            // these are unset if another window sets itself as the selected window
            className={clsx(
              "rnd",
              value.selectedWindow === props.windowId && "top-dialog",
            )}
          >
            {props.UI !== undefined ? (
              <UIWindow
                scrollRef={scrollRef}
                msg={props.UI.msg}
                children={props.children}
                noCenter={props.UI.noCenter ?? false}
                errorDialog={props.UI.isErr ?? false}
                dialogWidth={dialogWidth}
                dialogHeight={dialogHeight}
                disableBodyDragging={disableBodyDragging}
                hitCloseCallback={props.hitCloseCallback}
                handleEnableRND={handleEnableRND}
                handleDisableRND={handleDisableRND}
                handleScrollUp={handleScrollUp}
                handleScrollDown={handleScrollDown}
                winData={winData}
                scrollOffset={scrollOffset}
                setScrollOffset={setScrollOffset}
                setDragDisable={setDragDisable}
                setSelfSelectedCtx={setSelfSelectedCtx}
                title={
                  <UIDialogTitle
                    titleObj={props.UI.titleObj}
                    title={props.UI.title}
                    isErr={props.UI.isErr}
                  />
                }
              />
            ) : (
              <WidgetTopRightClose
                hitCloseCallback={props.hitCloseCallback}
                disableBodyDragging={disableBodyDragging}
                setDragDisable={setDragDisable}
                setSelfSelectedCtx={setSelfSelectedCtx}
                children={props.children}
              />
            )}
          </Rnd>
        );
      }}
    </AppContextConsumer>
  );
};

// empty element that receives the context, with a useEffect hook
// that selects this when its launched
const AutoFocusDialog = ({ setSelfFunc }: { setSelfFunc: () => void }) => {
  useEffect(() => {
    setSelfFunc();
  }, []);
  return null;
};

export default Dialog;
