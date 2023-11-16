function resize(element: any, arg: string[]) {
		const right = arg.includes("right") ? (() => {
			var el: any = document.createElement('div')
			el.direction = 'east'
			el.classList.add('grabber')
			el.classList.add('right')
			return el
		})() : null
		
		const left = arg.includes("left") ? (() => {
			var el:any = document.createElement('div')
			el.direction = 'west'
			el.classList.add('grabber')
			el.classList.add('left')
			return el;
		})() : null
		
		const top: any = arg.includes("top") ? (() => {
			var el: any = document.createElement('div')
			el.direction = 'north'
			el.classList.add('grabber')
			el.classList.add('top')
			return el;
		})() : null
		
		const bottom = arg.includes("") ? (() => {
			var el: any = document.createElement('div')
			el.direction = 'south'
			el.classList.add('grabber')
			el.classList.add('bottom')
			return el;
		})() : null
		
		const topLeft = arg.includes("") ? (() => {
			var el: any = document.createElement('div')
			el.direction = 'northwest'
			el.classList.add('grabber')
			el.classList.add('top-left')
			return el;
		})() : null
		
		const topRight = arg.includes("") ? (() => {
			var el: any = document.createElement('div')
			el.direction = 'northeast'
			el.classList.add('grabber')
			el.classList.add('top-right')
		return el;
		})() : null
		
		const bottomLeft = arg.includes("") ? (() => {
			var el: any = document.createElement('div')
			el.direction = 'southwest'
			el.classList.add('grabber')
			el.classList.add('bottom-left')
		return el;
		})() : null
		
		const bottomRight = arg.includes("") ? (() => {
			var el: any = document.createElement('div')
			el.direction = 'southeast'
			el.classList.add('grabber')
			el.classList.add('bottom-right')
			return el;
		})() : null
				
		const grabbers = [right, left, top, bottom, topLeft, topRight, bottomLeft, bottomRight]
		
		let active: any = null, initialRect: any = null, initialPos: any = null
		
		grabbers.forEach(grabber => {
			if (grabber) {
				element.appendChild(grabber)
				grabber.addEventListener('mousedown', onMousedown)
				grabber.addEventListener('dblclick', (e: any) => {
					console.log(element.style.width)
					if (parseInt(element.style.width) <= 15) {
						element.style.width = "max-content"
					} else {
						element.style.width = window.getComputedStyle(element).getPropertyValue("min-width")
					}
				})
			}
		})
		
		function onMousedown(event: any) {
			active = event.target
			const rect = element.getBoundingClientRect()
			const parent = element.parentElement.getBoundingClientRect()
			
			initialRect = {
				width: rect.width,
				height: rect.height,
				left: rect.left - parent.left,
				right: parent.right - rect.right,
				top: rect.top - parent.top,
				bottom: parent.bottom - rect.bottom
			}
			initialPos = { x: event.pageX, y: event.pageY }
			active.classList.add('selected')
		}
		
		function onMouseup(event: any) {
			if (!active) return
			
			active.classList.remove('selected')
			active = null
			initialRect = null
			initialPos = null
		}
		
		function onMove(event: any) {
			if (!active) return
			
			const direction = active.direction
			let delta
			
			if (direction.match('east')) {
				delta = event.pageX - initialPos.x
				element.style.width = `${initialRect.width + delta}px`				
			}
			
			if (direction.match('west')) {
				delta = initialPos.x - event.pageX
				element.style.left = `${initialRect.left - delta}px`
				element.style.width = `${initialRect.width + delta}px`
			}
			
			if (direction.match('north')) {
				delta = initialPos.y - event.pageY
				element.style.top = `${initialRect.top - delta}px`
				element.style.height = `${initialRect.height + delta}px`
			}
			
			if (direction.match('south')) {
				delta = event.pageY - initialPos.y
				element.style.height = `${initialRect.height + delta}px`
			}
		}
		
		window.addEventListener('mousemove', onMove)	
		window.addEventListener('mouseup', onMouseup)	
		
		return {
			destroy() {
				window.removeEventListener('mousemove', onMove)
				window.removeEventListener('mousemove', onMousedown)
				
				grabbers.forEach(grabber => {
					if (grabber)
					element.removeChild(grabber)
				})
			}
		}
	}

export default resize