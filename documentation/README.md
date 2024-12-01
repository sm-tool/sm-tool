# Documentation

This directory contains the engineering thesis documentation along with automatically generated technical documentation from both frontend and backend components.

## 📁 Directory Structure

```
thesis/
├── chapters/           # Thesis chapters in source format
├── figures/            # Diagrams and images used in thesis
├── references/         # Bibliography and citations
├── appendices/         # Additional materials and appendices
├── generated/          # Generated technical documentation
│   ├── swagger/        # Backend API documentation (generated from Swagger)
│   └── storybook/     # Frontend components documentation (generated from Storybook)
└── README.md          # This file
```

## 📚 Generated Documentation

### Generating latex from container

# Running LaTeX in Docker Container

### 1. Pull LaTeX Image

```bash
docker pull blang/latex:latest
```

### 2. Compile Document using PDFLaTeX

```bash
docker run --rm \
  -v ./documentation/thesis:/workdir \
  -v ./documentation/thesis/out:/miktex/out \
  blang/latex:latest \
  bash -c "cd /workdir && pdflatex -file-line-error -interaction=nonstopmode -synctex=1 -output-format=pdf -output-directory=/miktex/out -shell-escape -8bit main.tex"
```

Note: All commands assume you're running them from the root directory of your project (sm-tool).

### Backend API Documentation (Swagger)

The `swagger/` directory contains HTML documentation generated from Swagger/OpenAPI specifications. This documentation describes all available REST endpoints, request/response models, and authentication methods.

To update this documentation:

1. Run the backend application
2. Access Swagger UI endpoint (typically at `/swagger-ui.html`)
3. Export the documentation to HTML
4. Place the exported files in the `generated/swagger/` directory

### Frontend Components (Storybook)

The `storybook/` directory contains static documentation of React components exported from Storybook. This includes:

- Component examples
- Props documentation
- Usage guidelines
- Interactive examples

To update Storybook documentation:

1. Run `npm run build-storybook` in the frontend directory
2. Copy the generated static files to `generated/storybook/`

## 🔄 Updating Documentation

Both Swagger and Storybook documentation should be regenerated and committed whenever significant changes are made to either:

- API endpoints or models (backend)
- React components or their props (frontend)

## 📖 Thesis Content

The main thesis content is organized in the following chapters:

1. Introduction
2. Theoretical Background
3. System Architecture
4. Implementation Details
5. Testing and Validation
6. Conclusions

Each chapter should be maintained in its respective file within the `chapters/` directory.

## 🛠 Tools and Technologies

This documentation setup uses:

- Swagger/OpenAPI for API documentation
- Storybook for component documentation
- Markdown for thesis content
- [Your chosen tool] for generating the final thesis document

## 🔗 Related Links

- [Link to your project repository]
- [Link to your university's thesis guidelines]
- [Any other relevant resources]
