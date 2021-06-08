import Ball from './ball'


	class Field{
		private div: HTMLDivElement = document.createElement('div')
		private ball = new Ball
		private marked = false

		mode = 'o'
		friends: Field[] = []
		dist = Infinity
		readonly getField: (mode:string) => Field
		readonly update: () => void


		constructor(getField:(mode:string)=>Field, update:()=>void){
			this.getField = getField
			this.update = update
			this.initHTML()
		}

		getColor(){
			if(this.mode == 'x')
				return this.ball.getColor()
			else
				return 'none'
		}


		initHTML(){
			this.div.className = 'field'
			this.div.onclick = this.click.bind(this)
			this.div.onmouseover = this.mouseOver.bind(this)

			this.div.append(this.ball.getHTML())
		}

		getMode():string{
			return this.mode
		}

		moveTo(dest:Field){
			dest.getPreviousInPath().map((field, index) => {
				field.getHTML().style.backgroundColor=this.ball.getColor()
				setTimeout(()=>{field.getHTML().style.backgroundColor = ""}, 30*index)
			})
			this.setMode('o')
			dest.setMode('x')
			this.ball.copyTo(dest.ball)
			this.update()
		}

		getBall(){
			return this.ball
		}

		setMode(mode:string, debug:boolean = false):void{

			let duplicate = this.getField(mode)

			if(mode == 's'){
				if(duplicate)
					duplicate.setMode('x')

				this.ball.mark()
				this.mode = mode
				this.propagateDistance()
			}
			else if(mode == 'm' && duplicate)
				duplicate.setMode('o')

			else if(mode == 'x' && this.mode == 's'){
				this.unmarkAll()
				this.resetDistances()
				this.ball.hide()
			}

			this.mode = mode

			if(debug){
				this.div.innerHTML = mode
				this.div.appendChild(this.ball.getHTML())
			}

			if(mode == 'o' || mode == 'm')
				this.ball.hide()
			else
				this.ball.show()
		}


		click(){
			if(this.mode == 'x'){
				let prev = this.getField('s')
				if(prev)
					prev.setMode('x')

				if(this.friends.map(i => i.mode).indexOf('o') != -1)
					this.setMode('s')
			}
			else if(this.mode == 's')
				this.setMode('x')
			
			else if(this.mode == 'o' || this.mode == 'm'){
				this.setMode('m')

				if(this.getPreviousInPath().length){
					let s = this.getField('s')
					s.unmarkAll()
					s.moveTo(this)
					s.resetDistances()
				}
			}
		}


		mouseOver(){
			this.unmarkAll()

			if(this.mode != 'o')
				return

			if(this.getField('s') != null){
				let prev = this.getField('m')
				if(prev)
					prev.setMode('o')

				this.setMode('m')
				this.getPreviousInPath().forEach(i => i.mark())
			}
		}


		mark(){
			this.marked = true
			this.div.className = 'marked-field'
		}


		unmarkAll(){
			let s = this.getField('s')
			if(s)
				s.unmarkNext()
		}

		unmarkNext(recursivly:boolean = true){
			this.div.className = 'field'
			this.marked = false

			for(let i of this.friends)
				if(i.marked)
					i.unmarkNext(recursivly)
		}


		getHTML(){
			return this.div
		}

		calcDistance(){

			if(this.mode == 's')
				this.dist = 0
				
			for(let i of this.friends)
				if(i.dist < this.dist)
					this.dist = i.dist + 1
		}
		
		resetDistances(){
			for(let i of this.friends)
				if(i.dist < Infinity){
					i.dist = Infinity
					i.resetDistances()
				}
		}
		
		propagateDistance(root:boolean = true){
			if(root)
				this.dist = 0

			for(let i of this.friends)
				if(i.mode == 'o' || i.mode == 'm')
					if(i.dist > this.dist){
						i.dist = this.dist + 1
						i.propagateDistance(root=false)
					}
		}


		getPreviousInPath(): Field[]{
			if(this.dist == Infinity)
				return []

			if(this.mode == 's')
			   return [this]

			let path: Field[] = []

			for(let i of this.friends)
				if(i.dist == this.dist -1){
					path = i.getPreviousInPath()
					path.push(this)
					break
				}

			if(path.length == 0) return []
			if(path[0].mode != 's') return []

			return path
		}
	}

export default Field