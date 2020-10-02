(function(){
    
function numberName(n) {
    if (n === 0) {
        return "zero"
    }

    if (n < 10) {
        return digitName(n)
    }

    if (n < 20) {
        switch(n) {
            case 10: return "ten"
            case 11: return "eleven"
            case 12: return "twelve"
            case 13: return "thirteen"
            case 14: return "fourteen"
            case 15: return "fifteen"
            case 16: return "sixteen"
            case 17: return "seventeen"
            case 18: return "eighteen"
            case 19: return "nineteen"
        }
    }

    if (n < 100) {
        let str = n + ""
        let tens = tensName(parseInt(str[0]))
        let ones = digitName(parseInt(str[1]))
        return tens + ones
    }
}

function parseNumberName(n) {
    if (n === "zero") {
        return 0
    }

    let oneDigit = parseDigit(n)
    if (oneDigit) {
        return oneDigit
    }
    
    switch(n) {
        case "ten": return 10
        case "eleven": return 11
        case "twelve": return 12
        case "thirteen": return 13
        case "fourteen": return 14
        case "fifteen": return 15
        case "sixteen": return 16
        case "seventeen": return 17
        case "eighteen": return 18
        case "nineteen": return 19
    }

    let twoDigits = parseTwoDigits(n)
    if (twoDigits) {
        return twoDigits
    }
    
}

function parseDigit(digit) {
    switch(digit) {
        case "": return 0
        case "one": return 1
        case "two": return 2
        case "three": return 3
        case "four": return 4
        case "five": return 5
        case "six": return 6
        case "seven": return 7
        case "eight": return 8
        case "nine": return 9
    }
}

function parseTwoDigits(str) {
    let tens
    let onesStr
    if (str.startsWith("twenty"))  { tens = 20; onesStr = str.substring(6) }
    if (str.startsWith("thirty"))  { tens = 30; onesStr = str.substring(6) }
    if (str.startsWith("fourty"))  { tens = 40; onesStr = str.substring(6) }
    if (str.startsWith("fifty"))   { tens = 50; onesStr = str.substring(5) }
    if (str.startsWith("sixty"))   { tens = 60; onesStr = str.substring(5) }
    if (str.startsWith("seventy")) { tens = 70; onesStr = str.substring(7) }
    if (str.startsWith("eighty"))  { tens = 80; onesStr = str.substring(6) }
    if (str.startsWith("ninety"))  { tens = 90; onesStr = str.substring(6) }

    if (!tens) { return }

    let ones = parseDigit(onesStr)
    if (ones !== undefined) {
        return tens + ones
    }

}

function digitName(digit) {
    switch(digit) {
        case 0: return ""
        case 1: return "one"
        case 2: return "two"
        case 3: return "three"
        case 4: return "four"
        case 5: return "five"
        case 6: return "six"
        case 7: return "seven"
        case 8: return "eight"
        case 9: return "nine"
    }
}

function tensName(digit) {
    switch(digit) {
        case 2: return "twenty"
        case 3: return "thirty"
        case 4: return "fourty"
        case 5: return "fifty"
        case 6: return "sixty"
        case 7: return "seventy"
        case 8: return "eighty"
        case 9: return "ninety"
    }
}

window.numberName = numberName
window.parseNumberName = parseNumberName

})();
