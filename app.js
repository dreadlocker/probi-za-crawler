"use strict";

const express = require("express"),
    init = (data) => {
        const app = express(),
            url1 = "http://www.argos.co.uk/webapp/wcs/stores/servlet/Browse?s=Price%3A+Low+-+High&storeId=10151&catalogId=25051&langId=110&c_1=1%7Ccategory_root%7CTechnology%7C33006169&c_2=2%7C33006169%7CTelevisions%2Band%2Baccessories%7C33008651&c_3=3%7Ccat_33008651%7CTelevisions%7C33017148&authToken=",
            url2 = "http://www.argos.co.uk/static/Browse/c_1/1%7Ccategory_root%7CTechnology%7C33006169/c_2/2%7C33006169%7CTelevisions+and+accessories%7C33008651/c_3/3%7Ccat_33008651%7CTelevisions%7C33017148/fs/0/p/51/pp/50/s/Price%3A+Low+-+High.htm",
            urlPage1 = 'http://www.argos.co.uk/static/Browse/c_1/1%7Ccategory_root%7CTechnology%7C33006169/c_2/2%7C33006169%7CTelevisions+and+accessories%7C33008651/c_3/3%7Ccat_33008651%7CTelevisions%7C33017148/fs/0/p/1/pp/150/s/Price%3A+Low+-+High.htm',
            urlPage2 = 'http://www.argos.co.uk/static/Browse/c_1/1%7Ccategory_root%7CTechnology%7C33006169/c_2/2%7C33006169%7CTelevisions+and+accessories%7C33008651/c_3/3%7Ccat_33008651%7CTelevisions%7C33017148/fs/0/p/151/pp/150/s/Price%3A+Low+-+High.htm';

        require('isomorphic-fetch');
        fetch(urlPage2)
            .then((response) => {
                return response.text();
            })
            .then((html) => {
                require('./dom-parser')(html)

                const tvLinksArray = [],
                    idsArrayFromHTML = $('.partnum').toArray(),
                    urlBase = 'http://www.argos.co.uk/product/';

                idsArrayFromHTML.forEach((el) => {
                    tvLinksArray.push(urlBase + el.innerHTML);
                })

                return Promise.resolve(tvLinksArray);
            })
            .then((tvLinksArray) => {
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

                var arr = tvLinksArray;
                let requests = arr.map((item, index) => {
                    return Promise.resolve(asyncFunction(item));
                });

                Promise.all(requests)
                    .then((res) => {
                        console.log(mongoArr);
                    });
            })

        return Promise.resolve(app);
    }

module.exports = { init };