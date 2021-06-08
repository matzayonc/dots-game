import Field from './field'
import Ball from './ball'
import Arbiter from './arbiter'
import {measureTime} from './decorators'



interface PathNode {
    v: number
    prev: {
        x: number
        y: number
    }
}

interface Coords{
    x: number
    y: number
}


class Board{
    private arbiter = new Arbiter(this.incrementPoints.bind(this), ['none'].concat(Ball.COLORS))
    private tab: Field[][] = []
    private points: 0
    readonly root = document.getElementById('board')
    readonly next = document.getElementById('next')
    private newBalls:Ball[] = []

    static SIZE = {
        x: 9,
        y: 9
    }
    static BALLSPERMOVE = 3

    constructor(){
        this.clear()
        this.events()
        
        this.events()
    }

    incrementPoints(amount: number){
        this.points += amount
    }


    nextStep(){
        this.check()

        for(let i of this.newBalls)
            if(!this.addBall(i)){
                this.lost()
                return
            }

        this.next.innerHTML = ""
        this.newBalls = []

        for(let i = 0; i < Board.BALLSPERMOVE; i+=1){
            let ball = new Ball
            ball.show()
            this.next.appendChild(ball.getHTML())
            this.newBalls.push(ball)
        }
    }


    private lost(){
        this.newBalls = []
        alert(`Koniec, zdobyto: ${this.points} punktów!`)
        this.clear()
    }

    private addBall(ball:Ball):boolean{

        let free = this.getFields('o')
        if(free.length <= 1)
            return false

        let field = free[Math.floor(Math.random() * free.length)]
        let dest = field.getBall()
        ball.copyTo(dest)
        field.setMode('x')
        return true
    }

    private getRandomField(mode = ''){
        let c: Coords
        do{
            c = {
                x: Math.floor(Math.random() * Board.SIZE.x),
                y: Math.floor(Math.random() * Board.SIZE.y)
            }
        }while(mode == '' || this.tab[c.x][c.y].mode != mode)

        return this.tab[c.x][c.y]
    }


    private events(){
        document.addEventListener('keypress', e =>{
            if(e.key == 'L')
                this.logDistances()
        })
    }


    private getFields(mode:string):Field[] {
        let list:Field[] = []

        for(let j of this.tab)
            for(let i of j)
                if(i.mode == mode)
                    list.push(i)
                        
        return list
    }


    private getField(mode:string):Field {
        if(mode != 'm' && mode != 's') return null

        let list:Field[] = this.getFields(mode)

        if(list.length > 1)
            throw 'more than one s or m';
        if(list.length == 1)
            return list[0]
        else
            return null
    }


    private clear() : void{
        this.points = 0
        this.tab = []
        this.root.innerHTML = ""

        for(let i = 0; i < Board.SIZE.y; i++){
            this.tab.push([])
            for(let j = 0; j < Board.SIZE.x; j++){
                this.tab[i].push(new Field(this.getField.bind(this), this.nextStep.bind(this)))
                this.root.appendChild(this.tab[i][j].getHTML())
            }
        }

        this.setFriends()
        this.nextStep()
        this.nextStep()
    }


    private setFriends(): void{
        for(let j:number = 0; j < this.tab.length; j+=1)
            for(let i:number = 0; i < this.tab[0].length; i+=1){

                this.tab[i][j].friends = []

                if(i > 0)
                    this.tab[i][j].friends.push(this.tab[i-1][j])
                
                if(j > 0)
                    this.tab[i][j].friends.push(this.tab[i][j-1])

                if(i < Board.SIZE.x -1)
                    this.tab[i][j].friends.push(this.tab[i+1][j])

                if(j < Board.SIZE.y -1)
                    this.tab[i][j].friends.push(this.tab[i][j+1])
            }
    }

    @measureTime('Time to log Distances:')
    private logDistances(){
        let distances: number[][] = []

        for(let j:number = 0; j < this.tab.length; j+=1){
            distances.push([])
            for(let i:number = 0; i < this.tab[0].length; i+=1)
                distances[j].push(this.tab[j][i].dist)
        }

        console.table(distances)
        console.log(this.getField('m').getPreviousInPath())
    }

    @measureTime('Time for checking row:')
    private check(){
        this.arbiter.check(this.tab)
    }
}

export default Board