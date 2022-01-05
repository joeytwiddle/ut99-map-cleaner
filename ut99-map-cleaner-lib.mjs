export const cleaner = {
	alignToGrid,
};

// TODO: We might want different grid resolution for actors and vertices
// TODO: We might also want different resolutions (or skip alignment entirely) for different types of actor (brushes, pickups, ...)

function alignToGrid(inputText, options) {
	const lines = inputText.split(/\r?\n/);
	//const simpleVectorRegexp = /^\s*(Origin|Vertex|Texture)/;
	const simpleVectorRegexp = /^\s*(Origin|Vertex)/;
	const locationRegexp = /^\s*Location=\(/;
	//const axisLabels = ['X', 'Y', 'Z'];
	for (let i = 0; i < lines.length; i++) {
		const inLine = lines[i];
		let outLine = inLine;
		// Process lines that look like this:
		//              Origin   -00112.000000,+00128.000000,+00016.000000
		if (inLine.match(simpleVectorRegexp)) {
			//const splitLine = inLine.split(/ +/)
			//const splitLine = inLine.split(/(?=[^0-9A-Za-z]+)/)
			const splitLine = splitButKeepSpaces(inLine);
			//console.log("splitLine:", splitLine);
			const inVector = splitLine[3].split(',');
			const outVector = inVector.map(numStr => alignNumberToGrid(numStr, options, true, 5));
			outLine = `${splitLine[0]}${splitLine[1]}${splitLine[2]}${outVector.join(',')}`;
		}
		// Process lines that look like this:
		//     Location=(X=-959.999939,Y=448.000000,Z=120.000000)
		if (inLine.match(locationRegexp)) {
			const indentStr = inLine.match(/^\s+/)[0];
			const inVectorLabeled = inLine.split(/[()]/)[1].split(',');
			const inVectorLabels = inVectorLabeled.map(str => str.split('=')[0]);
			//const inVector = inVectorLabeled.map(str => str.split('=')[1]);
			//const outVector = inVector.map(numStr => alignNumberToGrid(numStr, options));
			//const componentsLabeled = outVector.map((val, i) => `${inVectorLabels[i]}=${val}`);
			const componentsLabeled = inVectorLabeled.map(str => {
				const [label, numStr] = str.split('=');
				return `${label}=${alignNumberToGrid(numStr, options)}`;
			});
			outLine = `${indentStr}Location=(${componentsLabeled.join(',')})`;
		}
		if (outLine !== inLine) {
			lines[i] = outLine;
		}
	}
	return lines.join('\r\n');
}

function splitButKeepSpaces(str) {
	// It might be possible to do this with a lookahead regexp (using `?=`) but rather than learn that, I just wrote my own (which is slower)
	const array = [];
	let current = '';
	let currentType = null;
	for (let i = 0; i < str.length; i++) {
		//const c = str.charAt(i);
		const c = str[i];
		const type = c === ' ' || c === '\t' ? 'whitespace' : 'word';
		if (type === currentType || currentType === null) {
			current = current + c;
			currentType = type;
		} else {
			if (current.length > 0) {
				array.push(current);
				current = '';
				current = c;
			}
			currentType = type;
		}
	}
	if (current.length > 0) {
		array.push(current);
	}
	return array;
}

function alignNumberToGrid(numStr, options, addPlusSign = false, prePadZeroes = 1) {
	const { resolution } = options ?? 1;
	const num = Number(numStr);
	const scaledNum = num / resolution;

	const roundedNum = Math.round(scaledNum);
	const diff = Math.abs(scaledNum - roundedNum);

	const inputSign = numStr.match(/^[+-]?/)[0];

	let outNum;
	if (diff < 0.02) {
		// This was close to the grid, so it should probably be on the grid
		outNum = roundedNum * resolution;
	} else {
		// This was not close to the grid, so leave it how it is
		outNum = scaledNum * resolution;
	}

	return formatNumber(outNum, inputSign, addPlusSign, prePadZeroes);
}

function formatNumber(num, inputSign, addPlusSign, prePadZeroes) {
	const sign = num === 0 ? inputSign : num > 0 ? addPlusSign ? '+' : '' : '-';
	const absVal = Math.abs(num);

	const simpleNumStr = absVal.toLocaleString(undefined, { minimumFractionDigits: 6, maximumFractionDigits: 6, minimumIntegerDigits: prePadZeroes, useGrouping: false });

	return `${sign}${simpleNumStr}`;
}
