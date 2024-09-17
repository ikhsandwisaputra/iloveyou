const Keyboard = {
    elements: {
        main: null,
        keysContainer: null,
        keys: [],
        display: null // Untuk menampilkan huruf di atas keyboard
    },

    eventHandlers: {
        oninput: null,
        onclose: null
    },

    properties: {
        value: "",
        capsLock: false,
        typingSpeed: 100, // Default kecepatan ketik dalam milidetik per huruf
        typingText: "" // Kalimat yang akan diketik otomatis
    },
    
    startAutoTyping(text, speed, callback) {
        this.properties.typingText = text;
        this.properties.typingSpeed = speed;
        this.properties.value = ""; // Mulai dengan teks kosong
        
        let currentIndex = 0;
        
        const typeNextCharacter = () => {
            if (currentIndex < this.properties.typingText.length) {
                const nextChar = this.properties.typingText[currentIndex];
                this.properties.value += nextChar;
                this._triggerEvent("oninput");
                this._showKeyPressed(nextChar); // Tampilkan huruf yang sedang diketik
                currentIndex++;
                setTimeout(typeNextCharacter, this.properties.typingSpeed);
            } else {
                console.log("Typing finished.");
                callback();
            }
        };
        
        typeNextCharacter();
        
       
    },
    
    
    init() {
        // Create main elements
        this.elements.main = document.createElement("div");
        this.elements.keysContainer = document.createElement("div");
        this.elements.display = document.createElement("div"); // Display element
    
        // Setup main elements
        this.elements.main.classList.add("keyboard", "keyboard--hidden");
        this.elements.keysContainer.classList.add("keyboard__keys");
        this.elements.display.classList.add("keyboard__display"); // Tambahkan kelas display
    
        this.elements.keysContainer.appendChild(this._createKeys());
        this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");
    
        // Add display element to the DOM
        this.elements.main.appendChild(this.elements.display);
        this.elements.main.appendChild(this.elements.keysContainer);
        document.body.appendChild(this.elements.main);
    
        // Dapatkan elemen input atau textarea
        const inputElement = document.querySelector(".use-keyboard-input");
    
        // Mulai pengetikan otomatis saat halaman dimuat
        this.startAutoTyping("\"Do you think I have forgotten ? \n Do you think I have forgotten ?\n Do you think I have forgotten \n About you ? ", 150, () => {
            // Setelah selesai mengetik, jadikan textarea read-only
            inputElement.setAttribute("readonly", true);
            bloomFlower(); // Fungsi yang dijalankan setelah pengetikan selesai
        });
        
        
    
        // Update value di input atau textarea setiap kali ada perubahan teks
        this.eventHandlers.oninput = (currentValue) => {
            inputElement.value = currentValue;
        };
    
        function bloomFlower() {
            if (document.body.classList.contains('not-loaded')) {
                document.body.classList.remove("not-loaded");
                document.querySelector('.reloadBtn').textContent = 'Reload Page';
            } else {
                location.reload();
            }
        }
    },
    
   
    
    
  
    
        
    _createKeys() {
        const fragment = document.createDocumentFragment();
        const keyLayout = [
            "1", "2", "3", "4", "5", "6", "7", "8", "9", "0","backspace",
            "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
            "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter",
            "done", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?",
            "space"
        ];

        // Creates HTML for an icon
        const createIconHTML = (icon_name) => {
            return `<i class="material-icons">${icon_name}</i>`;
        };

        keyLayout.forEach(key => {
            const keyElement = document.createElement("button");
            const insertLineBreak = ["backspace", "p", "enter", "?"].indexOf(key) !== -1;

            // Add attributes/classes
            keyElement.setAttribute("type", "button");
            keyElement.classList.add("keyboard__key");

            switch (key) {
                case "backspace":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("backspace");

                    keyElement.addEventListener("click", () => {
                        this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
                        this._triggerEvent("oninput");
                        this._showKeyPressed("⌫"); // Tampilkan backspace
                    });

                    break;

                case "caps":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
                    keyElement.innerHTML = createIconHTML("keyboard_capslock");

                    keyElement.addEventListener("click", () => {
                        this._toggleCapsLock();
                        keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock);
                        this._showKeyPressed("⇪"); // Tampilkan capslock
                    });

                    break;

                case "enter":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("keyboard_return");

                    keyElement.addEventListener("click", () => {
                        this.properties.value += "\n";
                        this._triggerEvent("oninput");
                        this._showKeyPressed("⏎"); // Tampilkan enter
                    });

                    break;

                case "space":
                    keyElement.classList.add("keyboard__key--extra-wide");
                    keyElement.innerHTML = createIconHTML("space_bar");

                    keyElement.addEventListener("click", () => {
                        this.properties.value += " ";
                        this._triggerEvent("oninput");
                        this._showKeyPressed("␣"); // Tampilkan spasi
                    });

                    break;

                case "done":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--dark");
                    keyElement.innerHTML = createIconHTML("check_circle");

                    keyElement.addEventListener("click", () => {
                        this.close();
                        this._triggerEvent("onclose");
                    });

                    break;

                default:
                    keyElement.textContent = key.toLowerCase();

                    keyElement.addEventListener("click", () => {
                        this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
                        this._triggerEvent("oninput");
                        this._showKeyPressed(this.properties.capsLock ? key.toUpperCase() : key.toLowerCase()); // Tampilkan huruf yang ditekan
                    });

                    break;
            }

            fragment.appendChild(keyElement);

            if (insertLineBreak) {
                fragment.appendChild(document.createElement("br"));
            }
        });

        return fragment;
    },

    _showKeyPressed(key) {
        this.elements.display.textContent = key;
        this.elements.display.style.display = "block";

        // Sembunyikan huruf setelah 1 detik
        setTimeout(() => {
            this.elements.display.style.display = "none";
        }, 1000);
    },

    _triggerEvent(handlerName) {
        if (typeof this.eventHandlers[handlerName] == "function") {
            this.eventHandlers[handlerName](this.properties.value);
        }
    },

    _toggleCapsLock() {
        this.properties.capsLock = !this.properties.capsLock;

        for (const key of this.elements.keys) {
            if (key.childElementCount === 0) {
                key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
            }
        }
    },

    open(initialValue, oninput, onclose) {
        this.properties.value = initialValue || "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
    
        // Jika ingin keyboard tidak terlihat, gunakan kelas keyboard--invisible
        this.elements.main.classList.add("keyboard--invisible"); // Sembunyikan keyboard
    
        // Jika ingin menampilkan keyboard, gunakan ini:
        // this.elements.main.classList.remove("keyboard--hidden", "keyboard--invisible"); 
    },

    close() {
        this.properties.value = "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.add("keyboard--hidden");
    }
    
};

window.addEventListener("DOMContentLoaded", function () {
    Keyboard.init();
});

(function () {
    const numOfFlowers = 10;
    const growGarden = () => {
        function getRandomArbitrary(min, max) {
            return Math.round(Math.random() * (max - min)) + min;
        }

        let positions = [];

        function getNum() {
            let pos = getRandomArbitrary(0, 100);
            for (let x = 0; x < positions.length; x++) {
                if (pos > positions[x] - 3 && pos < positions[x] + 3) {
                    return false;
                }
            }
            positions.push(pos);
        }

        while (positions.length < numOfFlowers) {
            getNum();
        }

        let more = setInterval(function () {
            let flwr = document.createElement('div');
            let dim = getRandomArbitrary(30, 80); // ukuran bunga
            let leftPos = positions[0];
            positions.shift();

            flwr.classList.add('sunflwr');
            flwr.innerHTML = `<div class="sunflwr__leaf--left"></div>
                              <div class="sunflwr__leaf--right"></div>
                              <div class="sunflwr__stem"></div>
                              <div class="sunflwr__center"></div>
                              <div class="sunflwr__pedal--1"></div>
                              <div class="sunflwr__pedal--2"></div>
                              <div class="sunflwr__pedal--3"></div>
                              <div class="sunflwr__pedal--4"></div>
                              <div class="sunflwr__pedal--5"></div>
                              <div class="sunflwr__pedal--6"></div>
                              <div class="sunflwr__pedal--7"></div>
                              <div class="sunflwr__pedal--8"></div>
                              <div class="sunflwr__pedal--9"></div>
                              <div class="sunflwr__pedal--10"></div>
                              <div class="sunflwr__pedal--11"></div>
                              <div class="sunflwr__pedal--12"></div>`;

            // Pastikan posisi absolut agar tidak menyebabkan overflow pada body
            flwr.style.position = 'absolute';
            flwr.style.left = `${leftPos}vw`;
            flwr.style.height = `${dim}vmin`;
            flwr.style.width = `${dim}vmin`;
            flwr.style.zIndex = 100 - dim;

            // Bunga hanya muncul di bagian bawah (60-90% dari tinggi layar)
            flwr.style.top = `${getRandomArbitrary(60, 90)}vh`; // Bunga hanya di atas tanah (bawah layar)

            flwr.style.filter = `saturate(${getRandomArbitrary(70, 100)}%) brightness(${getRandomArbitrary(80, 150)}%)`;

            // Append bunga ke container
            document.querySelector('.flower-container').appendChild(flwr);
        }, 150);

        setTimeout(function () {
            window.clearInterval(more);
        }, numOfFlowers * 150);
    };

    // Tambahkan div container untuk bunga, overflow tetap di-hidden
    const flowerContainer = document.createElement('div');
    flowerContainer.classList.add('flower-container');
    flowerContainer.style.position = 'absolute';
    flowerContainer.style.top = '0';
    flowerContainer.style.left = '0';
    flowerContainer.style.width = '100vw';
    flowerContainer.style.height = '100vh';
    flowerContainer.style.overflow = 'hidden'; // Overflow hidden di sini
    document.body.appendChild(flowerContainer);

    document.body.addEventListener('click', () => {
        growGarden();
    });
})();


