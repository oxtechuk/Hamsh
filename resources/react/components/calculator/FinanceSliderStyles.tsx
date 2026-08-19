import type { IFinanceSliderStylesProps } from "../../interfaces/IFinanceSliderStylesProps";

export default function FinanceSliderStyles({ direction = "ltr" }: IFinanceSliderStylesProps) {
  const gradientDir = direction === "rtl" ? "to left" : "to right";
  return (
    <style>{`
      .finance-slider {
        -webkit-appearance: none; appearance: none;
        width: 100%; height: 5px; border-radius: 9999px;
        outline: none; cursor: pointer;
        background: linear-gradient(${gradientDir},
          #DDBB72 0%, #DDBB72 var(--slider-progress),
          #E4E4E4 var(--slider-progress), #E4E4E4 100%);
      }
      .finance-slider::-webkit-slider-thumb {
        -webkit-appearance: none; appearance: none;
        width: 17px; height: 17px; border-radius: 9999px;
        background: #DDBB72; border: 3px solid #fff;
        box-shadow: 0 0 0 1px #DDBB72; cursor: pointer;
      }
      .finance-slider::-moz-range-thumb {
        width: 17px; height: 17px; border-radius: 9999px;
        background: #DDBB72; border: 3px solid #fff;
        box-shadow: 0 0 0 1px #DDBB72; cursor: pointer;
      }
      .finance-slider--rtl {
        transform: scaleX(-1);
      }
      .finance-slider--rtl::-webkit-slider-thumb {
        transform: scaleX(-1);
      }
      .finance-slider--rtl::-moz-range-thumb {
        transform: scaleX(-1);
      }
    `}</style>
  );
}
