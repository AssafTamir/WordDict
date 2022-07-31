//const input = require('prompt-sync')()



function timer() {
    return function(target:any, propertyKey:any , descriptor:any)  {
        const oldFunc = descriptor.value;
        descriptor.value = function (){
            const start = Date.now();
            const result = oldFunc.apply(this, arguments);
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
        for(const i of arr) {
            this.add(i)
        }
    }

    add (s: string){
        this.addInternal(s.trim())
    }

    private addInternal (s: string){
        if (s.length > 0) {
            const index = s.charCodeAt(0)
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
        const index = s.charCodeAt(0)
        if (this.charArray[index] == null)
            return false
        return this.charArray[index].contains(s.slice(1))
    }

    toString() : string {
        const all :string[] = []
        this.allWords(all,"")
        return all.toString()
    }

    allWords(all: string[], s: string): void {
        if (this.isWord)
            all.push(s)

        for (let i = 0; i < this.charArray.length; i++)
            if (this.charArray[i] != null)
                this.charArray[i].allWords(all, s+ String.fromCharCode(i))
    }

    // @ts-ignore
    @timer()
    startWith(all: string[], s: string): void {
        let curr : Dict = this
        for (let i = 0; i < s.length; i++) {
            if(curr == null)
                return;
            const index = s.charCodeAt(i)
            curr=curr.charArray[index]
        }
        curr.allWords(all, s)
    }
}

let dict = new Dict()
dict.loadFile('words.txt')
dict.add("Assaf")
console.log('start')
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';


dotenv.config();

const app: Express = express();
const port = 22222;
interface WordTable{
    id:string,
    list:string[]
}
app.use(express.json()) ;
app.get('/:id', (req: Request, res: Response) => {
    const all :string[] = [];
    let id = req.params.id;
    dict.startWith(all, id);
    let ret: WordTable = {
        id: id,
        list: all
    }
    res.send(ret);
});

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});


//
// while (true){
//     const all :string[] = [];
//     const  word = input("\n#> ");
//     if (word == "Quit") break;
//     dict.startWith(all, word);
//     console.log(all.toString())
//     console.log("\nCount: " + all.length)
// }


