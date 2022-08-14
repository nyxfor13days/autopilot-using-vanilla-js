export class Controls {
	constructor(type) {
		this.left = false;
		this.backward = false;
		this.forward = false;
		this.right = false;

		switch (type) {
			case 'KEYS':
				this.#addKeyboardListener();
				break;
			case 'DUMMY':
				this.forward = true;
				break;
		}
	}

	#addKeyboardListener() {
		document.onkeydown = (event) => {
			switch (event.code) {
				case 'ArrowLeft' || 'KeyA':
					this.left = true;
					break;
				case 'ArrowDown' || 'KeyS':
					this.backward = true;
					break;
				case 'ArrowUp' || 'KeyW':
					this.forward = true;
					break;
				case 'ArrowRight' || 'KeyD':
					this.right = true;
					break;
			}
		};

		document.onkeyup = (event) => {
			switch (event.code) {
				case 'ArrowLeft' || 'KeyA':
					this.left = false;
					break;
				case 'ArrowDown' || 'KeyS':
					this.backward = false;
					break;
				case 'ArrowUp' || 'KeyW':
					this.forward = false;
					break;
				case 'ArrowRight' || 'KeyD':
					this.right = false;
					break;
			}
		};
	}
}

