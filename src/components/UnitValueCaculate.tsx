import { useState } from "react";
import cx from "classnames";
import GroupValue from "./GroupValue";

export const UnitType = {
  PERCENT: "%",
  PX: "px",
};

export default function UnitValueCaculate() {
  const [unit, setUnit] = useState(UnitType?.PERCENT);

  return (
    <div className="flex flex-col gap-3 flex-1">
      <div className="flex justify-between w-full items-center ">
        <div className="text-xs font-normal text-[var(--color-text-default)]">
          Unit
        </div>
        <div className="flex items-center w-1/2 gap-[2px] bg-[var(--color-bg-default)] rounded-[10px] p-[3px]">
          <div
            className={cx(
              "flex items-center justify-center px-4 py-3 rounded-[8px] text-[var(--color-text-default)] hover:text-[var(--color-text-hover)] text-xs font-medium w-1/2 hover:bg-[var(--color-bg-hover)]",
              {
                "text-[var(--color-text-hover)] bg-[var(--color-bg-hover)]":
                  unit === UnitType?.PERCENT,
              }
            )}
            onClick={() => setUnit(UnitType?.PERCENT)}
          >
            %
          </div>
          <div
            className={cx(
              "flex items-center justify-center px-4 py-3 rounded-[8px] text-[var(--color-text-default)] hover:text-[var(--color-text-hover)] text-xs font-medium w-1/2 hover:bg-[var(--color-bg-hover)]",
              {
                "text-[var(--color-text-hover)] bg-[var(--color-bg-hover)]":
                  unit === UnitType?.PX,
              }
            )}
            onClick={() => setUnit(UnitType?.PX)}
          >
            px
          </div>
        </div>
      </div>

      <GroupValue unit={unit} />
    </div>
  );
}
