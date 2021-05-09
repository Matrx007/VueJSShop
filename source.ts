console.log("test");

const unit = " €";

let items = {};
let cart = [];
let cartTotal = 0;

class Item {
    // HTML Elements
    readonly div: HTMLDivElement;
    readonly thumbnailSrc: string;
    
    // Meta-data
    readonly name: string;
    readonly price: number;
    
    // Quantity selection elements
    readonly quantityElement: Element;
    readonly totalElement: Element;
    readonly addElement: HTMLElement;
    readonly incrementElement: HTMLElement;
    readonly decrementElement: HTMLElement;
    
    // Shopping cart elements
    removeFromCartElement: HTMLElement;

    // Current shopping cart info
    public quantityInCart: number;

    public constructor(div: HTMLDivElement) {
        this.div = div;
        this.thumbnailSrc = findElementByClassName("thumbnail", this.div).getAttribute("src");

        // Meta-data
        this.name = getItemProperty(this, "name");
        this.price = parseFloat(getItemProperty(this, "price"));
        
        // Quantity selection elements
        this.quantityElement = findElementByClassName("quantity", this.div);
        this.totalElement = findElementByClassName("total", this.div);
        this.addElement = <HTMLElement> findElementByClassName("add", this.div);
        this.incrementElement = <HTMLElement> findElementByClassName("increment", this.div);
        this.decrementElement = <HTMLElement> findElementByClassName("decrement", this.div);
    
        // Shopping cart elements
        this.removeFromCartElement = null;

        // Current shopping cart info
        this.quantityInCart = 0;

        // Button functions
        let _this = this;

        // "Add to cart" button
        console.log(this.addElement);
        this.addElement.onclick = function() {
            // Add object to cart
            addToCart(_this);

            // Reset quantity & total
            _this.reset();
        };

        // Increment button
        this.incrementElement.onclick = function() {
            // Increment quantity by 1
            _this.setQuantity(_this.getQuantity() + 1);

            // Re-calculate total price
            _this.setTotal(_this.price * _this.getQuantity())
        };

        // Decrement button
        this.decrementElement.onclick = function() {
            // Decrement quantity by 1
            _this.setQuantity(Math.max(1, _this.getQuantity() - 1));

            // Re-calculate total price
            _this.setTotal(_this.price * _this.getQuantity())
        };

        this.reset();
    }

    public createRemoveFromCartButton(div: HTMLElement): void {
        console.log("Creating remove button for "+this.name);
        console.log(div);
        this.removeFromCartElement = <HTMLElement> findElementByClassName("remove", div);
        
        let _this = this;
        this.removeFromCartElement.onclick = function() {

            // Remove HTML element from cart
            removeHTMLItemFromCart(_this);
            
            // Subtract item price from cart's total
            cartTotal -= _this.price * _this.quantityInCart;
            
            // Reset the quantity inside cart
            _this.quantityInCart = 0;

            // Update cart's total 
            updateTotal();
        }
    }

    // Reset quantity to 1 and total sum accordingly
    public reset(): void {
        this.setQuantity(1);
        this.setTotal(this.price);
    }

    // ### GET & SET QUANTITY
    public setQuantity(quantity: number): void  { this.quantityElement.innerHTML = quantity.toFixed(0); }
    public getQuantity(): number                { return parseInt(this.quantityElement.innerHTML); }

    // ### GET & SET TOTAL
    public setTotal(total: number): void        { this.totalElement.innerHTML = total.toFixed(2) + unit; }
    public getTotal(): number                   { return parseFloat(this.quantityElement.innerHTML); }
}

// Finds all elements inside "items" DIV and stores them as Item objects
function loadItemsFromHTML(): void {

    // DIV where all the items' DIVs are located
    let itemListRaw: HTMLCollectionOf<Element> = document.getElementById("items").getElementsByClassName("item");

    // Iterate thru every item
    let name: string;
    let item: Item;
    for(let i = 0; i < itemListRaw.length; i++) {
        if(!(itemListRaw instanceof HTMLDivElement)) {
            console.log("skipped");
        };
        
        name = itemListRaw[i].querySelector(".name").innerHTML;
        console.log("found");
        
        item = new Item(<HTMLDivElement> itemListRaw[i]);

        items[name] = item;
    }
}

// ### CART SYSTEM FUNCTIONS ###

function addToCart(item: Item): void {
    // Avoid adding 0 amount of items to cart
    if(item.getQuantity() == 0) return;

    // Check if this item is already in cart
    if(cartContains(item)) {
        // Increment quantity in cart and reset quantity in list
        item.quantityInCart += item.getQuantity();
        cartTotal += item.getQuantity() * item.price;
    }
    // Add item to cart
    else {
        cart.push(item);

        // Set quantity in cart and reset quantity in list
        item.quantityInCart = item.getQuantity();
        cartTotal += item.getQuantity() * item.price;
    }

    removeHTMLItemFromCart(item);
    addHTMLItemToCart(item);

    updateTotal();
}

function removeHTMLItemFromCart(item: Item): void {
    let elements: HTMLCollectionOf<Element> = 
            document.getElementById("cart")
                .getElementsByClassName("list")[0]
                .getElementsByClassName("item");
    
    let name: string;
    for(let i = 0; i < elements.length; i++) {
        name = elements[i].querySelector(".name").innerHTML;

        if(items[name] == item) {
            elements[i].remove();
            break;
        }
    }

    item.removeFromCartElement = null;
}

function addHTMLItemToCart(item: Item): void {
    let root =  <HTMLElement> document.getElementById("cart").getElementsByClassName("list")[0].children[0];

    let div = root.appendChild(createCartItem(item));

    item.createRemoveFromCartButton(div);
}

function createCartItem(item: Item): HTMLElement {
    let cartItemTemplate = `
    <div class="item grow noselect">
        <img class="thumbnail" src="${item.thumbnailSrc}">
        <div class="info">
            <h1 class="name">${item.name}</h1>
            <div class="quantity-info">
                <p class="quantity">${item.quantityInCart}</p>
                <p>&nbsp;×&nbsp;</p>
                <p class="price">${item.price + unit}</p>
            </div>
        </div>

        <div class="remove">
            <svg fill="#000000" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" width="96px" height="96px">    <path d="M 10 2 L 9 3 L 4 3 L 4 5 L 7 5 L 17 5 L 20 5 L 20 3 L 15 3 L 14 2 L 10 2 z M 5 7 L 5 20 C 5 21.1 5.9 22 7 22 L 17 22 C 18.1 22 19 21.1 19 20 L 19 7 L 5 7 z"/></svg>
        </div>
    </div>`;

    let element = document.createElement("li");
    element.innerHTML = cartItemTemplate;
    return element;
}

// Check if cart contains specified Item
function cartContains(item: Item): boolean {
    let found: boolean = false;
    cart.forEach((cartItem) => {
        if(cartItem == item) {
            found = true;
            return;
        }
    });

    return found;
}


function updateTotal(): void {
    let totalElement = document.getElementById("cart").querySelector(".total");

    console.log("total element: ");
    console.log(totalElement);

    totalElement.innerHTML = "TOTAL: " + cartTotal.toFixed(2) + unit;
}
// ### HELPER FUNCTIONS ###

// Find element with specified class name and return it's value
function getDIVProperty(div: HTMLDivElement, property: string): string {

    // Find all elements with said property
    let foundElements: HTMLCollectionOf<Element> = div.getElementsByClassName(property);

    // If more than 1 found, abort
    if(foundElements.length > 1) {
        console.log("More than one \""+property+"\" elements were found in: ");
        console.log(foundElements);
        console.log("in: ");
        console.log(div);
        return null;
    }

    // If 0 found, abort
    if(foundElements.length == 0) {
        console.log("No \""+property+"\" elements found in: ");
        console.log(div);
        return null;
    }

    // Return the content of that element
    return foundElements[0].innerHTML;
}

// Find element with specified class name and return it's value
function getItemProperty(item: Item, property: string): string {

    // Find all elements with said property
    let foundElements: HTMLCollectionOf<Element> = item.div.getElementsByClassName(property);

    // If more than 1 found, abort
    if(foundElements.length > 1) {
        console.log("More than one \""+property+"\" elements were found in: ");
        console.log(foundElements);
        console.log("in: ");
        console.log(item);
        return null;
    }

    // If 0 found, abort
    if(foundElements.length == 0) {
        console.log("No \""+property+"\" elements found in: ");
        console.log(item);
        return null;
    }

    // Return the content of that element
    return foundElements[0].innerHTML;
}

// Find element with specified class name
function getItemElement(item: Item, property: string): HTMLElement {

    // Find all elements with said property
    let foundElements: HTMLCollectionOf<Element> = item.div.getElementsByClassName(property);

    // If more than 1 found, abort
    if(foundElements.length > 1) {
        console.log("More than one \""+property+"\" elements were found in: ");
        console.log(foundElements);
        console.log("in: ");
        console.log(item);
        return null;
    }

    // If 0 found, abort
    if(foundElements.length == 0) {
        console.log("No \""+property+"\" elements found in: ");
        console.log(item);
        return null;
    }

    // Return found element
    if(foundElements instanceof HTMLElement) {
        return <HTMLElement> foundElements[0];
    }

    // If foudn element is not a HTML element
    if(foundElements.length == 0) {
        console.log("\""+property+"\" is not an HTML element!");
        console.log(item);
        return null;
    }
}


function findElementByClassName(classNames: string, root: Element): Element {
    let elements = root.getElementsByClassName(classNames);

    if(elements.length > 0) {
        return elements[0];
    }
    let found: Element;
    for(let i = 0; i < root.children.length; i++) {
        found = findElementByClassName(classNames, root.children[i]);

        if(found != null) {
            return found;
        }
    }

    return null;
}