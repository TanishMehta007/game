const imageUpload = document.getElementById('imageUpload');
const puzzleContainer = document.getElementById('puzzleContainer');
const imageCanvas = document.getElementById('imageCanvas');
const message = document.getElementById('message');

let gridSize = 3; // 3x3 grid
let pieces = [];
let shuffledPieces = [];

// Handle image upload
imageUpload.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      createPuzzle(e.target.result);
    };
    reader.readAsDataURL(file);
  }
});

// Create the puzzle
function createPuzzle(imageSrc) {
  pieces = [];
  shuffledPieces = [];
  puzzleContainer.innerHTML = '';
  message.textContent = '';

  const img = new Image();
  img.src = imageSrc;
  img.onload = () => {
    // Set up canvas to slice the image
    imageCanvas.width = img.width;
    imageCanvas.height = img.height;
    const ctx = imageCanvas.getContext('2d');
    ctx.drawImage(img, 0, 0, img.width, img.height);

    const pieceWidth = img.width / gridSize;
    const pieceHeight = img.height / gridSize;

    // Create pieces
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const pieceCanvas = document.createElement('canvas');
        pieceCanvas.width = pieceWidth;
        pieceCanvas.height = pieceHeight;
        const pieceCtx = pieceCanvas.getContext('2d');
        pieceCtx.drawImage(
          imageCanvas,
          col * pieceWidth,
          row * pieceHeight,
          pieceWidth,
          pieceHeight,
          0,
          0,
          pieceWidth,
          pieceHeight
        );

        const piece = document.createElement('div');
        piece.classList.add('piece');
        piece.style.backgroundImage = url(${pieceCanvas.toDataURL()});
        piece.style.backgroundSize = ${gridSize * 100}% ${gridSize * 100}%;
        piece.setAttribute('data-index', ${row}-${col});
        pieces.push(piece);
      }
    }

    // Shuffle pieces
    shuffledPieces = [...pieces].sort(() => Math.random() - 0.5);
    shuffledPieces.forEach((piece) => puzzleContainer.appendChild(piece));

    // Add drag-and-drop functionality
    addDragAndDrop();
  };
}

// Drag-and-drop logic
function addDragAndDrop() {
  let draggedPiece = null;

  shuffledPieces.forEach((piece) => {
    piece.draggable = true;

    piece.addEventListener('dragstart', () => {
      draggedPiece = piece;
    });

    piece.addEventListener('dragover', (e) => {
      e.preventDefault();
    });

    piece.addEventListener('drop', (e) => {
      e.preventDefault();
      const targetPiece = e.target;

      // Swap pieces
      const draggedParent = draggedPiece.parentNode;
      const targetParent = targetPiece.parentNode;
      draggedParent.insertBefore(targetPiece, draggedPiece);
      targetParent.insertBefore(draggedPiece, targetPiece);

      // Check solution
      checkSolution();
    });
  });
}

// Check if puzzle is solved
function checkSolution() {
  const currentOrder = Array.from(puzzleContainer.children).map((piece) =>
    piece.getAttribute('data-index')
  );
  const correctOrder = pieces.map((piece) => piece.getAttribute('data-index'));

  if (JSON.stringify(currentOrder) === JSON.stringify(correctOrder)) {
    message.textContent = 'Puzzle Solved!';
  }
}