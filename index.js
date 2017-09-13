let board = document.querySelector('#board');
let clear = document.querySelector('#clear');
let add = document.querySelector('#add');
let changeColor = document.querySelector('#color');
let removeRect = document.querySelector('#remove');
let submit = document.querySelector('#submit');
let list = document.querySelector('#layoutList');
let deleteButton = document.querySelector('#delete');

let colorArray = ['#b72025', '#1abc9c', '#e67e22', '#3498db', '#9b59b6'];
let prevColor = null;

let elArray = [];

// init on document load
let interval = setInterval(function() {
	if (document.readyState === 'complete') {
		clearInterval(interval);
		checkForLayouts();
		populateLayoutList();
	}
}, 100);

// EVENT HANDLERS
clear.addEventListener('click', () => {
	while (board.firstChild) {
		board.removeChild(board.firstChild);
	}
	list.options.selectedIndex = 0;
});

add.addEventListener('click', () => {
	createRect();
});

board.addEventListener('dblclick', e => {
	if (e.target.parentNode == board) {
		if (changeColor.checked) {
			e.target.style.backgroundColor = colorSelect();
		} else if (removeRect.checked) {
			board.removeChild(e.target);
		} else {
			return;
		}
	}
	return;
});

submit.addEventListener('click', () => {
	saveLayout();
});

list.addEventListener('change', e => {
	let option = e.target.options[e.target.options.selectedIndex].textContent;
	if (localStorage && localStorage.getItem(option)) {
		board.innerHTML = localStorage.getItem(option);
	}
});

deleteButton.addEventListener('click', () => {
	let option = list.options[list.options.selectedIndex].textContent;
	deleteLayout(option);
});

// FUNCTIONS
function colorSelect() {
	let color = Math.floor(Math.random() * colorArray.length);
	if (prevColor == color) {
		return colorSelect();
	}
	prevColor = color;
	return colorArray[color];
}

function createRect() {
	let rect = document.createElement('div');
	rect.className = 'rect';
	rect.style.backgroundColor = colorSelect();
	board.appendChild(rect);
	$('.rect')
		.draggable()
		.resizable();
}

function checkForLayouts() {
	clearLayoutList();
	if (localStorage && localStorage.length > 0) {
		let length = localStorage.length;
		for (key in localStorage) {
			populateLayoutList(key);
		}
	}
	return;
}

function populateLayoutList(value) {
	let option = document.createElement('option');
	option.textContent = value;
	list.appendChild(option);
}

function saveLayout() {
	clearLayoutList();
	let layoutName = document.querySelector('#layoutName').value;
	let layout = document.querySelector('#board').innerHTML;

	if (layoutName == '') {
		document.querySelector('#layoutName').focus();
		alert('Please enter a layout name');
		return;
	}

	if (localStorage) {
		localStorage.setItem(layoutName, layout);
	} else {
		alert(
			'Sorry, your browser is not able to save layouts.. (Error: local storage)'
		);
	}
	checkForLayouts();
	document.querySelector('#layoutName').value = '';
}

function deleteLayout(value) {
	if (value == '-- None --') {
		return;
	}
	localStorage.removeItem(value);
	clearLayoutList();
	checkForLayouts();
	// clear board
	clear.click();
}

// because saving and deleting layouts caused duplicates
function clearLayoutList() {
	// > 2 to keep default option
	while (list.childNodes.length > 2) {
		list.removeChild(list.lastChild);
	}
}
