import React, { useLayoutEffect, useRef, forwardRef } from "react";

const Textarea = forwardRef(({ givenId, value, onChange, onKeyDown }, ref) => {
    const textareaRef = useRef();

    // This only tracks the auto-sized height so we can tell if the user has manually resized
    const autoHeight = useRef();

    useLayoutEffect(() => {
        if (!textareaRef.current) {
            return;
        }

        textareaRef.current.style.height = "auto";
        textareaRef.current.style.overflow = "hidden";
        const next = `${textareaRef.current.scrollHeight}px`;
        textareaRef.current.style.height = next;
        autoHeight.current = next;
        textareaRef.current.style.overflow = "auto";
    }, [value, textareaRef, autoHeight]);

    return (
        <textarea
            id={givenId}
            className="w-full input input-bordered rounded-lg font-size:16px p-0.5"
            placeholder="Type a message..."
            ref={(el) => {
                textareaRef.current = el;
                if (typeof ref === 'function') {
                    ref(el);
                } else if (ref) {
                    ref.current = el;
                }
            }}
            style={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
        />
    );
});

export default Textarea;