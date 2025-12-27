from pypdf import PdfWriter
import os

pdf_folder = "pdfs" 
output_file = "merged.pdf"

writer = PdfWriter()

for filename in sorted(os.listdir(pdf_folder)):
    if filename.endswith(".pdf"):
        file_path = os.path.join(pdf_folder, filename)
        writer.append(file_path)

with open(output_file, "wb") as f:
    writer.write(f)
