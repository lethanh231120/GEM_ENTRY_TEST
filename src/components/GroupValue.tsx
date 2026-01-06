import { useState, useRef, useCallback, useEffect } from "react";

export interface IGroupValueProps {
  unit?: string;
}

export default function GroupValue({ unit }: IGroupValueProps) {
  const [value, setValue] = useState("");
  const [plusDisabled, setPlusDisabled] = useState(false);
  const [lastValidValue, setLastValidValue] = useState("");
  const inputRef = useRef(null);

  const parseValue = useCallback((val: any) => {
    if (!val || val === "") return null;
    const parsed = parseFloat(val);
    return isNaN(parsed) ? null : parsed;
  }, []);

  const updateButtonStates = useCallback(
    (val: any, currentUnit: any) => {
      const numVal = parseValue(val);

      if (numVal === null) {
        setPlusDisabled(false);
        return;
      }

      // Disable "+" khi:
      // - Unit là % và giá trị = 100
      if (currentUnit === "%" && numVal >= 100) {
        setPlusDisabled(true);
      } else {
        setPlusDisabled(false);
      }
    },
    [parseValue]
  );

  const handleBlur = useCallback(() => {
    if (!value || value === "") {
      // Nếu rỗng -> quay về giá trị hợp lệ trước đó
      setValue(lastValidValue);
      updateButtonStates(lastValidValue, unit);
      return;
    }

    // Parse theo thứ tự từ trái sang phải, lấy phần số hợp lệ
    let cleanedValue = "";
    let dotCount = 0;
    let hasNumber = false;

    for (let i = 0; i < value?.length; i++) {
      const char = value[i];

      // Cho phép dấu trừ ở đầu
      if (char === "-" && i === 0) {
        cleanedValue += char;
        continue;
      }

      // Thay dấu phẩy thành dấu chấm
      if (char === "," || char === ".") {
        if (dotCount === 0) {
          cleanedValue += ".";
          dotCount++;
          continue;
        } else {
          dotCount++;
          break;
        }
      }

      // Cho phép số
      if (char >= "0" && char <= "9") {
        cleanedValue += char;
        hasNumber = true;
        continue;
      }

      break;
    }

    // Nếu không có số nào hợp lệ -> quay về giá trị hợp lệ trước đó
    if (
      !hasNumber ||
      cleanedValue === "-" ||
      cleanedValue === "." ||
      dotCount > 1
    ) {
      setValue(lastValidValue);
      updateButtonStates(lastValidValue, unit);
      return;
    }

    // Parse thành số
    let numVal = parseFloat(cleanedValue);

    // chuyển về giá trị đúng gần nhất khi out focus: vd: a123
    if (isNaN(numVal)) {
      setValue(lastValidValue);
      updateButtonStates(lastValidValue, unit);
      return;
    }

    // Nếu < 0 -> về 0
    if (numVal < 0) {
      numVal = 0;
    }

    // Nếu Unit là % và value > 100 -> về giá trị hợp lệ trươc
    if (unit === "%" && numVal > 100) {
      numVal = parseFloat(lastValidValue);
    }

    const formatted = numVal.toString();
    setValue(formatted);
    setLastValidValue(formatted);
    updateButtonStates(formatted, unit);
  }, [value, unit, lastValidValue, updateButtonStates]);

  // Handle focus - auto nhảy về 0 nếu < 0
  const handleFocus = useCallback(() => {
    const numVal = parseValue(value);
    if (numVal !== null && numVal < 0) {
      setValue("0");
      updateButtonStates("0", unit);
    }
  }, [value, unit, parseValue, updateButtonStates]);

  // Handle increment
  const handleIncrement = useCallback(() => {
    const numVal = parseValue(value);
    console.log({ numVal });

    if (numVal === null) {
      setValue("1");
      setLastValidValue("1");
      updateButtonStates("1", unit);
      return;
    }

    let newVal = numVal + 1;

    // Nếu unit là % và newVal > 100 -> không cho tăng
    if (unit === "%" && newVal > 100) {
      newVal = 100;
    }

    const formatted = newVal?.toString();
    setValue(formatted);
    setLastValidValue(formatted);
    updateButtonStates(formatted, unit);
  }, [value, unit, parseValue, updateButtonStates]);

  // Handle decrement
  const handleDecrement = useCallback(() => {
    const numVal = parseValue(value);

    if (numVal === null) {
      setValue("0");
      setLastValidValue("0");
      updateButtonStates("0", unit);
      return;
    }

    const newVal = numVal - 1;
    const formatted = newVal?.toString();
    setValue(formatted);
    setLastValidValue(formatted);
    updateButtonStates(formatted, unit);
  }, [value, unit, parseValue, updateButtonStates]);

  useEffect(() => {
    const numVal = parseValue(value);
    if (unit === "%" && numVal !== null && numVal > 100) {
      setValue("100");
      setLastValidValue("100");
      setPlusDisabled(true);
    }
  }, [unit]);

  // Disable button "-" khi giá trị = 0 hoặc empty
  const numValue = parseValue(value);
  const minusDisabled = numValue === null || numValue <= 0;

  return (
    <div className="flex justify-between w-full items-center">
      <div className="text-xs font-normal text-[var(--color-text-default)]">
        Value
      </div>
      <div
        className="flex items-center w-1/2 rounded-[8px] bg-[var(--color-bg-default)] h-[46px] has-[input:hover]:bg-[var(--color-bg-hover)] border border-transparent
    focus-within:border-[var(--color-border-focus)]"
      >
        <button
          type="button"
          className="w-[46px] px-3 h-full flex items-center justify-center text-[var(--color-text-hover)] hover:bg-[var(--color-bg-hover)] shrink-0 hover:rounded-tl-[8px] hover:rounded-bl-[8px] relative group/minus"
          onClick={handleDecrement}
          disabled={minusDisabled}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          {minusDisabled && (
            <span
              className="
                pointer-events-none
                absolute bottom-full left-1/2 -translate-x-1/2 mb-2
                whitespace-nowrap
                rounded-md px-4 py-2 text-xs
                bg-black text-[var(--color-text-hover)]
                opacity-0 scale-95
                transition-all
                group-hover/minus:opacity-100
                group-hover/minus:scale-100

                after:content-['']
                after:absolute
                after:top-full
                after:left-1/2
                after:-translate-x-1/2
                after:border-3
                after:border-transparent
                after:border-t-black
              "
            >
              Value must greater than 0
            </span>
          )}
        </button>

        <input
          type="text"
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          onFocus={handleFocus}
          className="h-full min-w-[50px] flex-1 text-center text-sm outline-none "
        />

        <button
          type="button"
          onClick={handleIncrement}
          disabled={plusDisabled}
          className="w-[46px] px-3 h-full flex items-center justify-center text-[var(--color-text-hover)] hover:bg-[var(--color-bg-hover)] shrink-0 hover:rounded-tr-[8px] hover:rounded-br-[8px] relative group/plus"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          {plusDisabled && (
            <span
              className="
                pointer-events-none
                absolute bottom-full left-1/2 -translate-x-1/2 mb-2
                whitespace-nowrap
                rounded-md px-4 py-2 text-xs
                bg-black text-[var(--color-text-hover)]
                opacity-0 scale-95
                transition-all
                group-hover/plus:opacity-100
                group-hover/plus:scale-100

                after:content-['']
                after:absolute
                after:top-full
                after:left-1/2
                after:-translate-x-1/2
                after:border-3
                after:border-transparent
                after:border-t-black
              "
            >
              Value must smaller than 100
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
