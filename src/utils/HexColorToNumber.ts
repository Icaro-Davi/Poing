const HexColorToNumber = function(hexColor: string){
    return parseInt(hexColor.replace('#', ''), 16);
}

export default HexColorToNumber;