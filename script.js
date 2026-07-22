const baseHtml = document.querySelector('.spreadsheets--item.js-base');
const spreadsheets = document.querySelector('spreadsheets');
const apiURL = 'https://script.google.com/macros/s/AKfycbyRFK_B-BIgYv9KVYxMkM2lGuadqHP8QwLirzVmQLMl/dev'

async function loadData() {
    const response = await fetch(apiURL);
    const data = await response.json();
    data.forEach(entry =>{
        const copy = baseHtml.cloneNode(true);
        copy.classList.remove('js-base');
        document.getElementById('.spreadsheets--irai').textContent = data.irai;
        document.getElementById('.spreadsheets--gaiyou').textContent = data.gaiyou;
        document.getElementById('.spreadsheets--name').textContent = data.name;
        spreadsheets.appendChild(copy);
    })
    
}

loadData();