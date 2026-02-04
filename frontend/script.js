// Lucide ikonlarını inisializasiya et
lucide.createIcons();

const API_URL = "http://localhost:8000/fix";

// Elementləri seçirik
const inputCode = document.getElementById('input-code');
const fixedCode = document.getElementById('fixed-code');
const fixBtn = document.getElementById('fix-btn');
const btnText = document.getElementById('btn-text');
const wandIcon = document.getElementById('wand-icon');
const loader = document.getElementById('loader');
const loadingOverlay = document.getElementById('loading-overlay');
const placeholderText = document.getElementById('placeholder-text');
const errorBox = document.getElementById('error-box');
const errorText = document.getElementById('error-text');
const copyInputBtn = document.getElementById('copy-input');
const copyFixedBtn = document.getElementById('copy-fixed');
const clearBtn = document.getElementById('clear-input');

// Betty düzəltmə funksiyası
async function handleFixCode() {
    const code = inputCode.value.trim();
    if (!code) return;

    // Loading Başladır
    setLoading(true);
    errorBox.classList.add('hidden');

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: code }),
        });

        if (!response.ok) {
            throw new Error('Backend server cavab vermir. Holbeditor xidmətinin aktiv olduğundan əmin olun.');
        }

        const data = await response.json();
        
        // Nəticəni yazdır
        fixedCode.value = data.fixed_code;
        placeholderText.classList.add('hidden');
        copyFixedBtn.classList.remove('hidden');

    } catch (err) {
        errorText.innerText = err.message || 'Xəta baş verdi.';
        errorBox.classList.remove('hidden');
    } finally {
        setLoading(false);
    }
}

function setLoading(isLoading) {
    if (isLoading) {
        fixBtn.disabled = true;
        btnText.innerText = 'Düzəldilir...';
        wandIcon.classList.add('hidden');
        loader.classList.remove('hidden');
        loadingOverlay.classList.remove('hidden');
    } else {
        fixBtn.disabled = false;
        btnText.innerText = 'Betty-ni Düzəlt';
        wandIcon.classList.remove('hidden');
        loader.classList.add('hidden');
        loadingOverlay.classList.add('hidden');
    }
}

// Kopyalama funksiyası
async function copyToClipboard(text, btnElement) {
    try {
        await navigator.clipboard.writeText(text);
        const originalContent = btnElement.innerHTML;
        
        // Müvəqqəti uğur mesajı
        btnElement.innerHTML = `<i data-lucide="check"></i> <span>Kopyalandı!</span>`;
        lucide.createIcons(); // Yeni ikonu göstər
        
        setTimeout(() => {
            btnElement.innerHTML = originalContent;
            lucide.createIcons();
        }, 2000);
    } catch (err) {
        console.error('Kopyalanmadı', err);
    }
}

// Event Listeners
fixBtn.addEventListener('click', handleFixCode);

clearBtn.addEventListener('click', () => {
    inputCode.value = '';
    fixedCode.value = '';
    placeholderText.classList.remove('hidden');
    copyFixedBtn.classList.add('hidden');
    errorBox.classList.add('hidden');
});

copyInputBtn.addEventListener('click', () => copyToClipboard(inputCode.value, copyInputBtn));
copyFixedBtn.addEventListener('click', () => copyToClipboard(fixedCode.value, copyFixedBtn));
