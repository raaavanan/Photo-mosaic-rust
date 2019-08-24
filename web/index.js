import { get_color_palette, mosaify } from 'photo-mosaic'

/** Initiating a canvas element at global scope */
const canvas = document.getElementById('main-frame');
const ctx = canvas.getContext('2d');

// image to recieve the image uploaded by user
const img = new Image();
const fileInput = document.getElementById("file-input");
const TILE_WIDTH = 60;
const TILE_HEIGHT = 60;

// listen to file upload
fileInput.onchange = imageUpload;

//handling image selected by the user
function imageUpload() {
    const file = document.getElementById('upload-image').files[0];
    //using file reader to load the image.
    const reader = new FileReader();
    if (file) {
        reader.readAsDataURL(file);
    }
    // display the image once the image is ready
    reader.onload = function (evt) {
        if (evt.target.readyState == FileReader.DONE) {
            img.src = evt.target.result;
            document.body.appendChild(img);
            img.style.display = 'none';
        }
    }
}

// On image ready load it in canvas
img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img,0,0);
    let dataUri = canvas.toDataURL();
    dataUri = dataUri.replace('data:image/png;base64,', '');

    console.time("generating tiles");
    const tiles = generateTiles();
    console.timeEnd("generating tiles");

   const palette = get_color_palette(dataUri);
   showColorPalette(palette);
    
    const colors = mosaify(tiles);
    drawMosaic(colors);
    
    
}

function drawMosaic(colors) {
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    colors.forEach(data => {
        const {color, x, y} = data
        ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
        ctx.beginPath();
        //ctx.arc(x, y, TILE_WIDTH/2, 0, 2 * Math.PI);
        //ctx.fill();
        ctx.fillRect(x,y,TILE_WIDTH, TILE_HEIGHT);
    })
    
}

/**
 * show color palette
 */
const showColorPalette = (colors) => {
    const {color1, color2, color3, color4, color5} = colors;
    document.getElementById('dominant-color').style.backgroundColor = `rgb(${color1[0]}, ${color1[1]}, ${color1[2]})`;
    document.getElementById('color1').style.backgroundColor = `rgb(${color1[0]}, ${color1[1]}, ${color1[2]})`;
    document.getElementById('color2').style.backgroundColor = `rgb(${color2[0]}, ${color2[1]}, ${color2[2]})`;
    document.getElementById('color3').style.backgroundColor = `rgb(${color3[0]}, ${color3[1]}, ${color3[2]})`;
    document.getElementById('color3').style.backgroundColor = `rgb(${color3[0]}, ${color3[1]}, ${color3[2]})`;
    document.getElementById('color4').style.backgroundColor = `rgb(${color4[0]}, ${color4[1]}, ${color4[2]})`;
    document.getElementById('color5').style.backgroundColor = `rgb(${color5[0]}, ${color5[1]}, ${color5[2]})`;
    document.getElementById('color-pallete').style.display = 'flex';
}

/**
 * generate tiles of image data with x, y co-ordinates
 */
function generateTiles() {
    const cols = img.width / TILE_WIDTH;
    const rows = img.height / TILE_HEIGHT;
    console.log("log: -------------------------------")
    console.log("log: generateTiles -> cols", Math.floor(cols))
    console.log("log: -------------------------------")
    console.log("log: -------------------------------")
    console.log("log: generateTiles -> rows", Math.floor(rows))
    console.log("log: -------------------------------")
    
    const imageTiles = [];
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    document.body.appendChild(canvas);
    for (let y = 0; y < rows; ++y) {
        for (let x = 0; x < cols; ++x) {
            
            canvas.width = TILE_WIDTH;
            canvas.height = TILE_HEIGHT;
            

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
            
            let dataUri = canvas.toDataURL();
            dataUri = dataUri.replace('data:image/png;base64,', '');
    
            imageTiles.push({
                "pixels": dataUri,// raw pixels
                "x": x * TILE_WIDTH,
                "y": y * TILE_HEIGHT
            });
            //context.clearRect(0, 0, TILE_WIDTH, TILE_HEIGHT);
        } //end of colums for loop
    } //end of row for loop
    return imageTiles;
}
