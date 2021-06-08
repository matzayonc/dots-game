
    class Ball{
        private circle: HTMLDivElement
        private color: string
        private className = 'hidden-ball'

        static COLORS = [
            'blue',
            'red',
            'yellow',
            'violet',
            'green',
            'LawnGreen',
            'cyan'
        ]

        static CLASSES = [
            'ball',
            'marked-ball',
            'hidden-ball'
        ]

        constructor(){
            this.color = Ball.COLORS[Math.floor(Math.random()*Ball.COLORS.length)]
            this.initHTML()
            this.hide()
        }

        copyTo(ball:Ball){
            ball.show(this.getColor())
            this.hide()
        }
        
        getHTML(){
            return this.circle
        }

        getColor(){
            return this.color
        }


        changeClass(className:string = 'ball'){            
            let ok = false
            for(let i of Ball.CLASSES)
                if(i == className)
                    ok = true

            if(ok)
                this.className = className
            else
                throw 'wrong class name'

            this.circle.className = this.className
        }

        mark(){
            this.changeClass('marked-ball')
        }


        private initHTML(){
            this.circle = document.createElement('div')
            this.changeClass('ball')
            this.show()
        }

        show(color=''){
            if(this.circle.className == 'hidden-ball')
                this.changeClass('ball')

            if(color)
                this.color = color

            this.circle.style.backgroundColor = this.color
        }

        hide(){
            this.changeClass('hidden-ball')
        }
    }

export default Ball