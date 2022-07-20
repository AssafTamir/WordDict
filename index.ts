class Dict {

    charArray: Dict[]
    isWord: boolean
    constructor() {
        this.charArray = []
        // for (let i = 0; i < 26; i++) {
        //     this.charArray[i]= null
        // }
        this.isWord=false
    }
    add (s: string){
        if (s.length > 0) {
            const index = s.charCodeAt(0) - "A".charCodeAt(0)
            if (this.charArray[index] == null)
                this.charArray[index] = new Dict()
            this.charArray[index].add(s.slice(1))
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
dict.add("Assaf".toUpperCase())
dict.add("Assaf".toUpperCase())
dict.add("Tamir".toUpperCase())
console.log(dict.toString())