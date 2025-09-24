// Shared functions for image handling
function handleClipboardPaste(callback) {
    document.addEventListener('paste', async (e) => {
        const items = e.clipboardData.items;
        for (let item of items) {
            if (item.type.startsWith('image/')) {
                const file = item.getAsFile();
                const img = new Image();
                img.onload = () => callback(img);
                img.src = URL.createObjectURL(file);
                break;
            }
        }
    });
}

// Segmented control initialization with animated highlight
function initSegmented(container) {
    if (!container) return;
    let highlight = container.querySelector('.segmented-highlight');
    if (!highlight) {
        highlight = document.createElement('div');
        highlight.className = 'segmented-highlight';
        container.prepend(highlight);
    }

    const buttons = Array.from(container.querySelectorAll('button'));
    if (buttons.length === 0) return;

    // Ensure one active by default
    let active = buttons.find(b => b.classList.contains('active')) || buttons[0];
    buttons.forEach(b => b.classList.remove('active'));
    active.classList.add('active');

    function positionHighlight(targetBtn) {
        const cRect = container.getBoundingClientRect();
        const bRect = targetBtn.getBoundingClientRect();
        const left = bRect.left - cRect.left;
        const width = bRect.width;
        highlight.style.width = `${width}px`;
        highlight.style.transform = `translateX(${left}px)`;
    }

    // Initial position after layout
    requestAnimationFrame(() => positionHighlight(active));

    // Click handling
    container.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn || !container.contains(btn)) return;
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        positionHighlight(btn);
    });

    // Keyboard navigation
    container.addEventListener('keydown', (e) => {
        const currentIndex = buttons.findIndex(b => b.classList.contains('active'));
        if (e.key === 'ArrowRight') {
            const next = buttons[(currentIndex + 1) % buttons.length];
            next.focus();
            next.click();
            e.preventDefault();
        } else if (e.key === 'ArrowLeft') {
            const prev = buttons[(currentIndex - 1 + buttons.length) % buttons.length];
            prev.focus();
            prev.click();
            e.preventDefault();
        }
    });

    // Reposition on resize
    window.addEventListener('resize', () => {
        const btn = container.querySelector('button.active') || buttons[0];
        positionHighlight(btn);
    });
}

// Utility: persistent hidden file input binding
function bindPersistentFileInput(uploadArea, fileInput, onFile) {
    if (!uploadArea || !fileInput || !onFile) return;
    uploadArea.addEventListener('click', () => {
        fileInput.value = '';
        fileInput.click();
    });
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) onFile(file);
    });
}

// Download canvas as image with dynamic filename
function downloadCanvas(canvas, originalFilename, toolName) {
    const date = new Date();
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    const ext = (originalFilename.split('.').pop() || 'png').toLowerCase();
    const base = originalFilename.replace(/\.[^/.]+$/, '');
    const filename = `${base}-${dd}-${mm}-${yyyy}.${ext}`;
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL(ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/png');
    link.click();
}
