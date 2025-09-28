import { useEffect, useState, useRef} from "react";
import "../../styles/boring.css";
import { objectsEqual } from "../../utils/util";
import { defaultOptions } from "../../utils/default";

const optionMeta = {
  model: { type: "select", options: ["gemini-2.5-pro", "gemini-2.5-flash", "gemini-2.0-flash"] },
  reply_length: { type: "select", options: ["short", "medium", "long"] },
  mean_level: { type: "number", min: 0, max: 10, step: 1 },
  reply_speed: { type: "number", min: 0, max: 5, step: 1 } 
};


const CustomSelect = ({ label, value, options, onChange }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const handleSelect = (val) => {
    onChange(val);
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="custom-select-container" ref={containerRef}>
      <label>{label}</label>
      <div
        className="custom-select-box"
        onClick={() => setOpen((prev) => !prev)}
      >
        {value || "Select..."}
        <span className="arrow">{open ? "▲" : "▼"}</span>
      </div>
      {open && (
        <ul className="custom-select-options">
          {options.map((opt) => (
            <li
              key={opt}
              onClick={() => handleSelect(opt)}
              className={opt === value ? "selected" : ""}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};


const Settings = () => {
  const [options, setOptions] = useState(defaultOptions);
  const [changedOptions, setChangedOptions] = useState(defaultOptions);

  useEffect(() => {
    const stored = localStorage.getItem("options");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const merged = { ...defaultOptions, ...parsed };
        setOptions(merged);
        setChangedOptions(merged);
      } catch {
        localStorage.setItem("options", JSON.stringify(defaultOptions));
        setOptions(defaultOptions);
        setChangedOptions(defaultOptions);
      }
    }
  }, []);

  const handleApply = () => {
    if (!objectsEqual(changedOptions, options)) {
      localStorage.setItem("options", JSON.stringify(changedOptions));
      setOptions(changedOptions);
    }
  };

  const handleChange = (name, value) => {
    setChangedOptions({ ...changedOptions, [name]: value });
  };

  return (
    <div id="settings" className="page">
      <h1>Settings</h1>
      <p>Choose your preferred model, mean level, reply speed and response length. 0 is FAST and 5 is SLOW!</p>

      <div className="settings-list">
        {/* Model dropdown */}
        <CustomSelect
          label="Model"
          value={changedOptions.model}
          options={optionMeta.model.options}
          onChange={(val) => handleChange("model", val)}
        />

        {/* Mean level slider */}
        <div className="option slider">
          <label>Mean Level: {changedOptions.mean_level}</label>
          <input
            type="range"
            min={optionMeta.mean_level.min}
            max={optionMeta.mean_level.max}
            step={optionMeta.mean_level.step}
            value={changedOptions.mean_level}
            onChange={(e) => handleChange("mean_level", parseInt(e.target.value))}
          />
        </div>

        <div className="option slider">
          <label>Reply Speed: {changedOptions.reply_speed}</label>
          <input
            type="range"
            min={optionMeta.reply_speed.min}
            max={optionMeta.reply_speed.max}
            step={optionMeta.reply_speed.step}
            value={changedOptions.reply_speed}
            onChange={(e) => handleChange("reply_speed", parseFloat(e.target.value))}
          />
        </div>

        {/* Reply length buttons */}
        <div className="option">
          <label>Reply Length</label>
          <div className="button-group">
            {optionMeta.reply_length.options.map((len) => (
              <button
                key={len}
                className={changedOptions.reply_length === len ? "active" : ""}
                onClick={() => handleChange("reply_length", len)}
              >
                {len.charAt(0).toUpperCase() + len.slice(1)}
              </button>
            ))}
          </div>
        </div>

      </div>

      <div className="button-container">
        <button disabled={objectsEqual(changedOptions, options)} onClick={() => setChangedOptions(options)}>Revert</button>
        <button disabled={objectsEqual(changedOptions, options)} onClick={handleApply}>Apply</button>
      </div>
    </div>
  );
};

export default Settings;
