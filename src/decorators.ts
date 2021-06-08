export function measureTime(message:string = ' '){
    return function(target:any, key: string, desc: PropertyDescriptor){
        const org = desc.value
            desc.value = function(...args:any[]){   
            let random = Math.random() 
 
            console.time('time' + key + random)   
            const result = org.apply(this, args)
            console.log('Time spent on', message, ': ')
            console.timeEnd('time' + key + random)  

            return result
        }
        return desc
    }
}


export function logTime(target:any, key: string, desc: PropertyDescriptor){
    const org = desc.value
        desc.value = function(...args:any[]){  
        let random = Math.random() 
     
        console.time('time' + key + random)        
        const result = org.apply(this, args)
        console.log('Time spent on function: ', key)
        console.timeEnd('time' + key + random)  

        return result
    }
    return desc
}   