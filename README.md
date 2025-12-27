# pdf-merger
Simple Pdf Merger for personal use

Small Flask app to upload multiple PDF files and download a merged PDF. This mirrors the behavior of the existing `main.py` script (merges PDFs in filename-sorted order).

Quick start

1. Create a virtualenv (recommended) and activate it.
2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Run the app:

```bash
python app.py
```

4. Open http://127.0.0.1:5000 in your browser and upload PDFs.

UI Improvements

- The web UI now uses Bootstrap and provides a nicer file-selection interface.
- You can reorder files, remove files, and then click "Merge & Download".
- Files are merged in the order shown in the list.
