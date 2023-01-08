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

const ContentEditable: React.FC<ContentEditableProps> = ({ ...props }) => {
  const [lastHtml, setLastHTML] = useState("");
  const root = useRef<HTMLDivElement | null>(null);
  const { autoFocus, initialContent, onChange } = props;
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (autoFocus && root.current instanceof HTMLDivElement) {
      root.current.focus();
    }
    if (initialContent && root.current instanceof HTMLDivElement) {
      root.current.innerHTML = initialContent;
    }
  }, [autoFocus]);

  // UNSAFE_componentWillUpdate
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (initialContent && root.current instanceof HTMLDivElement) {
        root.current.innerHTML = initialContent;
      }
    }
  }, [initialContent]);

  const fnEmitChange = useCallback(() => {
    let html;

    if (root.current instanceof HTMLDivElement) {
      html = root.current.innerHTML;
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
        root.current = e;
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
