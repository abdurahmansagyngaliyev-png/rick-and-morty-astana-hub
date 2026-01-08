const API_URL = "http://127.0.0.1:8000/api/data";
let currentTab = 'character';
let currentPage = 1;
let searchQuery = "";

// Проверка бэкенда
async function checkBackend() {
    try {
        const res = await fetch("http://127.0.0.1:8000/");
        if (res.ok) {
            document.getElementById('backendStatus').innerText = "Backend: Python Online";
            document.getElementById('backendStatus').classList.replace('text-red-500', 'text-green-500');
        }
    } catch (e) {
        console.error("Бэкенд не запущен!");
    }
}

// Загрузка данных через твой сервер
async function loadData() {
    const grid = document.getElementById('mainGrid');
    grid.innerHTML = '<div class="col-span-full text-center text-gray-500">Загрузка данных через FastAPI...</div>';
    
    try {
        const response = await fetch(`${API_URL}?endpoint=${currentTab}&page=${currentPage}&name=${searchQuery}`);
        const data = await response.json();
        
        renderCards(data.results);
        renderPagination(data.info);
    } catch (error) {
        grid.innerHTML = '<div class="col-span-full text-center text-red-500 font-bold">Ошибка: Бэкенд не запущен! <br> Запустите python main.py</div>';
    }
}

function renderCards(items) {
    const grid = document.getElementById('mainGrid');
    if (!items || items.length === 0) {
        grid.innerHTML = '<div class="col-span-full text-center text-gray-500 font-bold">Ничего не найдено</div>';
        return;
    }

    grid.innerHTML = items.map(item => `
        <div class="card bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden p-4">
            ${item.image ? `<img src="${item.image}" class="w-full h-48 object-cover rounded-xl mb-4">` : ''}
            <h3 class="text-xl font-bold text-green-400 truncate">${item.name}</h3>
            <p class="text-gray-400 text-sm mt-1">${item.species || item.type || 'N/A'}</p>
            <p class="text-gray-500 text-xs mt-1 uppercase tracking-tighter">${item.status || item.dimension || item.episode || ''}</p>
        </div>
    `).join('');
}

function renderPagination(info) {
    const nav = document.getElementById('pagination');
    if (!info || info.pages <= 1) {
        nav.innerHTML = '';
        return;
    }

    nav.innerHTML = `
        <button onclick="changePage(-1)" ${!info.prev ? 'disabled' : ''} class="px-6 py-2 bg-gray-800 rounded-lg disabled:opacity-30">Назад</button>
        <span class="font-bold">Страница ${currentPage} из ${info.pages}</span>
        <button onclick="changePage(1)" ${!info.next ? 'disabled' : ''} class="px-6 py-2 bg-gray-800 rounded-lg disabled:opacity-30">Вперед</button>
    `;
}

function changePage(step) {
    currentPage += step;
    loadData();
    window.scrollTo(0, 0);
}

function changeTab(tab) {
    currentTab = tab;
    currentPage = 1;
    document.querySelectorAll('nav button').forEach(b => b.classList.remove('active-tab', 'text-green-500'));
    document.getElementById(`tab-${tab}`).classList.add('active-tab');
    loadData();
}

// Поиск (debounce)
let timer;
document.getElementById('searchInput').addEventListener('input', (e) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
        searchQuery = e.target.value;
        currentPage = 1;
        loadData();
    }, 500);
});

// Инициализация
checkBackend();
loadData();