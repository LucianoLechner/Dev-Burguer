const menu = document.getElementById('menu')
const cartBtn = document.getElementById('cart-btn')
const cartModal = document.getElementById('cart-modal') 
const cartItemsContainer = document.getElementById('cart-items')
const cartTotal = document.getElementById('cart-total')
const checkOutBtn = document.getElementById('checkout-btn')
const closeModalBtn = document.getElementById('close-modal-btn')
const cartCounter = document.getElementById('cart-count')
const addressInput = document.getElementById('address')
const addressWarn = document.getElementById('address-warn')

let cart = []; // ARRAY PARA RECEBER OS OBJETOS ITENS

let counter = 0; // VARIAVEL PARA QTD DE ITENS INSERIDOS NO CARRINHO

cartBtn.addEventListener('click', function(){ // ABRINDO O CARRINHO ALTERANDO O DISPLAY 
    updateCartModal(); //CHAMADA DA FUNCAO
    cartModal.style.display = "flex"
})

closeModalBtn.addEventListener('click', function(){ // FECHANDO O MODAL AO CLICAR NO BOTAO FECHAR 
    cartModal.style.display = "none"
})

// FECHANDO O CARRINHO AO CLICAR FORA DO MODAL 
cartModal.addEventListener('click', function(event){
    if(event.target === cartModal){ // TARGET = ONDE O MOUSE CLICAR, NESSE CASO, NO CONTAINER QUE CONTEM O ID CART-MODAL
        cartModal.style.display = "none" 
    }
})

menu.addEventListener('click', function(event){
    // console.log(event.target)

    let parentButton = event.target.closest(".add-to-cart-btn") // CLOSEST PEGA O ELEMENTO PAI QUE CONTEM A CLASSE .ADD-TO-CART-BTN E OS ELEMENTOS QUE ELE POSSUI DENTRO 

    if(parentButton){ // SE CLICAR NO ELEMENTO
        const name = parentButton.getAttribute('data-name') // COLETA O ATRIBUTO CRIADO NO HTML DATA-NAME
        const price = parseFloat(parentButton.getAttribute('data-price')).toFixed(2) // COLETA O ATRIBUTO CRIADO NO HTML DATA-PRICE
    
        addToCart(name, price) //CHAMADA DA FUNCAO

        counter += 1; // AO CLICAR NO ADD CARINHO SOMA O VALOR DA QUANTIDADE DE ITENS
    }

    cartCounter.innerHTML = counter
})

function addToCart(name, price){ // FUNCAO PARA ADICIONAR OS ITENS NO ARRAY
    const existingItem = cart.find(item => item.name === name ) // A FUNCAO FIND PERCORRE O ARRAY, E SE O ITEM "NAME" E VERIFICA SE O ITEM EXISTE.

    if(existingItem){
        existingItem.qtd += 1; // SE O ITEM EXISTIR, ELE ALTERA SOMENTE A QUANTIDADE SOMANDO O VALOR DA QUANTIDADE + 1
    } else{
        cart.push({ // SE NAO EXISTIR ADICIONA O ITEM COM A QUANTIDADE 1
            name,
            price,
            qtd: 1, 
        })
    }

    updateCartModal(); // CHAMADA DA FUNCAO
}

function updateCartModal(){ 
    cartItemsContainer.innerHTML = "" // RESETA O VALOR DA VARIAVEL
    let total = 0;
    
    cart.forEach(item =>{ // PASSA POR TODOS OS ITENS DENTRO DO ARRAY 
        const cartItemElement = document.createElement("div") // CRIA UM ELEMENTO VIA JS DENTRO DA ESTRUTURA HTML
        cartItemElement.classList.add('flex', 'justify-between', 'mb-4', 'flex-col')

        cartItemElement.innerHTML = ` 
            <div class="flex items-center justify-between border-b border-green-500">
                <div>
                    <p class="font-bold">${item.name}</p>
                    <p>${item.qtd} X</p>
                    <p class="font-medium mt-2">R$ ${item.price}</p>
                </div>       
                <div>
                    <button class="text-red-500 remove-btn" data-name="${item.name}">Remover</button>
                </div>
            </div>
        `
        // DENTRO DO ELEMENTO CRIADO, PASSA POR CADA ITEM DO ARRAY COM A FUNCAO FOREACH, INSERINDO A ESTRUTURA HTML ACIMA

    total += item.price * item.qtd // SOMA TOTAL DOS VALORES DOS ITENS VEZES A QUANTIDADE.

    cartItemsContainer.appendChild(cartItemElement) // ADICIONA CADA ITEM COM A ESTRUTURA DO FOREACH DENTRO DO CONTEUDO DA VARIAVEL CARTITEMS
    })

    cartTotal.textContent = 'R$ ' + total.toFixed(2) // ALTERA O VALOR TOTAL DO PEDIDO.
}

// FUNCAO PARA REMOVER O ITEM DO CARRINHO

cartItemsContainer.addEventListener('click', function(event){
    if(event.target.classList.contains('remove-btn')){ // SE O EVENTO CLICADO CONTEM A CLASSE REMOVE-BTN
        const nameRemove = event.target.getAttribute('data-name') // VAR PARA COLETAR O NOME DO ITEM
    
        removeItemCart(nameRemove); // CHAMADA DA FUNCAO
    }

})

function removeItemCart(nameRemove){
    const index = cart.findIndex(item => item.name === nameRemove) // ESSA VAR BUSCA O INDEX/POSICAO E RETORNA O OBJETO DO DATA-NAME

    if (index !== -1){ // SE O INDEX FOR DIFERENTE DE -1 (-1 SIGNIFICA QUE O ITEM NAO FOI ENCONTRADO DENTRO DO ARRAY) OU SEJA, SE O ITEM FOR ENCONTRADO
        const item = cart[index]; // SE FOR ENCONTRATO, GUARDA NA VARIAVEL O OBJETO DO DATA-NAME

        if (item.qtd > 1){ // SE A QUANTIDADE FOR MAIOR QUE 1 
            item.qtd = item.qtd -1 // SUBTRAI A QUANTIDADE
            counter -= 1;
            cartCounter.innerHTML = counter;
            updateCartModal(); // ATUALIZA O CARRINHO COM FOREACH
            return; // SE A CONDIÇÃO FOR VERDADEIRA, ENCERRA A FUNCAO.
        }
        cart.splice(index, 1) // REMOVE O OBJETO DO ARRAY COM O SPLICE 
        updateCartModal(); // ATUALIZA O CARRINHO COM FOREACH
        counter -= 1;
        cartCounter.innerHTML = counter;
    }
}

// VERIFICANDO AS CONDICOES PARA FINALIZAR O PEDIDO.

addressInput.addEventListener('input', function(event){
    let inputValue = event.target.value; // ESSA VARIAVEL LE O VALOR DO INPUT EM TEMPO REAL

    if(inputValue !== ""){ // SE O VALOR DO INPUT NAO FOR VAZIO
        addressWarn.classList.add('hidden') // ADICIONA A CLASSE HIDDEN
        addressInput.classList.remove('border-red-500') // REMOVE A BORDA VERMELHA
        return; // ENCERRA A FUNCAO
    }

})

checkOutBtn.addEventListener('click', function(){
    const restaurantIsOpen = checkRestaurantOpen();

    if ( !restaurantIsOpen){ // SE NAO ESTIVER ABERTO ( ! SIGNIFICA NEGACAO)
        Toastify({
            text: "Ops o restaurante está fechado",
            duration: 3000,
            // destination: "https://github.com/apvarun/toastify-js", // REDIRECT
            // newWindow: true, // NOVA PAG
            close: true, // PODE FECHAR
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `left`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
            background: "#ef4444",
            },
            // onClick: function(){} // Callback after click
        }).showToast(); // EXIBE O ALERTA ACIMA
        return;
    } 
    else if(cart.length === 0 ){ // SE O CARRINHO FOR VAZIO
        Toastify({
            text: "Carrinho vazio",
            duration: 3000,
            // destination: "https://github.com/apvarun/toastify-js", // REDIRECT
            // newWindow: true, // NOVA PAG
            close: true, // PODE FECHAR
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `left`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
            background: "#ef4444",
            },
            // onClick: function(){} // Callback after click
        }).showToast(); // EXIBE O ALERTA ACIMA
        return;
    } 
    else if(addressInput.value === ""){ // SE O VALOR DO INPUT FOR VAZIO
        addressWarn.classList.remove('hidden') // ADICIONA A CLASSE 
        addressInput.classList.add('border-red-500') // ADICIONA A BORDA VERMELHA
        return;
    } else {
        const cartItems = cart.map((item) =>{ // A FUNCAO MAP MAPEIA TODOS OS OBJETOS QUE EXISTEM NO ARRAY
            return (
                `${item.name} - ${item.qtd}X R$ ${item.price} / ` // NESSA PARTE A FUNCAO RETORNA OS VALORES DOS OBJETOS, FORMATANDO COMO UMA MENSAGEM DE TEXTO, QUE SERA ENVIADA PARA API DO ZAP.
            )
        }).join('') // JOIN SERVE PARA JUNTAR TODOS OS OBJETOS DO ARRAY, NÃO MOSTRA A POSIÇÃO QUE ELE ESTÁ INSERIDO, APENAS JUNTA A FORMATACAO DO MAP.

        const message = encodeURI(cartItems) // GRAVA A FORMATACAO NO MAP NA VARIAVEL INSERINDO DENTRO DE UMA API QUE IRA LEVAR A MSG PARA O ZAP.
        const tel = '5565992218653' // VAR PARA ARMAZENAR O TELEFONE PARA AONDE A MSG SERA ENVIADA

        window.open(`https://wa.me/${tel}?text=${message} Endereço: ${addressInput.value}`, "_blank")
        // ABRE UMA JANELA NO NAVEGADOR, COM O LINK FORMATADO PARA ENVIAR A MENSAGEM.  
    }

    cart = []
    counter = 0;
    cartCounter.innerHTML = counter;
    cartModal.style.display = "none";
    updateCartModal();
})

// FUNCAO PARA VERIFICAR SE O RESTAURANTE ESTÁ ABERTO;

function checkRestaurantOpen(){
    const data = new Date(); // COLETA A DATA DO DIA ATUAL 
    const hours = data.getHours(); // DENTRO DO DIA ATUAL, COLETA AS HORAS

    return hours >= 18 && hours < 23; // A FUNCAO RETORNA VERDADEIRO SE A HORA ESTIVER ENTRE AS 18 E 22
}

const spanHours = document.getElementById('date-span')
const restaurantIsOpen = checkRestaurantOpen(); // GRAVA O RETORNO DA FUNCAO

if (restaurantIsOpen){
    spanHours.classList.remove('bg-red-700')
    spanHours.classList.add('bg-green-700')
} else {
    spanHours.classList.remove('bg-green-700')
    spanHours.classList.add('bg-red-700')
}









