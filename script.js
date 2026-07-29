const baseHtml = document.querySelector('.spreadsheets--item.js-base');
const spreadsheets = document.querySelector('spreadsheets');
const apiURL = 'https://script.google.com/macros/s/AKfycbxTRcbPwHLuXdLKehyrBEbp0fYmsUr0mIrdzuwT698ugQsMV41OtPJhMwa_Sr7Kx5DU4Q/exec'

async function loadData() {
    const response = await fetch(apiURL);
    const data = await response.json();
    data.forEach(entry,index =>{
        const data = baseHtml.cloneNode(true);
        copy.classList.remove('js-base');

        copy.id = `spreadsheet-item-${index}`;

        copy.querySelector('#spreadsheets--irai').textContent = entry.irai;
        copy.querySelector('#spreadsheets--gaiyou').textContent = entry.gaiyou;
        copy.querySelector('#spreadsheets--name').textContent = entry.name;
        spreadsheets.appendChild(copy);
    })
    
}

loadData();