const baseHtml = document.querySelector('.spreadsheets--item.js-base');
const apiURL = 'https://script.google.com/macros/s/AKfycbx7dwA39TbApPK0KtySv_liG8qyJYXqiwUCrv_fHoqmxZzj1c2hoiq66lt96Wav4V3RsQ/exec';

// ★追加：元データ（一番上のひな形）を完全に画面から消す
if (baseHtml) {
  baseHtml.remove();
}

// 各グループ内のボタンイベント設定
function setupGroupEvents(group) {
  const btn1 = group.querySelector('.btn1');
  const btn2 = group.querySelector('.btn2');

  if (btn1 && btn2) {
    btn1.addEventListener('click', () => {
      // 「作成」を押してもボタンは消さず、「完了」を押せるようにするだけ
      btn2.disabled = false;
    });
  }
}

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

    const copy = baseHtml.cloneNode(true);
    copy.classList.remove('js-base');
    copy.id = `spreadsheet-item-${index}`;
    copy.classList.add('spase');

    copy.querySelector('.spreadsheets--irai').textContent = entry.irai;
    copy.querySelector('.spreadsheets--gaiyou').textContent = entry.gaiyou;
    copy.querySelector('.spreadsheets--name').textContent = entry.name;

    const btn2 = copy.querySelector('.btn2');
    if (btn2) {
      btn2.disabled = true;
    }
    setupGroupEvents(copy);

    currentContainer.appendChild(copy);
  });
}

loadData();