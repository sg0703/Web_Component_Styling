class Modal extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                #backdrop {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100vh;
                    background: rgba(0,0,0,0.75);
                    z-index: 10;
                    opacity: 0;
                    pointer-events: none;
                }

                /* you can do this instead of commented out section below */

                :host([open]) #backdrop {
                    opacity: 1;
                    pointer-events: all;
                }

                :host([open]) #modal {
                    opacity: 1;
                    pointer-events: all;
                }

                :host([open]) #modal {
                    top: 15vh;
                }

                #modal {
                    position: fixed; 
                    top: 10vh;
                    left: 25%;
                    width: 50%;
                    z-index: 100; 
                    background: white; 
                    box-shadow: 0 2px 8px rgba(0,0,0,0.26);

                    display: flex; 
                    flex-direction: column; 
                    justify-content: space-between;

                    opacity: 0;
                    pointer-events: none;

                    transition: all 0.3s ease-out;
                }

                header {
                    padding: 1rem;
                    border-bottom: 1px solid #ccc;
                }

                ::slotted(h1) {
                    font-size: 1.25rem;
                    margin: 0;
                }

                header h1 {
                    font-size: 1.25rem;
                }

                #main {
                    padding: 1rem;
                }

                #actions {
                    border-top: 1px solid lightgray;
                    padding: 1rem;
                    display: flex; 
                    justify-content: flex-end;
                }

                #actions button {
                    margin: 0 0.25rem;
                }
            </style>
            <div id="backdrop">

            </div>
            <div id="modal">
                <header>
                    <slot name="title">Please confirm payment (default)</slot>
                </header>
                <section id="main">
                    <slot></slot>
                </section>
                <section id="actions">
                    <button id="cancel-btn">Cancel</button>
                    <button id="confirm-btn">Confirm</button>
                </section>
            </div>
        `;

        const backdrop = this.shadowRoot.querySelector('#backdrop');

        const slots = this.shadowRoot.querySelectorAll('slot');
        // this shows you the dom node that the slot points to
        // dom projection! not actually in shadow dom! 
        slots[1].addEventListener('slotchange', event => {
            console.dir(slots[1].assignedNodes());
        });

        const cancelButton = this.shadowRoot.querySelector('#cancel-btn');
        const confirmButton = this.shadowRoot.querySelector('#confirm-btn');

        backdrop.addEventListener('click', this._cancel.bind(this));

        cancelButton.addEventListener('click', this._cancel.bind(this));

        confirmButton.addEventListener('click', this._confirm.bind(this));
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (this.hasAttribute('open')) {
            this._isOpen = true;
        }
        else {
            this._isOpen = false;
        }
    }

    static get observedAttributes() {
        return ['open'];
    }

    // you can abstract a lot of complexity away by doing this!
    // you can use public properties and access them from outside (see index.html)
    open() {
        this.setAttribute('open', '');
        this._isOpen = true;
    }

    hide() {
        if (this.hasAttribute('open')) {
            this.removeAttribute('open');
        }
        this._isOpen = false;
    }

    _cancel(event) {
        this.hide();

        // composed: true allows event to leave shadowDOM
        // event is dispatched from button inside shadowDom
        // compare to below
        const cancelEvent = new Event('cancel', { bubbles: true, composed: true });
        event.target.dispatchEvent(cancelEvent);
    }

    _confirm(event) {
        // you can write event to dispatch from custom component itself
        // this does not require extra config 

        this.hide();
        const confirm = new Event('confirm');
        this.dispatchEvent(confirm);
    }
}

customElements.define('uc-modal', Modal);