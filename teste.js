let nota = 8;
function validacao(nota) {
    if (isNaN(nota)) {
        return 0
    }

    else {
        if (Number.isInteger(nota)){
            return 1
        }
        else
            return 0
    }
}

console.log(validacao(nota))
console.log(validacao('tftf'))
console.log(validacao('10'))
console.log(validacao('9.5'))
