class Tooltip extends HTMLElement {
    constructor() {
        super();

        // initialize container
        this._tooltipContainer;
        this._tooltipText = 'Dummy text';

        // whether you can access shadowdom tree from outside component 
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                div {
                    background-color: black;
                    color: white;
                    position: absolute;
                    z-index: 10;

                    /*this is to style pop up*/
                    padding: 0.15rem;
                    border-radius: 3px; 
                    box-shadow: 1px 1px 6px rgba(0,0,0,0.26);

                    /*positioning*/
                    top: 1.5rem;
                    left: 0.75rem;
                }

                .highlight {
                    background-color: red;
                }

                ::slotted(.slotted-highlight) {
                    background-color: purple;
                }

                .icon {
                    background: black;
                    color: white; 
                    padding: 0.15rem 0.5rem;
                    text-align: center;
                    border-radius: 50%;
                }

                :host {
                    border: 5px solid black;
                }

                :host(.conditional-rendering) {
                    background-color: red;
                }

                :host-context(.host-context) {
                    background-color: orange;
                }

                :host(.variable-ex) {
                    background-color: var(--color-primary, blue);
                }
                
            </style>
            <slot>Default</slot><span class="icon"> ?</span>
        `;
    }

    connectedCallback() {
        if (this.hasAttribute('text')) {
            this._tooltipText = this.getAttribute('text');
        }

        const tooltipIcon = this.shadowRoot.querySelector('.icon');

        tooltipIcon.textContent = ' (?)';
        tooltipIcon.addEventListener('mouseenter', this._showTooltip.bind(this));
        tooltipIcon.addEventListener('mouseleave', this._hideTooltip.bind(this));

        this.shadowRoot.appendChild(tooltipIcon);
        this.style.position = 'relative';
    }

    // this is a convention indicating this is a method only calling within class
    _showTooltip() {
        this._tooltipContainer = document.createElement('div');
        this._tooltipContainer.textContent = this._tooltipText;

        this.shadowRoot.appendChild(this._tooltipContainer);
    }

    _hideTooltip() {
        this.shadowRoot.removeChild(this._tooltipContainer);
    }
}

customElements.define('my-tooltip', Tooltip);