import { image_data, mosaify } from 'photo-mosaic'



const canvas = document.getElementById('main-frame');
const ctx = canvas.getContext('2d');

const img = new Image();
const fileInput = document.getElementById("file-input");
const TILE_WIDTH = 16;
const TILE_HEIGHT = 16;

fileInput.onchange = imageUpload;

//handling image selected by the user
function imageUpload() {
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
    let dataUri = canvas.toDataURL();
    dataUri = dataUri.replace('data:image/png;base64,', '');

    //const tiles = generateTiles();

    // const colors = tiles.map((tile, i) => {
    //     console.log('=======================color============================');
    //     console.log(tile.pixels);
    //     console.log('=======================color============================');
    //     setTimeout(() => {
    //         const color = image_data(tile.pixels);
    //         console.log('=======================color============================');
    //         console.log(color, i);
    //         console.log('=======================color============================');
    //         return {color, x: tile.x, y: tile.y};
    //     }, 300);
        
    // });

    const colors = image_data(dataUri);
    
    //const colors = mosaify(tiles);
    console.log('=======================colors============================');
    console.log(colors);
    console.log('=======================colors============================');
    showColorPalette(colors);
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
            
            let dataUri = canvas.toDataURL();
            dataUri = dataUri.replace('data:image/png;base64,', '');
    
            imageTiles.push({
                "pixels": dataUri,// raw pixels
                "x": x * TILE_WIDTH,
                "y": y * TILE_HEIGHT
            });
        } //end of colums for loop
    } //end of row for loop
    return imageTiles;
}
