import React, { useCallback, useEffect, useRef, useState } from "react";
import _ from "lodash";

type ContentEditableProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange"
> & {
  initialContent?: string;
  innerRef?: (e: HTMLDivElement | null) => void;
  onChange?: (html: string) => void;
  onBlur?: (e: React.FocusEvent<HTMLDivElement, Element>) => void;
  autoFocus?: boolean;
  allowEdit?: boolean;
};

const ContentEditable = ({ ...props }: ContentEditableProps) => {
  const [lastHtml, setLastHTML] = useState("");
  let root: HTMLDivElement | null | unknown = useRef<HTMLDivElement | null>(
    null
  );
  const { autoFocus, initialContent, onChange } = props;

  useEffect(() => {
    if (autoFocus && root instanceof HTMLDivElement) {
      root.focus();
    }
    if (initialContent && root instanceof HTMLDivElement) {
      root.innerHTML = initialContent;
    }
  }, [autoFocus, initialContent]);

  const isFirstRender = useRef(true);

  // UNSAFE_componentWillUpdate
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (initialContent && root instanceof HTMLDivElement) {
        root.innerHTML = initialContent;
      }
    }
  });

  const fnEmitChange = useCallback(() => {
    let html;

    if (root instanceof HTMLDivElement) {
      html = root.innerHTML;
    }
    if (onChange && html !== lastHtml) {
      onChange(html || "");
    }
    setLastHTML(html || "");
  }, [root, lastHtml, onChange]);

  const { innerRef, onBlur } = props;
  let { allowEdit } = props;
  if (_.isNil(allowEdit)) allowEdit = true;

  return (
    <div
      onMouseDown={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      {..._.omit(
        props,
        "innerRef",
        "onChange",
        "html",
        "onBlur",
        "autoFocus",
        "allowEdit",
        "initialContent"
      )}
      ref={(e) => {
        root = e;
        innerRef?.(e);
      }}
      tabIndex={0}
      onInput={fnEmitChange}
      onBlur={(e) => {
        fnEmitChange();
        onBlur?.(e);
      }}
      contentEditable={allowEdit}
    />
  );
};

export default ContentEditable;
