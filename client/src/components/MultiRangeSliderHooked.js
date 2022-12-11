import { useState, useRef } from "react";
import "./multiRangeSlider.css";

const MultiRangeSliderHooked = ({ defaultMin, defaultMax, min, max, setMin, setMax }) => {
	const [minVal, setMinVal] = useState(defaultMin);
	const [maxVal, setMaxVal] = useState(defaultMax);
	const range = useRef(null);

	return (
		<div className="container">
			<input
				id="rangeMin"
				type="range"
				step={getStep(min)}
				min={defaultMin}
				max={defaultMax}
				value={min ?? defaultMin}
				onChange={event => {
					const value = Math.min(Number(event.target.value), maxVal - 1);
					setMinVal(value);
					setMin(value);
				}}
				className="thumb thumb--left"
				style={{ zIndex: minVal > maxVal - 100 && "5" }}
			/>
			<input
				id="rangeMax"
				type="range"
				step={getStep(max)}
				min={defaultMin}
				max={defaultMax}
				value={max ?? defaultMax}
				onChange={event => {
					const value = Math.max(Number(event.target.value), minVal + 1);
					setMaxVal(value);
					setMax(value);
				}}
				className="thumb thumb--right"
			/>

			<div className="slider">
				<div className="slider__track" />
				<div ref={range} className="slider__range" />
				<div className="slider__left-value">{min ?? defaultMin}</div>
				<div className="slider__right-value">{max ?? defaultMax}</div>
			</div>
		</div>
	);
};

const getStep = n => {
	let order = Math.floor(Math.log(n) / Math.LN10 + 0.000000001); // because float math sucks like that
	return Math.max(Math.pow(10, order) / 10, 1);
};

export default MultiRangeSliderHooked;
