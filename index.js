let board = document.querySelector('#board');
let clear = document.querySelector('#clear');
let add = document.querySelector('#add');

let colorsArray = ['#5f71be', '#679134', '#9c693a', '#8e216f', '#ebd01e'];
let prevColor = null;

function colorSelect() {
	let color = Math.floor(Math.random() * colorsArray.length);
	if (prevColor == color) {
		return colorSelect();
	}
	prevColor = color;
	return colorsArray[color];
}

clear.addEventListener('click', () => {
	while (board.firstChild) {
		board.removeChild(board.firstChild);
	}
});

add.addEventListener('click', () => {
	let rect = document.createElement('div');
	rect.className = 'rect';
	rect.style.backgroundColor = colorSelect();
	board.appendChild(rect);
	$('.rect')
		.draggable({
			drag: function(ev, el) {
				console.log(ev, el);
			}
		})
		.resizable();
});

$('.rect').on('drag', function(event, element) {
	console.log(event, element);
});
