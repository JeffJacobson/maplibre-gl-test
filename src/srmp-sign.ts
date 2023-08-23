export class SrmpSign extends HTMLElement {
  public routeElement: HTMLElement;
  public srmpElement: HTMLElement;
  /**
   * Creates a new instance of this element.
   */
  constructor() {
    super();

    // element.innerHTML = `<div>${routeLocation.Route}</div><div>${routeLocation.Srmp}${routeLocation.Back ? "B" : ""}</div>`;
    const shadow = this.attachShadow({
      mode: "open",
    });

    const style = document.createElement("style");

    // this.style.backgroundColor = "green";
    // this.style.color = "white";
    // this.style.borderColor = "white";
    // this.style.borderWidth = "0.1em";
    // this.style.borderStyle = "solid";
    // this.style.borderRadius = "0.5em";
    // this.style.padding = "0.5em";

    shadow.appendChild(style);

    this.routeElement = document.createElement("div");
    this.srmpElement = document.createElement("div");

    shadow.append(this.routeElement, this.srmpElement);
  }

  static get observedAttributes() {
    return ["route", "srmp"];
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    console.log("attribute changed", { name, oldValue, newValue });
    if (name === "route") {
      this.routeElement.textContent = newValue;
    } else if (name === "srmp") {
      this.srmpElement.textContent = newValue;
    }
  }
}

customElements.define("srmp-sign", SrmpSign);

export default SrmpSign;