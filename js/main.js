// feladat lista objectum
let datas = {
  showAll: false, // show vagy hide gomb láthatósága
  todos: [ // todo elemek tömbje
    // {
    //   text: 'első',      //szöveg
    //   successed: true,   //elvégzett-e
    // },
    // {
    //   text: 'második',
    //   successed: false,
    // },
    // {
    //   text: 'harmadik',
    //   successed: false,
    // },
  ],
};

// adatok kimentése a localStorage-ba
function saveDatas() {
  localStorage.setItem('datas', JSON.stringify(datas));
}

// adatok betöltése a localStoriage-ból
function loadDatas() {
  if (localStorage.getItem('datas') !== null) {
    datas = JSON.parse(localStorage.getItem('datas'));
  }
}

// még nem teljesített elemek HTML-be szúrása
function pendingElements() {
  const pendingWrap = document.querySelector('.pending--wrap');
  // csak a nem teljesített elemek
  const pendings = datas.todos
    .filter((data) => data.successed === false);
  // index és szöveg beszúrása
  let string = '';
  pendings.forEach((pending, index) => {
    string += `<div class="pending--container">
        <input type="checkbox" data-index=${index}>
        <p>${pending.text}</p>
    </div>`;
  });
  pendingWrap.innerHTML = string;
}

// bejelölt elem áthelyezése
function checkedElements(event) {
  // elem indexe datasetből
  const changeIndex = event.target.dataset.index;

  // csak a nem teljesített elemek
  const pendings = datas.todos
    .filter((data) => data.successed === false);

  // elem teljesítése
  pendings[changeIndex].successed = true;

  saveDatas();
  generateGUI();
}

// a még nem teljesített elemek checkbox-ának eseménye
function pendingEvents() {
  const pendings = document.querySelectorAll('.pending input');
  pendings.forEach((pending) => pending.addEventListener('change', checkedElements));
}

// már teljesített elemek HTML-be szúrása
function completeElements() {
  const complateWrap = document.querySelector('.complate--wrap');
  // csak a teljesített elemek
  const complates = datas.todos
    .filter((data) => data.successed === true);
  // szöveg beszúrása
  let string = '';
  complates.forEach((complate) => {
    string += `<div class="complate--container">
          <input type="checkbox"  readonly checked>
          <p>${complate.text}</p>
      </div>`;
  });
  complateWrap.innerHTML = string;
}

// felület
function generateGUI() {
  // felületi elemek kiváasztása
  const pending = document.querySelector('.pending');
  const pendingText = document.querySelector('.pending--text');
  const complate = document.querySelector('.complate');
  const complateText = document.querySelector('.complate--text');
  const empty = document.querySelector('.empty');
  const buttons = document.querySelector('.buttons');
  const showBtn = document.querySelector('.showBtn');
  const hideBtn = document.querySelector('.hideBtn');

  // lista hossza
  const size = datas.todos.length;
  // ha üres, akkor csak az empty elem látszik
  if (size === 0) {
    pending.classList.add('hide');
    complate.classList.add('hide');
    empty.classList.remove('hide');
    buttons.classList.add('hide');
  } else {
    // különben a többi felület
    pending.classList.remove('hide');
    // az elkészült elemek a gombtól függően látszódnak
    if (datas.showAll) {
      complate.classList.remove('hide');
    } else {
      complate.classList.add('hide');
    }
    empty.classList.add('hide');
    buttons.classList.remove('hide');
    // vagy a show vagy a hide gomb látszódik
    if (datas.showAll) {
      hideBtn.classList.remove('hide');
      showBtn.classList.add('hide');
    } else {
      hideBtn.classList.add('hide');
      showBtn.classList.remove('hide');
    }

    // még nem teljesült elemek száma
    const pendingsNumber = datas.todos
      .filter((data) => data.successed === false)
      .length;

    // szövegek kiírása
    pendingText.textContent = `You have ${pendingsNumber} pendigs items`;
    complateText.textContent = `Completed tasks: ${(Math.round(((size - pendingsNumber) / size) * 100))}%`;

    // elemek megjelenítése és események hozzárendelése
    pendingElements();
    pendingEvents();
    completeElements();
  }
}

// új feladat bevitele a listába
function newToDo() {
  const inputTask = document.querySelector('.input');
  const inputText = inputTask.value;
  // csak ha nem üres
  if (inputText !== '') {
    // új feladat beszúrás a lista végére
    datas.todos.push({
      text: inputText,
      successed: false,
    });
    inputTask.value = '';
  }
}

// aktuális nap és dátum
function showDay() {
  const now = new Date();
  const day = now.getDay();
  const names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  document.querySelector('.day').textContent = names[day];
  document.querySelector('.date').textContent = now.toLocaleDateString('en');
}

// showButton eseménye
function showButtonEvent() {
  const showButton = document.querySelector('.showBtn');
  showButton.addEventListener('click', () => {
    datas.showAll = true;
    saveDatas();
    generateGUI();
  });
}

// hideButton eseménye
function hideButtonEvent() {
  const hideButton = document.querySelector('.hideBtn');
  hideButton.addEventListener('click', () => {
    datas.showAll = false;
    saveDatas();
    generateGUI();
  });
}

// clearAllButton eseménye
function clearAllButtonEvent() {
  const clearButton = document.querySelector('.clearBtn');
  clearButton.addEventListener('click', () => {
    datas.todos = [];
    saveDatas();
    generateGUI();
  });
}

// newButton eseménye
function newButtonEvent() {
  const newButton = document.querySelector('.addBtn');
  newButton.addEventListener('click', () => {
    newToDo();
    saveDatas();
    generateGUI();
  });
}

// show-hide váltakozása, clear (ablak betöltésekor az inicializálás)
function load() {
  // adatok betöltése a localStoriage-ből
  loadDatas();
  // gomb események betöltése
  showButtonEvent();
  hideButtonEvent();
  clearAllButtonEvent();
  newButtonEvent();
  // felület elemek megjelenítése
  generateGUI();
  // idő
  showDay();
}

// alkalmazás betöltése
load();
