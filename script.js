const baseHtml = document.querySelector('.spreadsheets--item.js-base');
const spreadsheets = document.querySelector('.spreadsheets'); 
const apiURL = 'https://script.google.com/macros/s/AKfycbycvG41RUPs-XCufXGVwD3K8lwnpVuRKHWMsoVgjPXNuPcftCiy0mH1RzR3BgARc_4VlQ/exec';

// ひな形を一旦「非表示」にする
if (baseHtml) {
  baseHtml.style.display = 'none';
}

// ページ読み込み時にブラウザの記憶（localStorage）から状態を復元する関数
function restoreStates() {
  const cards = document.querySelectorAll('.spreadsheets--item');
  
  cards.forEach(card => {
    const iraiNameElement = card.querySelector('.spreadsheets--irai');
    if (!iraiNameElement) return;
    
    const iraiName = iraiNameElement.textContent;
    if (!iraiName) return;

    const savedState = localStorage.getItem('status_' + iraiName);
    const btn1 = card.querySelector('.btn1');
    const btn2 = card.querySelector('.btn2');

    if (savedState === 'creating') {
      card.classList.add('is-creating');
      if (btn2) btn2.disabled = false; // 完了ボタンをアンロック
    } else if (savedState === 'completed') {
      card.classList.add('is-completed');
      if (btn1) btn1.disabled = true;  // 作成ボタンをロック
      if (btn2) btn2.disabled = true;  // 完了ボタンをロック
    }
  });
}

// ボタンの状態をブラウザに保存する関数
function saveStatus(card) {
  const iraiNameElement = card.querySelector('.spreadsheets--irai');
  if (!iraiNameElement) return;
  const iraiName = iraiNameElement.textContent;
  if (!iraiName) return;

  let state = 'default';
  if (card.classList.contains('is-creating')) state = 'creating';
  if (card.classList.contains('is-completed')) state = 'completed';

  localStorage.setItem('status_' + iraiName, state);
}

// --- ★ボタンのクリック監視イベントをここに集約 ---
if (spreadsheets) {
  spreadsheets.addEventListener('click', (event) => {
    const targetListItem = event.target.closest('.spreadsheets--item');
    if (!targetListItem) return;

    // 1.「作成」ボタン（btn1）が押されたとき
    if (event.target.classList.contains('btn1')) {
      if (!confirm('本当に作成を開始しますか？')) return; 

      targetListItem.classList.remove('is-completed');
      targetListItem.classList.add('is-creating');
      
      const btn2 = targetListItem.querySelector('.btn2');
      if (btn2) btn2.disabled = false;

      saveStatus(targetListItem); // 状態を保存
    }
    
    // 2.「完了」ボタン（btn2）が押されたとき
    if (event.target.classList.contains('btn2')) {
      if (!confirm('本当に完了にしますか？（この操作は戻せません）')) return;

      targetListItem.classList.remove('is-creating');
      targetListItem.classList.add('is-completed');
      
      const btn1 = targetListItem.querySelector('.btn1');
      if (btn1) btn1.disabled = true;

      event.target.disabled = true;

      saveStatus(targetListItem); // 状態を保存
    }
  });
}

// データを読み込んで画面を組み立てるメイン関数
async function loadData() {
  const response = await fetch(apiURL);
  const data = await response.json(); 
  
  let currentContainer = null;

  data.forEach((entry, index) => {
    if (index % 3 === 0) {
      currentContainer = document.createElement('div');
      currentContainer.className = 'container';
      currentContainer.id = `container-group-${Math.floor(index / 3)}`;
      
      spreadsheets.appendChild(currentContainer);
    }

    // ひな形をコピーしてデータを入れる
    const copy = baseHtml.cloneNode(true);
    copy.style.display = ''; // 非表示を解除
    copy.classList.remove('js-base');
    copy.id = `spreadsheet-item-${index}`;
    copy.classList.add('spase');

    copy.querySelector('.spreadsheets--irai').textContent = entry.irai;
    copy.querySelector('.spreadsheets--gaiyou').textContent = entry.gaiyou;
    copy.querySelector('.spreadsheets--name').textContent = entry.name;

    const btn2 = copy.querySelector('.btn2');
    if (btn2) {
      btn2.disabled = true; // 初期状態では完了ボタンをロック
    }

    currentContainer.appendChild(copy);
  });

  // すべてのカードを並べ終えたので、元のひな形を完全に消す
  if (baseHtml) {
    baseHtml.remove();
  }

  // 画面が出揃ったので、最後に記憶からボタン状態と背景色を復元する
  restoreStates();
}

// データの読み込みを開始
loadData();