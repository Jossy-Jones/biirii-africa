const { v4: uuidv4 } = require('uuid');

const helpers = require('../helpers/helpers');


module.exports = function Cart(cart) {
    this.items = cart.items || {};
    this.totalItems = cart.totalItems || 0;
    this.totalPrice = cart.totalPrice || 0;
    this.sumOfExtrasPrice = 0;
    this.productOrderKey = null;

    this.add = function(item, superItem, qty = 1, size = null) {
        // `id` is a random generated string used to identify an item added to the cart
        //  The`id` does not represent the product, sub product or extra id in the database
        let id = uuidv4().toUpperCase().slice(0, 8);

        let productOrderKey = null;

        if (qty <= 0) throw new Error("Cart quantity cant be less than 1 when adding to cart");

        console.trace("superItems=>"+superItem);

        // Computing discount price
        discountPercentage = superItem.discount_percent/100;
        item.price = item.price - (discountPercentage * item.price);
        item.noDiscountPrice = item.price;

        let cartItem = this.items[id];
        if (!cartItem) {
            cartItem = this.items[id] = {
                item: item, 
                superItem: superItem, 
                qty: 0, 
                price: 0,
                size : size,
                id : id
            };
        }

        cartItem.qty = cartItem.qty + qty;
        cartItem.price = (cartItem.item.price *  cartItem.qty);
        this.totalItems++;
        this.totalPrice += cartItem.price;

        console.log(cartItem.price);
        console.log(this.totalPrice);
    };

    this.remove = function(id) {
        cart.totalItems -= cart.items[id].qty;
        cart.totalPrice -= cart.items[id].price;
        delete this.items[id];
        delete cart.items[id];
    };
    
    this.getItems = function() {
        let arr = [];
        for (let id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    };

    this.setQty = function (id, qty) {


        let sumOfItemExtrasPrice = 0;

        let sumOfItemExtrasPriceWithQty = 0;

        let oldPricePerProduct = (cart.items[id].price - sumOfItemExtrasPrice)/cart.items[id].qty; 

          console.log(oldPricePerProduct);  


        
        cart.totalPrice -=  ((oldPricePerProduct * cart.items[id].qty) + sumOfItemExtrasPrice); 


        cart.items[id].qty = parseInt(qty); 


        cart.items[id].price = sumOfItemExtrasPrice + (cart.items[id].qty * oldPricePerProduct) ; 

        console.log("cartItem[id]Price =>"+cart.items[id].price);

     
        cart.totalPrice += cart.items[id].price; 

        console.log("totalPrice =>"+cart.totalPrice);
 
    };

    this.getData = function () {
       return  {
            products : this.getItems(),
            totalItems: this.totalItems,
            totalPrice: this.totalPrice
        }        
    }


    this.getItemById  = function (id) {
        let arrayOfItems = this.getItems();
        let item = null;
        for (let i = 0; i < arrayOfItems.length; i++) {
          if (arrayOfItems[i].id == id) {
            item = arrayOfItems[i];

            console.trace("DODO=>"+item.price);
            break;
          }
        }
        return item;
    }


    this.getItemsForOrder = function(order_key, discount_code = null) {
        let items = this.getItems();
        let arr  = [];   
        for (var i = 0; i < items.length; i++) {
            arr[i] = []

            let productOrderKey = (items[i].item.product_order_key) ? items[i].item.product_order_key : null;

            arr[i].push(null);
            arr[i].push(order_key);
            arr[i].push(productOrderKey);
            arr[i].push (items[i].superItem.id);
            arr[i].push (items[i].item.id);
            arr[i].push(Date.now());
            arr[i].push(items[i].price);
            arr[i].push(items[i].qty);
            arr[i].push(items[i].size);
            arr[i].push(discount_code);
            arr[i].push(items[i].superItem.discount_percent);
        }       
        return arr;
    }



    this.getExtraOrders = function() {
        let items = this.getItems();
        let arr  = [];
        let extras = [];  

        for (var i = 0; i < items.length; i++) {
            arr[i] = (items[i].extras);
        }

        let val = [];
        let temp_array = [];

        for (var a =  arr.length -1; a>=0; a--) {
            for (var i =  arr[a].length - 1; i >=0; i--) {
                temp_array=[
                    null, 
                    arr[a][i].product_order_key, 
                    arr[a][i].price, 
                    Date.now(),
                    arr[a][i].name
                ];
                val.push(temp_array);
            }
        }
        return val;
    }



    this.setSize = function (id, size) { 
         cart.items[id].size = size;
    }

};
