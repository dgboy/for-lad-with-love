const fs = require('fs');
const pdf = require("html-pdf");

// Загружаем CSS файл для улучшения внешнего вида таблицы в PDF
let css = '';
    
fs.readFile(__dirname + "./../css/style.css", "utf8", (err, data) => {
  if (err) throw console.log(err);
  css = data;
});

module.exports = (res, urls, wordRepeats) => {
    
    
    let tableRows = '';

    // Создаём шаблон табличной части данных
    urls.forEach((url, i) => {
        tableRows += `
            <tr>
                <td>${url}</td>
                <td>${wordRepeats[i][0].keyword}</td>
                <td>${wordRepeats[i][1].keyword}</td>
                <td>${wordRepeats[i][2].keyword}</td>
            </tr>
        `;
      });

    // Создаём шаблон таблицы для PDF
    const pdfTableTmp = `
        <style>
            ${css}
        </style>
        <table>
            <thead>
                <tr>
                    <th>URL</th>
                    <th>#1</th>
                    <th>#2</th>
                    <th>#3</th>
                </tr>
            </thead>
            <tbody>
                ${tableRows}
            </tbody>
        </table>
    `;

    // Создаём PDF 
    pdf.create(pdfTableTmp, { orientation: 'landscape' }).toStream((err, stream) => {
        if (err) throw err;

        stream.pipe(res);
        console.log("...Done!");
    });
};
