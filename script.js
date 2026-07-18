const baseHtml = document.querySelector('.spreadsheets--item.js-base');
const spreadsheets = document.querySelector('spreadsheets');
const apiURL = 'https://script.google.com/macros/s/AKfycbxkZMcSWdJhBjF72esK7hzCKHcy6FUeGkffe-QGtF1uXXTDowa0djyMoo-AOql6qxDGzw/exec'

async function loadData() {
    const response = await fetch(apiURl);
    const data = await response.json();
    data.forEach(entry =>{
        const copy = baseHtml.cloneNode(true);
        copy.classList.remove('js-base');
        console.log(data.irai);
        docyment.getElementById('.spreadsheets--irai').textContent = data.irai;
        console.log(data.gaiyou);
        docyment.getElementById('.spreadsheets--gaiyou').textContent = data.gaiyou;
        console.log(data.name);
        docyment.getElementById('.spreadsheets--name').textContent = data.name;
        spreadsheets.appendChild(copy);
    })
    
}

loadDate();