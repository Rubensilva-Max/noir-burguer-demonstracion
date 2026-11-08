// NOIR BURGER — personalize o número do WhatsApp antes de publicar.
const WHATSAPP_NUMBER = "55DDNUMEROAQUI"; // Exemplo: 5585999999999 (somente números)

const products = {
  classic: {name:"Noir Classic", price:32.90},
  truffle: {name:"Black Truffle", price:39.90},
  smoke: {name:"Double Smoke", price:36.90},
  fries: {name:"Batata Noir", price:18.90},
  onion: {name:"Onion Rings", price:16.90},
  soda: {name:"Refri Lata", price:7.00}
};
const cart = {};
const drawer = document.getElementById("cart-drawer");
const overlay = document.getElementById("cart-overlay");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");
const money = n => n.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});

function openCart(){drawer.classList.add("open");overlay.classList.add("open");document.body.style.overflow="hidden"}
function closeCart(){drawer.classList.remove("open");overlay.classList.remove("open");document.body.style.overflow=""}
document.getElementById("open-cart").addEventListener("click",openCart);
document.getElementById("close-cart").addEventListener("click",closeCart);
overlay.addEventListener("click",closeCart);
document.getElementById("order-now").addEventListener("click",openCart);

function addProduct(id){
  if(!cart[id]) cart[id]=0;
  cart[id]++;
  renderCart();
  const toast=document.getElementById("toast");
  toast.textContent=products[id].name+" adicionado à sacola";
  toast.classList.add("show");
  setTimeout(()=>toast.classList.remove("show"),1700);
}
function changeQty(id,delta){
  cart[id]=(cart[id]||0)+delta;
  if(cart[id]<=0) delete cart[id];
  renderCart();
}
function renderCart(){
  const ids=Object.keys(cart);
  const count=ids.reduce((sum,id)=>sum+cart[id],0);
  const total=ids.reduce((sum,id)=>sum+products[id].price*cart[id],0);
  cartCount.textContent=count;
  cartTotal.textContent=money(total);
  if(!ids.length){cartItems.innerHTML='<div class="empty-cart">Sua sacola está vazia.<br><span>Escolha algo especial no cardápio.</span></div>';return}
  cartItems.innerHTML=ids.map(id=>`<div class="cart-line"><div><h4>${products[id].name}</h4><p>${money(products[id].price)} cada</p></div><div class="qty-controls"><button aria-label="Diminuir" data-action="minus" data-id="${id}">−</button><b>${cart[id]}</b><button aria-label="Aumentar" data-action="plus" data-id="${id}">＋</button></div></div>`).join("");
}
document.querySelectorAll(".add-button").forEach(btn=>btn.addEventListener("click",()=>addProduct(btn.dataset.id)));
cartItems.addEventListener("click",e=>{
  const btn=e.target.closest("button[data-action]");
  if(!btn)return;
  changeQty(btn.dataset.id,btn.dataset.action==="plus"?1:-1);
});

document.getElementById("categories").addEventListener("click",e=>{
  const btn=e.target.closest(".category");if(!btn)return;
  document.querySelectorAll(".category").forEach(b=>b.classList.remove("active"));
  btn.classList.add("active");
  document.querySelectorAll(".product-card").forEach(card=>{
    card.hidden=btn.dataset.category!=="todos"&&card.dataset.category!==btn.dataset.category;
  });
});

document.getElementById("checkout").addEventListener("click",()=>{
  const ids=Object.keys(cart);
  if(!ids.length){alert("Adicione pelo menos um produto à sacola.");return}
  const name=document.getElementById("customer-name").value.trim();
  const type=document.getElementById("order-type").value;
  const address=document.getElementById("customer-address").value.trim();
  if(!name){alert("Digite seu nome para continuar.");return}
  if(type==="Delivery"&&!address){alert("Informe o endereço para delivery.");return}
  if(WHATSAPP_NUMBER.includes("DDNUMEROAQUI")){alert("Antes de publicar, configure o número do WhatsApp no arquivo script.js.");return}
  const total=ids.reduce((sum,id)=>sum+products[id].price*cart[id],0);
  let message=`Olá! Meu nome é ${name}. Gostaria de fazer um pedido na NOIR BURGER.%0A%0A`;
  ids.forEach(id=>{message+=`${cart[id]}x ${products[id].name} — ${money(products[id].price*cart[id])}%0A`});
  message+=`%0ATotal: ${money(total)}%0ARecebimento: ${type}`;
  if(type==="Delivery")message+=`%0AEndereço: ${address}`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`,"_blank");
});

const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target)}});
},{threshold:.12});
document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));

// Em celulares que economizam dados, o navegador pode bloquear autoplay. O poster continua visível.
const heroVideo=document.querySelector(".hero-video");
heroVideo.addEventListener("error",()=>{heroVideo.style.display="none"});
