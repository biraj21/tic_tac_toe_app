export default class MyToast extends HTMLElement {
    constructor() {
        super();

        this.timeoutDuration = Number(this.getAttribute("timeout")) || 2000;
    }

    show(message) {
        if (this.timeout) {
            this.reset();
            setTimeout(this.show.bind(this, message), 100);
            return;
        }

        this.innerText = message;
        this.style.display = "block";
        this.classList.add("fade-in");
        this.timeout = setTimeout(this.close.bind(this), this.timeoutDuration);
    }

    close() {
        this.classList.remove("fade-in");
        this.classList.add("fade-out");
        this.onanimationend = this.reset.bind(this);
    }

    reset() {
        this.classList.remove("fade-in");
        this.classList.remove("fade-out");
        this.onanimationend = null;
        this.style.display = "none";
        clearTimeout(this.timeout);
        this.timeout = null;
    }
}
