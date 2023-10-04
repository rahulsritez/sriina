var addtocart = function (product_id){
	console.log(product_id);
	const cart_product = JSON.parse(localStorage.getItem('cart_product'));
	if(cart_product){
		cart_product.push(product_id);
		localStorage.setItem('cart_product',JSON.stringify(cart_product));
	} else {
		localStorage.setItem('cart_product',JSON.stringify([product_id]));
	}

}

module.exports = addtocart;


/*let carts = document.querySelectorAll('.add-cart');
for(let i=0; i < carts.length; i++){
    carts[i].addEventListener('click', ()=>{
        cartNumbers();
    })
}

function cartNumbers(){
    localStorage.getItem('cartNumbers',1);
}*/