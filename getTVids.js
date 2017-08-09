require('isomorphic-fetch');

const init = (url) => {
    fetch(url)
        .then((response) => {
            return response.text();
        })
        .then((html) => {
            require('./dom-parser')(html)
            const tvLinksArray = [],
                idsArrayFromHTML = $('.partnum').toArray();

            const urlBase = 'http://www.argos.co.uk/product/';

            idsArrayFromHTML.forEach((el) => {
                tvLinksArray.push(urlBase + el.innerHTML);
            })

            return Promise.resolve(tvLinksArray);
        })
};

module.exports = { init };