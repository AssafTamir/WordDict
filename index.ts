import * as buffer from "buffer";

const fs = require('fs');
class Dict {

    charArray: Dict[]
    isWord: boolean
    constructor() {
        this.charArray = []
        this.isWord=false
    }
    loadFile(file: string){
        const data = fs.readFileSync(file,{encoding:'utf8', flag:'r'});

        const arr = data.toString().replace(/\r\n/g,'\n').split('\n');
        for(let i of arr) {
            this.add(i)
        }
    }

    add (s: string){
        this.addInternal(s.toUpperCase().trim())
    }

    addInternal (s: string){
        if (s.length > 0) {
            const index = s.charCodeAt(0) - "A".charCodeAt(0)
            if (this.charArray[index] == null)
                this.charArray[index] = new Dict()
            this.charArray[index].addInternal(s.slice(1))
        }
        else
          this.isWord = true
    }
    contains(s: string): boolean {
        if (s.length > 0)
            return this.isWord
        const index = s.charCodeAt(0) - "A".charCodeAt(0)
        if (this.charArray[index] == null)
            return false
        return this.charArray[index].contains(s.slice(1))
    }
    toString = () : string => {
        let all :string[] = []
        this.allWords(all,"")
        return all.toString()
    }
    allWords = (all: string[], s: string): void => {
        if (this.isWord)
            all.push(s)

        for (let i = 0; i < this.charArray.length; i++)
            if (this.charArray[i] != null)
                this.charArray[i].allWords(all, s+ String.fromCharCode(i+ "A".charCodeAt(0)))
    }
}
let dict = new Dict()
dict.loadFile('words.txt')
dict.add("Assaf".toUpperCase())
dict.add("Assaf".toUpperCase())
dict.add("Tamir".toUpperCase())
console.log(dict.toString())