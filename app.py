from flask import Flask, request, render_template, send_file, redirect, url_for, flash
import os
import tempfile
import io
from werkzeug.utils import secure_filename
from pypdf import PdfWriter

app = Flask(__name__)
app.secret_key = "change-me"


@app.route("/", methods=["GET", "POST"])
def upload():
    if request.method == "POST":
        files = request.files.getlist("files")
        if not files or files == [None]:
            flash("No files uploaded")
            return redirect(url_for("upload"))

        with tempfile.TemporaryDirectory() as tmpdir:
            for f in files:
                if f and f.filename.lower().endswith('.pdf'):
                    filename = secure_filename(f.filename)
                    f.save(os.path.join(tmpdir, filename))

            writer = PdfWriter()
            for name in sorted(os.listdir(tmpdir)):
                if name.lower().endswith('.pdf'):
                    path = os.path.join(tmpdir, name)
                    writer.append(path)

            output_stream = io.BytesIO()
            writer.write(output_stream)
            output_stream.seek(0)

            return send_file(
                output_stream,
                mimetype='application/pdf',
                download_name='merged.pdf',
                as_attachment=True,
            )

    return render_template("index.html")


if __name__ == "__main__":
    app.run(debug=True, port=5000)
