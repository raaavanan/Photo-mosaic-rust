const canvas = document.getElementById('main-frame');
const ctx = canvas.getContext('2d');

const img = new Image();
const fileInput = document.getElementById("file-input");
const TILE_WIDTH = 16;
const TILE_HEIGHT = 16;

fileInput.onchange = imageUpload;

//handling image selected by the user
function imageUpload() {
    fileInput.style.display = "none";
    const file = document.getElementById('upload-image').files[0];
    //using file reader to load the image.
    const reader = new FileReader();
    if (file) {
        reader.readAsDataURL(file);
    }
    reader.onload = function (evt) {
        if (evt.target.readyState == FileReader.DONE) {
            img.src = evt.target.result;
            console.log('=======================image file loaded============================');
            document.body.appendChild(img);
            img.style.display = 'none';
        }
    }
}

img.onload = () => {
    console.log('=======================image rendered============================');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    generateTiles();
}

/**
 * generate tiles of image data with x, y co-ordinates
 */
function generateTiles() {
    const rows = img.width / TILE_WIDTH;
    const cols = img.height / TILE_HEIGHT;
    const imageTiles = [];
    for (let y = 0; y < rows; ++y) {
        for (let x = 0; x < cols; ++x) {
            const canvas = document.createElement('canvas');
            canvas.width = TILE_WIDTH;
            canvas.height = TILE_HEIGHT;
            const context = canvas.getContext('2d');

            context.drawImage(
                img,
                x * TILE_WIDTH,
                y * TILE_HEIGHT,
                TILE_WIDTH,
                TILE_HEIGHT,
                0,
                0,
                canvas.width,
                canvas.height
            );

            imageTiles.push({
                "img": canvas.toDataURL(),
                "x": x * TILE_WIDTH,
                "y": y * TILE_HEIGHT
            });
        } //end of colums for loop
    } //end of row for loop
}