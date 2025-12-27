const fileInput = document.getElementById('fileInput');
const chooseBtn = document.getElementById('chooseBtn');
const clearBtn = document.getElementById('clearBtn');
const mergeBtn = document.getElementById('mergeBtn');
const fileList = document.getElementById('fileList');
const alertBox = document.getElementById('alert');
const dropArea = document.getElementById('dropArea');

let files = [];

function renderFiles() {
  fileList.innerHTML = '';
  if (files.length === 0) {
    fileList.innerHTML = '<div style="color:var(--muted)">No files selected.</div>';
    return;
  }

  files.forEach((f, idx) => {
    const el = document.createElement('div');
    el.className = 'file-item';

    const name = document.createElement('div');
    name.className = 'file-name';
    name.textContent = f.name;

    const controls = document.createElement('div');
    controls.className = 'controls';

    const up = document.createElement('button');
    up.className = 'btn btn-sm btn-light';
    up.textContent = '↑';
    up.disabled = idx === 0;
    up.onclick = () => { move(idx, idx-1); };

    const down = document.createElement('button');
    down.className = 'btn btn-sm btn-light';
    down.textContent = '↓';
    down.disabled = idx === files.length - 1;
    down.onclick = () => { move(idx, idx+1); };

    const remove = document.createElement('button');
    remove.className = 'btn btn-sm btn-danger';
    remove.textContent = 'Remove';
    remove.onclick = () => { files.splice(idx,1); renderFiles(); };

    controls.appendChild(up);
    controls.appendChild(down);
    controls.appendChild(remove);

    el.appendChild(name);
    el.appendChild(controls);
    fileList.appendChild(el);
  });
}

function move(from, to) {
  if (to < 0 || to >= files.length) return;
  const item = files.splice(from,1)[0];
  files.splice(to, 0, item);
  renderFiles();
}

chooseBtn.addEventListener('click', (e) => { e.preventDefault(); fileInput.click(); });

fileInput.addEventListener('change', (e) => {
  const picked = Array.from(e.target.files).filter(f => f.name.toLowerCase().endsWith('.pdf'));
  files = files.concat(picked);
  renderFiles();
  fileInput.value = '';
});

clearBtn.addEventListener('click', (e) => { e.preventDefault(); files = []; renderFiles(); });

function showAlert(message, type='info'){
  const cls = {info:'secondary', success:'success', warning:'warning', danger:'danger'}[type] || 'secondary';
  alertBox.innerHTML = `<div class="alert alert-${cls} mt-2" role="alert">${message}</div>`;
}

mergeBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  if (files.length === 0) { showAlert('Please add at least one PDF.', 'warning'); return; }

  mergeBtn.disabled = true;
  mergeBtn.textContent = 'Merging...';
  showAlert('Uploading and merging — please wait.', 'info');

  const form = new FormData();
  files.forEach(f => form.append('files', f, f.name));

  try {
    const res = await fetch('/', { method: 'POST', body: form });
    if (!res.ok) throw new Error('Server error');
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'merged.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showAlert('Download started.', 'success');
  } catch (err) {
    console.error(err);
    showAlert('Failed to merge PDFs.', 'danger');
  } finally {
    mergeBtn.disabled = false;
    mergeBtn.textContent = 'Merge & Download';
  }
});

// Drag & drop support
;['dragenter','dragover'].forEach(ev => dropArea.addEventListener(ev, (e)=>{ e.preventDefault(); e.stopPropagation(); dropArea.classList.add('drop-area-drag'); }));
;['dragleave','drop','dragend'].forEach(ev => dropArea.addEventListener(ev, (e)=>{ e.preventDefault(); e.stopPropagation(); if(ev!=='dragover') dropArea.classList.remove('drop-area-drag'); }));
dropArea.addEventListener('drop', (e)=>{
  const dt = e.dataTransfer;
  const dropped = Array.from(dt.files).filter(f => f.name.toLowerCase().endsWith('.pdf'));
  files = files.concat(dropped);
  renderFiles();
});

// initial render
renderFiles();
