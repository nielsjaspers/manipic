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

// Download canvas as image with dynamic filename
function downloadCanvas(canvas, originalFilename, toolName) {
    const date = new Date();
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    const ext = originalFilename.split('.').pop() || 'png';
    const base = originalFilename.replace(/\.[^/.]+$/, '');
    const filename = `${base}-${dd}-${mm}-${yyyy}.${ext}`;
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL();
    link.click();
}