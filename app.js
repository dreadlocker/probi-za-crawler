require("isomorphic-fetch");

const mongoArr = [];

function asyncFunction(item) {
    return fetch(item)
        .then((responce) => {
            return responce.text();
        })
        .then((html) => {
            require('./dom-parser')(html);
            const image = $('li.active a img').attr('src'),
                brandAndModel = $('h1.product-name-main span').text(),
                price = $('li.product-price-primary').text().substr(1, $('li.product-price-primary').text().indexOf('*')) || $('li.product-price-primary').text().substr(1),
                info1 = $('.product-description-content-text ul li').next().next().html(),
                info2 = $('.product-description-content-text ul li').next().next().next().next().next().html(),
                info3 = $('.product-description-content-text ul').next().next().children().html();

            mongoArr.push({
                image: image,
                brandAndModel: brandAndModel,
                price: +price,
                info1: info1,
                info2: info2,
                info3: info3,
            })
        })
}

var arr = [
    'http://www.argos.co.uk/product/6869410',
    'http://www.argos.co.uk/product/6317883',
    'http://www.argos.co.uk/product/7252844',
];
let requests = arr.map((item) => {
    return Promise.resolve(asyncFunction(item));
});

Promise.all(requests)
    .then((res) => console.log(mongoArr));