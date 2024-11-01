import React from "react";
import Dialog from "./dialog";
import useWindowDimensions from "./dimensions";

interface IDesktopErrorDialogProps {
  height?: number;
  width?: number;
  msg: string;
  err?: Error; // if provided, renders the error message text as another node
  closeDialog: () => void;
}

const DesktopErrorDialog = (props: IDesktopErrorDialogProps) => {
  const { browserHeight, browserWidth } = useWindowDimensions();

  const dialogHeight = props.height ?? 140;
  const dialogWidth = props.width ?? 250;

  // if values aren't provided, default is to:
  // center dialog on x axis, 1/3rd down the page on y
  // subtract half of the height/width to actually center dialog
  // (as opposed to top left corner)
  const xPos = browserWidth / 2 - dialogWidth / 2;
  const yPos = browserHeight / 3 - dialogHeight / 2;

  return (
    <Dialog
      UI={{
        msg: props.msg,
        isErr: true,
      }}
      x={xPos}
      y={yPos}
      height={dialogHeight}
      width={dialogWidth}
      hitCloseCallback={props.closeDialog}
    >
      {/* there was an error!, include the stacktrace as children, in addition to the message*/}
      {
        props.err !== undefined ? (
          <div className="dialog-error-stacktrace"> {props.err!.message} </div>
        ) : (
          <></>
        ) // empty children if no error. seems to be required
      }
    </Dialog>
  );
};

export default DesktopErrorDialog;
