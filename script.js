const baseHtml = document.querySelector('.spreadsheets--item.js-base');
const spreadsheets = document.querySelector('.spreadsheets'); 
const apiURL = 'https://script.google.com/macros/s/AKfycby85zObuZ0d-0mkpP5THG-hBM_y_qUfkEL10z5CznEj3_aAXqSi9AW0U9NClmGguciwDw/exec';

async function loadData() {
    const response = await fetch(apiURL);
    const data = await response.json(); 
    
    // 💡 3個をまとめる「大きな四角い枠（container）」を入れておく変数
    let currentContainer = null;

    data.forEach((entry, index) => {
        // ⭐ 【ここがポイント！】3個ごとに（0番目、3番目、6番目...のとき）新しい大きな枠を作る
        if (index % 3 === 0) {
            currentContainer = document.createElement('div');
            currentContainer.className = 'container'; // CSSの緑色の四角い枠線のクラス
            currentContainer.id = `container-group-${Math.floor(index / 3)}`; // 固有のIDを付与
            
            // <ul> の中に、新しく作った空の大きな枠（container）を先に追加する
            spreadsheets.appendChild(currentContainer);
        }

        // 1. 「1件分の塊（3つのpタグ）」を丸ごとコピー
        const copy = baseHtml.cloneNode(true);
        copy.classList.remove('js-base');
        copy.id = `spreadsheet-item-${index}`;
        copy.classList.add('spase');

        // 2. コピーした1件分の塊の中にある p タグにデータを設定
        copy.querySelector('#spreadsheets--irai').textContent = entry.irai;
        copy.querySelector('#spreadsheets--gaiyou').textContent = entry.gaiyou;
        copy.querySelector('#spreadsheets--name').textContent = entry.name;
        
        // 3. 💡 【重要】<ul> ではなく、さっき作った「3個用の大きな枠」の中に合体させる
        currentContainer.appendChild(copy);
    });
}

loadData();
