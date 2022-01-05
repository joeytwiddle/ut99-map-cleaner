export const cleaner = {
	alignToGrid,
};

function alignToGrid(inputText, options) {
	const lines = inputText.split(/\r?\n/);
	for (let i = 0; i < lines.length; i++) {
		const inLine = lines[i];
		let outLine = inLine;
		if (inLine.match(/^\s*(Origin|Vertex|Texture)/)) {
			//const splitLine = inLine.split(/ +/)
			//const splitLine = inLine.split(/(?=[^0-9A-Za-z]+)/)
			const splitLine = splitButKeepSpaces(inLine);
			//console.log("splitLine:", splitLine);
			const inVector = splitLine[3].split(',');
			const outVector = inVector.map(numStr => alignNumberToGrid(numStr, options));
			outLine = `${splitLine[0]}${splitLine[1]}${splitLine[2]}${outVector.join(',')}`;
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

function alignNumberToGrid(numStr, options) {
	const { resolution } = options ?? 1;
	const num = Number(numStr);
	const scaledNum = num / resolution;

	const roundedNum = Math.round(scaledNum);
	const diff = Math.abs(scaledNum - roundedNum);

	const inputSign = numStr.charAt(0);

	let outNum;
	if (diff < 0.005 && false) {
		// This was close to the grid, so it should probably be on the grid
		outNum = roundedNum * resolution;
	} else {
		// This was not close to the grid, so leave it how it is
		outNum = scaledNum * resolution;
	}

	return formatNumber(outNum, inputSign);
}

function formatNumber(num, inputSign) {
	const sign = num === 0 ? inputSign : num > 0 ? '+' : '-';
	const absVal = Math.abs(num);

	const simpleNumStr = absVal.toLocaleString(undefined, { minimumFractionDigits: 6, maximumFractionDigits: 6, minimumIntegerDigits: 5, useGrouping: false });

	return `${sign}${simpleNumStr}`;
}
