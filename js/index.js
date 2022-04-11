'use strict';

const icon = document.querySelector('.header__icon');
const opend = document.querySelector('.buy');
const x = document.querySelector('.buy__close');

const openedBuy = () => {
    opend.style = 'display: block';

    x.addEventListener('click', function() {
        opend.style = 'display: none';   
    })    
}

icon.addEventListener('click', openedBuy);

const items = document.querySelectorAll('.item');
const allImg = []; // url картинок
const names = [];  // Наименование товара
const prises = [];  // Цены

items.forEach(e => {
    allImg.push(e.childNodes[1].childNodes[1].src)
    names.push(e.childNodes[3].innerHTML)
    prises.push(e.childNodes[7].innerHTML)
})

names.forEach((e, i, arr) => {
    if (!(typeof(e) === 'string')) return;
    arr[i] = e.replace(/\n/g, "");
})

//Готовый массив с наименования товара
const allname = names.map(e => {
    return e.trim()
}) 

//Готовый массив с ценами
const intermediatePrice = prises.map(e => {
    
    return e.trim()
}) 

const allPrice = intermediatePrice.map(e => e.slice(6,10));

const btn = document.querySelectorAll('.item__button');
const buy = document.querySelector('.buy');
const iconFullPrice = document.querySelector('.buy__fullprice');

const lastPrice = [];

const cart = event => {
    // Меняем текст кнопки при добавлении в корзину
    event.target.textContent = 'Товар в корзине';

    // Проверяем корзину на наличие данного товара, если он есть повторно не добавляем
    if (document.querySelector('.article-' + event.target.dataset.article)) {
        return;    
    }

    // Создаем саму корзину и управление ее, внешний интерфейс
    const cartCounter = document.querySelector('.header__counter');
    cartCounter.style = 'display: flex;';
    cartCounter.textContent++;

    const cartText = document.querySelector('.buy__text');
    cartText.style = 'display: none';

    const cartWrapper = document.createElement('div');
    cartWrapper.classList.add('buy__wrapper', 'article-' + event.target.dataset.article); 
    buy.appendChild(cartWrapper);

    let cartImg = document.createElement('img');
    cartImg.src = allImg[event.target.dataset.article];
    cartImg.classList.add('buy__img');
    cartWrapper.appendChild(cartImg);

    let cartName = document.createElement('span');
    cartName.textContent = allname[event.target.dataset.article];
    cartName.classList.add('buy__name');
    cartWrapper.appendChild(cartName);

    let cartPrice = document.createElement('span');
    cartPrice.textContent = `Цена ${allPrice[event.target.dataset.article]} P`;
    cartPrice.classList.add('buy__price');
    cartWrapper.appendChild(cartPrice);

    let cartForm = document.createElement('form');
    cartWrapper.appendChild(cartForm);

    let cartAmount = document.createElement('input');
    cartAmount.type = 'number';
    cartAmount.classList.add('buy__amount');
    cartAmount.value = 1;
    cartAmount.disabled = true;
    cartForm.appendChild(cartAmount);

    let cartDelete = document.createElement('span');
    cartDelete.classList.add('buy__delete');
    cartWrapper.appendChild(cartDelete);

    let arrUp = document.createElement('div');
    arrUp.classList.add('buy__arrUp');
    arrUp.textContent = '>';
    cartForm.prepend(arrUp);

    let arrDown = document.createElement('div');
    arrDown.classList.add('buy__arrDown');
    cartForm.append(arrDown);
    arrDown.textContent = '>';

    

    // Высчитываем общую сумму позиций в корзине
    const nowPrice = allPrice[event.target.dataset.article];

    lastPrice.push(+nowPrice);
    let summLastPrice = lastPrice.reduce((total, amount) => total + amount); 
    iconFullPrice.textContent = `Итоговая сумма: ${summLastPrice}`;
    iconFullPrice.style = 'display: block';

    //Логика подсчета общей суммы в зависимости от количества товара по нажатию стрелки вверх
    arrUp.addEventListener('click', function() {
        cartAmount.value ++;
        cartPrice.textContent = `Цена ${nowPrice * cartAmount.value} P`;

        lastPrice.push(+nowPrice);

        summLastPrice = lastPrice.reduce((total, amount) => total + amount);
        iconFullPrice.textContent = `Итоговая сумма: ${summLastPrice}`;
    })

    //Логика подсчета общей суммы в зависимости от количества товара по нажатию стрелки вниз
    arrDown.addEventListener('click', function() {
        cartAmount.value --;

        if (+cartAmount.value === 0) {
            cartAmount.value = 1;
            lastPrice.push(nowPrice);
        }

        cartPrice.textContent = `Цена ${nowPrice * cartAmount.value} P`;

        lastPrice.pop();

        if (lastPrice.length === 0) {
            lastPrice.push(0);
        }

        summLastPrice = lastPrice.reduce((total, amount) => total + amount);
        iconFullPrice.textContent = `Итоговая сумма: ${summLastPrice}`;
    })

    cartDelete.addEventListener('click', function() {

        //Функционал удаление элемента корзины
        const countingIterations = [];

        for (let i = 0; i < lastPrice.length; i++) {
            if (lastPrice[i] === +nowPrice) {
                countingIterations.push(lastPrice[i]);
                lastPrice.splice(i, 1, 0);
            } if (countingIterations.length === +cartAmount.value) {
                break;
            }
        }
        
        // Интерфейс удаления
        const deleteWrapper = document.querySelector('.article-' + event.target.dataset.article);
        deleteWrapper.remove();
        
        //Убираем количество товара с иконки корзины при удалении товара
        +cartCounter.textContent--;
        +cartCounter.textContent < 1 ? cartCounter.style = 'display: none;' : cartCounter.style = 'display: flex;';

        //Проверяем массив на наличие в нем элементов и если их нет добавляем 0, что бы работал reduce
        if (lastPrice.length === 0) {
            lastPrice.push(0);
        }

        //Высчитываем общую сумму и выводим ее 
        summLastPrice = lastPrice.reduce((total, amount) => total + amount);
        iconFullPrice.textContent = `Итоговая сумма: ${summLastPrice}`;

        //Очищаем массив от лишних нулей 
        lastPrice.forEach((e, i, arr) => {
            if (e === 0) {
                arr.splice(i, 1);
            }
        })

        if(!document.querySelector('.buy__wrapper')) {
            cartText.style = 'display: block';
            iconFullPrice.style = 'display: none';
        }

        // Смена текста на кнопке при удалении товара их корзины
        event.target.textContent = 'Купить';
    })

};

btn.forEach(e => {
    e.addEventListener('click', cart)
})

