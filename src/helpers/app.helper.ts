import * as fs from 'fs';

export const AppUtils = {

    /* A function that delete an image file from the uploads/images folder  */
    deleteImageFile(filename) {
        fs.unlink(`./uploads/images/${filename}`, (err) => {
            if (err) throw err;
        })
    }
}