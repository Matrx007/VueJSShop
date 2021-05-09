console.log("app.js loaded");

const app = Vue.createApp({
    data() {
        return {
            products: [
                {
                    "name": "Doge Backpack",
                    "thumbnail": "https://cdn.glitch.com/508e4694-cd69-4213-9c6c-536e41714521%2FDoge_Backpack.jpg?v=1607587402833",
                    "price": "39.99",
                    "addToCartCount": 0,
                    "category": "Utilities"
                },
                {
                    "name": 'Just Do It, Tomorrow" T-Shirt',
                    "thumbnail": "https://cdn.glitch.com/508e4694-cd69-4213-9c6c-536e41714521%2FJust_Do_It_Tomorrow.jpg?v=1607587403165",
                    "price": "19.99",
                    "addToCartCount": 0,
                    "category": "Clothing"
                },
                {
                    "name": 'Ok Boomer" Hoodie',
                    "thumbnail": "https://cdn.glitch.com/508e4694-cd69-4213-9c6c-536e41714521%2FOk_Boomer_Hoodie.jpg?v=1607587402784",
                    "price": "29.99",
                    "addToCartCount": 0,
                    "category": "Clothing"
                },
                {
                    "name": "Cable for AirPods",
                    "thumbnail": "https://cdn.glitch.com/508e4694-cd69-4213-9c6c-536e41714521%2FCable_For_AirPods.jpg?v=1607587410220",
                    "price": "9.99",
                    "addToCartCount": 0,
                    "category": "Utilities"
                },
                {
                    "name": "Anime Hoodie",
                    "thumbnail": "https://cdn.glitch.com/508e4694-cd69-4213-9c6c-536e41714521%2FAnime_Hoodie.png?v=1607587282505",
                    "price": "49.99",
                    "addToCartCount": 0,
                    "category": "Clothing"
                },
                {
                    "name": "Baldski Face Mask",
                    "thumbnail": "https://cdn.glitch.com/508e4694-cd69-4213-9c6c-536e41714521%2FBaldski_Mask.png?v=1607587277806",
                    "price": "29.99",
                    "addToCartCount": 0,
                    "category": "Utilities"
                },
                {
                    "name": "Peppa Gucci Doll",
                    "thumbnail": "https://cdn.glitch.com/508e4694-cd69-4213-9c6c-536e41714521%2FPeppa_Gucci_Doll.png?v=1607587284792",
                    "price": "299.99",
                    "addToCartCount": 0,
                    "category": "Niche"
                },
                {
                    "name": "Peppa Backpack",
                    "thumbnail": "https://cdn.glitch.com/508e4694-cd69-4213-9c6c-536e41714521%2FPeppa_Backpack.png?v=1607587284574",
                    "price": "69.99",
                    "addToCartCount": 0,
                    "category": "Utilities"
                },
                {
                    "name": "Pickle Rick Cap",
                    "thumbnail": "https://cdn.glitch.com/508e4694-cd69-4213-9c6c-536e41714521%2FPickle_Cap.png?v=1607587284333",
                    "price": "20.99",
                    "addToCartCount": 0,
                    "category": "Clothing"
                },
                {
                    "name": "Da Gromit Mug",
                    "thumbnail": "https://cdn.glitch.com/508e4694-cd69-4213-9c6c-536e41714521%2FDa%20Gromit%20Mug.png?v=1607587279453",
                    "price": "9.99",
                    "addToCartCount": 0,
                    "category": "Utilities"
                },
                {
                    "name": "Walter White Tote Bag",
                    "thumbnail": "https://cdn.glitch.com/508e4694-cd69-4213-9c6c-536e41714521%2FWalter_White_Bag.png?v=1607587279525",
                    "price": "14.99",
                    "addToCartCount": 0,
                    "category": "Utilities"
                },
                {
                    "name": "Peter Griffin F****ing Dies Pillow",
                    "thumbnail": "https://cdn.glitch.com/508e4694-cd69-4213-9c6c-536e41714521%2FPeter_Griffind_Dies_Pillow.png?v=1607587285813",
                    "price": "16.99",
                    "addToCartCount": 0,
                    "category": "Bedding"
                },
                {
                    "name": "Communist Socks",
                    "thumbnail": "https://cdn.glitch.com/508e4694-cd69-4213-9c6c-536e41714521%2FCommunist_Socks.png?v=1607587284738",
                    "price": "7.99",
                    "addToCartCount": 0,
                    "category": "Clothing"
                }
            ],
            cart: [],
            sorting: "Sort by name",
            reversed: false,
            category: "All"
        }
    },
    computed: {
        sortedProducts() {
            let displayProducts = [...this.products];

            switch (this.sorting) {
                case "Sort by name":
                    displayProducts.sort(this.reversed ? (a, b) => -a.name.localeCompare(b.name) : (a, b) => a.name.localeCompare(b.name));
                    break;
                case "Sort by price":
                    displayProducts.sort(this.reversed ? (a, b) => b.price - a.price : (a, b) => a.price - b.price);
                    break;
            
                default:
                    break;
            }

            if(this.category != "All") 
                displayProducts = displayProducts.filter((product) => {
                    return product.category == this.category;
                });
            
            // if(this.search != "")
            //     displayProducts = displayProducts.filter((product) => {
            //         return product.name.toLowerCase().contains(this.search.toLowerCase());
            //     });

            return displayProducts;
        }
    },
    methods: {
        
    }
});

app.mount("#app");




