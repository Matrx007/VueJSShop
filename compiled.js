console.log("test");
var unit = " €";
var items = {};
var cart = [];
var cartTotal = 0;
var Item = /** @class */ (function () {
    function Item(div) {
        this.div = div;
        this.thumbnailSrc = findElementByClassName("thumbnail", this.div).getAttribute("src");
        // Meta-data
        this.name = getItemProperty(this, "name");
        this.price = parseFloat(getItemProperty(this, "price"));
        // Quantity selection elements
        this.quantityElement = findElementByClassName("quantity", this.div);
        this.totalElement = findElementByClassName("total", this.div);
        this.addElement = findElementByClassName("add", this.div);
        this.incrementElement = findElementByClassName("increment", this.div);
        this.decrementElement = findElementByClassName("decrement", this.div);
        // Shopping cart elements
        this.removeFromCartElement = null;
        // Current shopping cart info
        this.quantityInCart = 0;
        // Button functions
        var _this = this;
        // "Add to cart" button
        console.log(this.addElement);
        this.addElement.onclick = function () {
            // Add object to cart
            addToCart(_this);
            // Reset quantity & total
            _this.reset();
        };
        // Increment button
        this.incrementElement.onclick = function () {
            // Increment quantity by 1
            _this.setQuantity(_this.getQuantity() + 1);
            // Re-calculate total price
            _this.setTotal(_this.price * _this.getQuantity());
        };
        // Decrement button
        this.decrementElement.onclick = function () {
            // Decrement quantity by 1
            _this.setQuantity(Math.max(1, _this.getQuantity() - 1));
            // Re-calculate total price
            _this.setTotal(_this.price * _this.getQuantity());
        };
        this.reset();
    }
    Item.prototype.createRemoveFromCartButton = function (div) {
        console.log("Creating remove button for " + this.name);
        console.log(div);
        this.removeFromCartElement = findElementByClassName("remove", div);
        var _this = this;
        this.removeFromCartElement.onclick = function () {
            // Remove HTML element from cart
            removeHTMLItemFromCart(_this);
            // Subtract item price from cart's total
            cartTotal -= _this.price * _this.quantityInCart;
            // Reset the quantity inside cart
            _this.quantityInCart = 0;
            // Update cart's total 
            updateTotal();
        };
    };
    // Reset quantity to 1 and total sum accordingly
    Item.prototype.reset = function () {
        this.setQuantity(1);
        this.setTotal(this.price);
    };
    // ### GET & SET QUANTITY
    Item.prototype.setQuantity = function (quantity) { this.quantityElement.innerHTML = quantity.toFixed(0); };
    Item.prototype.getQuantity = function () { return parseInt(this.quantityElement.innerHTML); };
    // ### GET & SET TOTAL
    Item.prototype.setTotal = function (total) { this.totalElement.innerHTML = total.toFixed(2) + unit; };
    Item.prototype.getTotal = function () { return parseFloat(this.quantityElement.innerHTML); };
    return Item;
}());
// Finds all elements inside "items" DIV and stores them as Item objects
function loadItemsFromHTML() {
    // DIV where all the items' DIVs are located
    var itemListRaw = document.getElementById("items").getElementsByClassName("item");
    // Iterate thru every item
    var name;
    var item;
    for (var i = 0; i < itemListRaw.length; i++) {
        if (!(itemListRaw instanceof HTMLDivElement)) {
            console.log("skipped");
        }
        ;
        name = itemListRaw[i].querySelector(".name").innerHTML;
        console.log("found");
        item = new Item(itemListRaw[i]);
        items[name] = item;
    }
}
// ### CART SYSTEM FUNCTIONS ###
function addToCart(item) {
    // Avoid adding 0 amount of items to cart
    if (item.getQuantity() == 0)
        return;
    // Check if this item is already in cart
    if (cartContains(item)) {
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
function removeHTMLItemFromCart(item) {
    var elements = document.getElementById("cart")
        .getElementsByClassName("list")[0]
        .getElementsByClassName("item");
    var name;
    for (var i = 0; i < elements.length; i++) {
        name = elements[i].querySelector(".name").innerHTML;
        if (items[name] == item) {
            elements[i].remove();
            break;
        }
    }
    item.removeFromCartElement = null;
}
function addHTMLItemToCart(item) {
    var root = document.getElementById("cart").getElementsByClassName("list")[0].children[0];
    var div = root.appendChild(createCartItem(item));
    item.createRemoveFromCartButton(div);
}
function createCartItem(item) {
    var cartItemTemplate = "\n    <div class=\"item grow noselect\">\n        <img class=\"thumbnail\" src=\"" + item.thumbnailSrc + "\">\n        <div class=\"info\">\n            <h1 class=\"name\">" + item.name + "</h1>\n            <div class=\"quantity-info\">\n                <p class=\"quantity\">" + item.quantityInCart + "</p>\n                <p>&nbsp;\u00D7&nbsp;</p>\n                <p class=\"price\">" + (item.price + unit) + "</p>\n            </div>\n        </div>\n\n        <div class=\"remove\">\n            <svg fill=\"#000000\" xmlns=\"http://www.w3.org/2000/svg\"  viewBox=\"0 0 24 24\" width=\"96px\" height=\"96px\">    <path d=\"M 10 2 L 9 3 L 4 3 L 4 5 L 7 5 L 17 5 L 20 5 L 20 3 L 15 3 L 14 2 L 10 2 z M 5 7 L 5 20 C 5 21.1 5.9 22 7 22 L 17 22 C 18.1 22 19 21.1 19 20 L 19 7 L 5 7 z\"/></svg>\n        </div>\n    </div>";
    var element = document.createElement("li");
    element.innerHTML = cartItemTemplate;
    return element;
}
// Check if cart contains specified Item
function cartContains(item) {
    var found = false;
    cart.forEach(function (cartItem) {
        if (cartItem == item) {
            found = true;
            return;
        }
    });
    return found;
}
function updateTotal() {
    var totalElement = document.getElementById("cart").querySelector(".total");
    console.log("total element: ");
    console.log(totalElement);
    totalElement.innerHTML = "TOTAL: " + cartTotal.toFixed(2) + unit;
}
// ### HELPER FUNCTIONS ###
// Find element with specified class name and return it's value
function getDIVProperty(div, property) {
    // Find all elements with said property
    var foundElements = div.getElementsByClassName(property);
    // If more than 1 found, abort
    if (foundElements.length > 1) {
        console.log("More than one \"" + property + "\" elements were found in: ");
        console.log(foundElements);
        console.log("in: ");
        console.log(div);
        return null;
    }
    // If 0 found, abort
    if (foundElements.length == 0) {
        console.log("No \"" + property + "\" elements found in: ");
        console.log(div);
        return null;
    }
    // Return the content of that element
    return foundElements[0].innerHTML;
}
// Find element with specified class name and return it's value
function getItemProperty(item, property) {
    // Find all elements with said property
    var foundElements = item.div.getElementsByClassName(property);
    // If more than 1 found, abort
    if (foundElements.length > 1) {
        console.log("More than one \"" + property + "\" elements were found in: ");
        console.log(foundElements);
        console.log("in: ");
        console.log(item);
        return null;
    }
    // If 0 found, abort
    if (foundElements.length == 0) {
        console.log("No \"" + property + "\" elements found in: ");
        console.log(item);
        return null;
    }
    // Return the content of that element
    return foundElements[0].innerHTML;
}
// Find element with specified class name
function getItemElement(item, property) {
    // Find all elements with said property
    var foundElements = item.div.getElementsByClassName(property);
    // If more than 1 found, abort
    if (foundElements.length > 1) {
        console.log("More than one \"" + property + "\" elements were found in: ");
        console.log(foundElements);
        console.log("in: ");
        console.log(item);
        return null;
    }
    // If 0 found, abort
    if (foundElements.length == 0) {
        console.log("No \"" + property + "\" elements found in: ");
        console.log(item);
        return null;
    }
    // Return found element
    if (foundElements instanceof HTMLElement) {
        return foundElements[0];
    }
    // If foudn element is not a HTML element
    if (foundElements.length == 0) {
        console.log("\"" + property + "\" is not an HTML element!");
        console.log(item);
        return null;
    }
}
function findElementByClassName(classNames, root) {
    var elements = root.getElementsByClassName(classNames);
    if (elements.length > 0) {
        return elements[0];
    }
    var found;
    for (var i = 0; i < root.children.length; i++) {
        found = findElementByClassName(classNames, root.children[i]);
        if (found != null) {
            return found;
        }
    }
    return null;
}
