function timer() {
    return function(target:any, propertyKey:any , descriptor:any)  {
        let oldFunc = descriptor.value;
        descriptor.value = function (){
            const start = Date.now();
            let result = oldFunc.apply(this, arguments);
            console.log("====>"+propertyKey+" took "+( Date.now() - start) +"ms");
            return result;
        }
    }
}

const fs = require('fs');
class Dict {

    charArray: Dict[]
    isWord: boolean
    constructor() {
        this.charArray = []
        this.isWord=false
    }
    // @ts-ignore
    @timer()
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

    private addInternal (s: string){
        if (s.length > 0) {
            const index = s.charCodeAt(0) - "A".charCodeAt(0)
            if (this.charArray[index] == null)
                this.charArray[index] = new Dict()
            this.charArray[index].addInternal(s.slice(1))
        }
        else
          this.isWord = true
    }
    // @ts-ignore
    @timer()
    contains(s: string): boolean {
        if (s.length > 0)
            return this.isWord
        const index = s.toUpperCase().charCodeAt(0) - "A".charCodeAt(0)
        if (this.charArray[index] == null)
            return false
        return this.charArray[index].contains(s.slice(1))
    }

    toString() : string {
        let all :string[] = []
        this.allWords(all,"")
        return all.toString()
    }

    allWords(all: string[], s: string): void {
        if (this.isWord)
            all.push(s)

        for (let i = 0; i < this.charArray.length; i++)
            if (this.charArray[i] != null)
                this.charArray[i].allWords(all, s+ String.fromCharCode(i+ "A".charCodeAt(0)))
    }
}

//let dict = new Dict()
//dict.loadFile('words.txt')
//dict.add("Assaf")
//dict.add("Assaf")
//dict.add("Tamir")
//console.log(dict.contains("Tamir"))
//console.log(dict.toString())