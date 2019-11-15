const nodeFetch = require('node-fetch');
const { JSDOM } = require('jsdom');
const makePdf = require("./make-pdf");


// Парсит указанный url
const fetchHtml = async url => {
    try {
        const res = await nodeFetch(url);
        const body = await res.text();
        return Promise.resolve(body);
    } catch (err) {
        if(err) throw console.log(err);
        return Promise.reject(err);
    }
};
// Удаляет указанный url
const removeByQuerySelector = (dom, selector) => {
    dom.window.document.querySelectorAll(selector).forEach(e => e.parentNode.removeChild(e));
};
// Подсчитывает кол-во повторений спарсенных слов и сортирует их в порядке убывания
const countWordRepeats = html => {
    const dom = new JSDOM(html);

    removeByQuerySelector(dom, 'script');
    removeByQuerySelector(dom, 'style');

    const { textContent } = dom.window.document.querySelector('body');

    // Получаем массив слов
    const wordsArr = textContent.replace(/(!|;|:|"|'|,|\.|\?|\/|«|»|\n|)/g, '').split(' ');

    const repeatsList = {};

    // Подсчитываем кол-во повторений для каждого слова
    wordsArr.forEach((word) => {
        if (word.length <= 4) return;

        if (repeatsList[`${word}`]) {
            repeatsList[`${word}`] += 1;
        } else {
            repeatsList[`${word}`] = 1;
        }
    });

    // Создаём массив, состоящий из слов и кол-ва повторений
    const repeatsArr = Object.keys(repeatsList).map(word => ({
        keyword: word,
        count: repeatsList[word],
    }));

    // Сортируем полученный массив в порядке убывания
    return repeatsArr.sort((a, b) => b.count - a.count);
};


module.exports = async (req, res, urls) => {
    try {
        // Запрашиваем данные для каждого url
        const request = urls.map(url => fetchHtml(url));
        // Дождавшись каждого, забираем содержание html-страниц
        const responses = await Promise.all(request);
        // Подсчитываем кол-во повторений слов
        const wordRepeats = responses.map(response => countWordRepeats(response));
        // Создаём PDF файл на основе полученного результата
        makePdf(res, urls, wordRepeats);
    } catch (err) {
        console.log(err);
        return Promise.reject(err);
    }
};
