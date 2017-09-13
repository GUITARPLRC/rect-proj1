let board = document.querySelector('#board');
let clear = document.querySelector('#clear');
let add = document.querySelector('#add');
let changeColor = document.querySelector('#color');
let removeRect = document.querySelector('#remove');
let submit = document.querySelector('#submit');
let list = document.querySelector('#layoutList');
let deleteButton = document.querySelector('#delete');
let onTop = document.querySelector('#alwaysOnTop');

let colorArray = ['#b72025', '#1abc9c', '#e67e22', '#3498db', '#9b59b6'];
let prevColor = null;

// init on document load
let interval = setInterval(function() {
	if (document.readyState === 'complete') {
		clearInterval(interval);
		checkForLayouts();
		populateLayoutList();
	}
}, 100);

/*
/
/ EVENT HANDLERS
/
*/

clear.addEventListener('click', () => {
	clearBoard();
});

add.addEventListener('click', () => {
	createRect();
});

board.addEventListener('dblclick', e => {
	handleDblClicks(e);
});

submit.addEventListener('click', () => {
	saveLayout();
});

list.addEventListener('change', e => {
	let board = document.querySelector('#board');
	let option = e.target.options[e.target.options.selectedIndex].textContent;
	if (localStorage && localStorage.getItem(option)) {
		board.innerHTML = localStorage.getItem(option);
	}
	// need to rebind drag and resize to rects after loading layout
	addDragResize();
});

deleteButton.addEventListener('click', () => {
	let option = list.options[list.options.selectedIndex].textContent;
	deleteLayout(option);
});

// onTop.addEventListener('click', e => {
// 	if (e.target.checked) {
// 		$('.rect').each(function(index, element) {
// 			$(element)
// 				.draggable({ stack: 'div' })
// 				.resizable();
// 		});
// 	} else {
// 		$('.rect').each(function(index, element) {
// 			$(element)
// 				.draggable()
// 				.resizable();
// 		});
// 	}
// 	return;
// });

/*
/
/ FUNCTIONS
/
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
		.resizable({
			resize: function(event, ui) {
				console.log('resize');
			}
		});
}

function clearBoard() {
	$('#board').empty();
	// while (board.firstChild) {
	// 	board.removeChild(board.firstChild);
	// }
	list.options.selectedIndex = 0;
}

function handleDblClicks(e) {
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
	document.querySelector('#layoutName').value = '';
}

function deleteLayout(value) {
	// check if default option is not selected
	if (value == '-- Select --') {
		return;
	}
	localStorage.removeItem(value);
	checkForLayouts();
	// clear board
	clear.click();
}

// because saving and deleting layouts caused duplicates
function clearLayoutList() {
	// > 2 to keep default option???
	while (list.childNodes.length > 2) {
		list.removeChild(list.lastChild);
	}
}

function addDragResize() {
	$('.rect').each(function(index, element) {
		this.className = '';
	});
	$('#board')
		.children('div')
		.each(function(index, element) {
			$(this).addClass('rect');
		});
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
//
// function alwaysOnTop() {
// 	$('.rect').each(function(index, element) {
// 		$(element).draggable({ stack: 'div' });
// 	});
// 	$('.rect').each(function(index, element) {
// 		$(element).resizable();
// 	});
// }
