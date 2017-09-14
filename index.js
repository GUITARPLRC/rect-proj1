/*-------------------------
/
/ GLOBAL VARIABLES :(
/
/--------------------------
*/

let board = document.querySelector('#board');
let clear = document.querySelector('#clear');
let add = document.querySelector('#add');
let changeColor = document.querySelector('#color');
let removeRect = document.querySelector('#remove');
let save = document.querySelector('#save');
let list = document.querySelector('#layoutList');
let deleteButton = document.querySelector('#delete');

let colorArray = ['#bdc3c7', '#7f8c8d', '#34495e'];
let prevColor = null;

/*-------------------------------
/
/ init on document load
/
/--------------------------------
*/

let interval = setInterval(function() {
	if (document.readyState === 'complete') {
		clearInterval(interval);
		checkForLayouts();
		populateLayoutList();
		// add jquery accordion for directions
		$('#accordion')
			.accordion({
				collapsible: true,
				active: false,
				heightStyle: 'fill'
			})
			.css('visibility', 'visible');
	}
}, 50);

/*--------------------------
/
/ EVENT HANDLERS
/
/---------------------------
*/

clear.addEventListener('click', () => {
	clearBoard();
});

add.addEventListener('click', () => {
	createRect();
});

board.addEventListener('dblclick', event => {
	handleDblClicks(event);
});

save.addEventListener('click', () => {
	saveLayout();
});

list.addEventListener('change', event => {
	loadLayout(event);
});

deleteButton.addEventListener('click', () => {
	let option = list.options[list.options.selectedIndex].textContent;
	deleteLayout(option);
});

/*----------------------
/
/ FUNCTIONS
/
/-----------------------
*/

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
		.draggable({ stack: 'div' })
		.resizable();
}

function clearBoard() {
	while (board.firstChild) {
		board.removeChild(board.firstChild);
	}
	list.options.selectedIndex = 0;
	document.querySelector('#layoutName').value = '';
}

function handleDblClicks(event) {
	if (event.target.parentNode == board) {
		if (changeColor.checked) {
			event.target.style.backgroundColor = colorSelect();
		} else if (removeRect.checked) {
			board.removeChild(event.target);
		} else {
			return;
		}
	}
	return;
}

function loadLayout(event) {
	let option =
		event.target.options[event.target.options.selectedIndex].textContent;
	if (localStorage && localStorage.getItem(option)) {
		board.innerHTML = localStorage.getItem(option);
	}

	// need to rebind drag and resize to rects after loading layout
	addDragAndResize();
	document.querySelector('#layoutName').value = option;
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
	let layoutName = document.querySelector('#layoutName').value;
	let layout = document.querySelector('#board').innerHTML;

	if (layoutName == '') {
		document.querySelector('#layoutName').focus();
		alert('Please enter a layout name');
		return;
	}

	clearLayoutList();

	if (localStorage) {
		localStorage.setItem(layoutName, layout);
	} else {
		alert(
			'Sorry, your browser is not able to save layouts.. (Error: local storage)'
		);
	}
	checkForLayouts();
}

function deleteLayout(value) {
	// check if default option is not selected
	if (value == '-- Select Saved Layout --') {
		return;
	}
	localStorage.removeItem(value);
	checkForLayouts();
	// clear board
	clear.click();
	document.querySelector('#layoutName').value = '';
}

// because saving and deleting layouts caused duplicates
function clearLayoutList() {
	// > 2 to keep default option???
	while (list.childNodes.length > 2) {
		list.removeChild(list.lastChild);
	}
}

function addDragAndResize() {
	$('.rect')
		.children()
		.each(function(index, element) {
			element.remove();
		});

	$('.rect').each(function(index, element) {
		$(this)
			.draggable({ stack: 'div' })
			.resizable();
	});
}
