import Field from './field'
import {measureTime, logTime} from './decorators'

interface Checker {
    scorePoints: (amount:number) => void;
    data:Field[][];
    options:string[];
}


class Arbiter implements Checker{
    
    scorePoints: (amount:number) => void
    data:Field[][]
    options:string[]

    constructor(incrementPoints: (amount:number) => void, options:string[]){
        this.scorePoints = incrementPoints
        this.options = options
    }

    convert():number[][]{
        let tab:number[][] = []

        for(let i of this.data)
            tab.push(i.map(i => {return this.options.indexOf(i.getColor())}))

        return tab
    }

    @measureTime('logArbiter')
    log(){
        console.table(this.convert())
    }


    static uniq(...fields:Field[][]){
        let uniq:Field[] = []

        for(let j of fields)
            for(let i of j)             
                if(uniq.indexOf(i) == -1)
                    uniq.push(i)

        return uniq
    }

    @logTime
    check(fields:Field[][]){
        this.data = fields
        //this.log()
        let found:Field[] = Arbiter.uniq(
            this.checkHorizontal(),
            this.checkVertical(),
            this.checkDiagonalyDesc(),
            this.checkDiagonalyAsc()
        )
        this.scorePoints(found.length)
        for(let i of found)
            i.setMode('o')

        /**/this.log()
    }


    checkHorizontal(){
        let found:Field[] = []
        for(let i of this.data)
            for(let s of this.getSame(i))
                found.push(s)

        return found
    }

    
    checkVertical(){
        let found:Field[] = []

        for(let i in this.data[0]){
            let col: Field[] = []
            for(let j in this.data)
                col.push(this.data[j][i])
            
            for(let s of this.getSame(col))
                found.push(s)
        }            
        return found
    }


    checkDiagonalyDesc(){
        let found:Field[] = []

        for(let x = 0; x < this.data.length; x++){
            let row:Field[] = []
            for(let i:number = 0; i + x < this.data.length && i < this.data[0].length; i++)
                row.push(this.data[x+i][i])

            for(let i of this.getSame(row))
                found.push(i)
        }
        
        for(let x = 0; x < this.data[0].length; x++){
            let row:Field[] = []
            for(let i:number = 0; x + i < this.data[0].length && i < this.data.length; i++)
                row.push(this.data[i][x+i])

            for(let i of this.getSame(row))
                found.push(i)
        }
        return found
    }


    checkDiagonalyAsc(){
        let found:Field[] = []

        for(let x = 0; x < this.data.length; x++){
            let row:Field[] = []
            for(let i:number = 0; x - i >= 0 && i < this.data[0].length; i++)
                row.push(this.data[x-i][i])

            for(let i of this.getSame(row))
                found.push(i)
        }

        for(let x = 0; x < this.data[0].length; x++){
            let row:Field[] = []
            for(let i:number = 0; this.data.length-i-1 >= 0 && x+i < this.data[0].length; i++)
                row.push(this.data[this.data.length-1-i][x+i])


            for(let i of this.getSame(row))
                found.push(i)
        }

        return found
    }
    

    getSame(fields:Field[]){
        if(fields.length < 5) return []

        let found: Field[] = []

        for(let i = 0; i < fields.length -4; i++){
            let row = []

            for(let j = i; j < i+5; j+=1)
                row.push(fields[j])

            if(this.areSame(row))
                for(let i of row)
                    found.push(i)
        }

        return found
    }

    areSame(fields: Field[]){
        if(fields.length < 5) return false
        let color = fields[fields.length -1].getColor()
        if(color == 'none') return false

        for(let i = 0; i < fields.length -1; i+=1)
            if(fields[i].getColor() != color)
                return false


        return true
    }

}

export default Arbiter