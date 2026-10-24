
const baseHtml = document.querySelector('.spreadsheets--item.js-base');
const spreadsheets = document.querySelector('.spreadsheets');

const apiURL = 'https://script.google.com/macros/s/AKfycbzKBgDcvOyTVfPgpvkbyWwge4Psd8eBpqyPVy6uEIOl-x0-Dls9_O-he9hdl50RMjxI1g/exec';

// ひな形を保存して、画面上では非表示にする
const baseTemplate = baseHtml ? baseHtml.cloneNode(true) : null;

if (baseHtml) {
  baseHtml.remove();
}

// 通信中の多重操作・更新の重複を防ぐ
let isSaving = false;
let isLoading = false;

// ------------------------------------
// 状態に応じてカードの色とボタンを設定
// ------------------------------------
function applyStatus(card, status) {
  card.classList.remove('is-creating', 'is-completed');

  const btn1 = card.querySelector('.btn1');
  const btn2 = card.querySelector('.btn2');

  if (status === 'creating') {
    card.classList.add('is-creating');

    if (btn1) btn1.disabled = false;
    if (btn2) btn2.disabled = false;

  } else if (status === 'completed') {
    card.classList.add('is-completed');

    if (btn1) btn1.disabled = true;
    if (btn2) btn2.disabled = true;

  } else {
    if (btn1) btn1.disabled = false;
    if (btn2) btn2.disabled = true;
  }

  card.dataset.status = status;
}

// ------------------------------------
// Googleスプレッドシートからデータを取得
// ------------------------------------
async function fetchData() {
  const response = await fetch(apiURL, {
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error('データの取得に失敗しました');
  }

  return await response.json();
}

// ------------------------------------
// カードを作成して画面に表示
// ------------------------------------
function renderData(data) {
  if (!spreadsheets || !baseTemplate) return;

  // 古いカードを削除
  spreadsheets.replaceChildren();

  let currentContainer = null;

  data.forEach((entry, index) => {
    // 3件ごとにコンテナを作る
    if (index % 3 === 0) {
      currentContainer = document.createElement('div');
      currentContainer.className = 'container';
      currentContainer.id =
        `container-group-${Math.floor(index / 3)}`;

      spreadsheets.appendChild(currentContainer);
    }

    // ひな形からカードを作る
    const copy = baseTemplate.cloneNode(true);

    copy.style.display = '';
    copy.classList.remove('js-base');
    copy.classList.add('spase');

    copy.id = `spreadsheet-item-${index}`;

    // スプレッドシートの行番号を保存
    copy.dataset.rowNumber = entry.rowNumber;

    // データを設定
    copy.querySelector('.spreadsheets--irai').textContent =
      entry.irai ?? '';

    copy.querySelector('.spreadsheets--gaiyou').textContent =
      entry.gaiyou ?? '';

    copy.querySelector('.spreadsheets--name').textContent =
      entry.name ?? '';

    // スプレッドシートに保存された状態を反映
    applyStatus(copy, entry.status || 'default');

    currentContainer.appendChild(copy);
  });
}

// ------------------------------------
// 最新データを読み込む
// ------------------------------------
async function loadData() {
  if (isLoading || isSaving) return;

  isLoading = true;

  try {
    const data = await fetchData();
    renderData(data);
  } catch (error) {
    console.error('読み込みエラー:', error);
  } finally {
    isLoading = false;
  }
}

// ------------------------------------
// 状態をGoogleスプレッドシートに保存
// ------------------------------------
async function updateStatus(card, status) {
  const rowNumber = Number(card.dataset.rowNumber);

  if (!Number.isInteger(rowNumber) || rowNumber < 2) {
    throw new Error('行番号が正しくありません');
  }

  const response = await fetch(apiURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8'
    },
    body: JSON.stringify({
      rowNumber: rowNumber,
      status: status
    })
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || '保存に失敗しました');
  }
}

// ------------------------------------
// ボタンのクリックイベント
// ------------------------------------
if (spreadsheets) {
  spreadsheets.addEventListener('click', async (event) => {
    const button = event.target.closest('.btn1, .btn2');

    if (!button || button.disabled || isSaving) return;

    const card = button.closest('.spreadsheets--item');

    if (!card) return;

    let newStatus;

    // 作成ボタン
    if (button.classList.contains('btn1')) {
      if (card.dataset.status === 'completed') return;

      if (!confirm('本当に作成を開始しますか？')) return;

      newStatus = 'creating';

    // 完成ボタン
    } else {
      if (card.dataset.status !== 'creating') return;

      if (!confirm('本当に完了にしますか？（この操作は戻せません）')) {
        return;
      }

      newStatus = 'completed';
    }

    isSaving = true;

    const buttons = card.querySelectorAll('.btn1, .btn2');

    buttons.forEach(btn => {
      btn.disabled = true;
    });

    try {
      // 先にスプレッドシートへ保存
      await updateStatus(card, newStatus);

      // 保存成功後に画面を変更
      applyStatus(card, newStatus);

    } catch (error) {
      console.error('状態の保存エラー:', error);

      alert(
        '状態を保存できませんでした。\n' +
        '通信状況やGASの設定を確認してください。'
      );

      // 現在の状態に応じてボタンを戻す
      applyStatus(card, card.dataset.status || 'default');

    } finally {
      isSaving = false;
    }
  });
}

// ------------------------------------
// 初回読み込み
// ------------------------------------
loadData();

// ------------------------------------
// 5秒ごとに最新状態を確認
// ------------------------------------
setInterval(() => {
  loadData();
}, 5000);
