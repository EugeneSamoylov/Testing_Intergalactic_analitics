export const isFileValid = ( selectedFile ) => {
    return selectedFile.name.toLowerCase().endsWith(".csv");
}