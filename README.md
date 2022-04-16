# Indicadores y pesos de documentos PDF
Este repositorio cuenta con una aplicación construida en Node JS con el framework Express, donde consulta API de Crossref, Springer, IEEE, Elsevier a través de su DOI, para poder recuperar información de metadatos y que sean contrastados con métricas que permitan saber el peso de relevancia de dicho documento.

Adicionalmente, son leídos los PDF, para poder extraer su contenido y aplicar fórmulas de métricas de compresión de lectura, léxico, imágenes, tablas, entre otros.

Este es un aplicativo de modo investigativo para identificar la relevancia de documentos académicos de revistas como Springer, IEEE, Elsevier, ACM.

## Installation

Clona el repositorio

```
git clone https://github.com/fabiomedinamedina/indicadores-y-pesos-docs.git
```

Ir al directorio
```
cd indicadores-y-pesos-docs
```

Instalar las dependencias
```
npm install
```

Ejecutar el aplicativo (Elige alguno de los dos comandos)
```
npm run dev
npm nodemon
```

## Tecnologías
- Node JS
- Express JS

### Dependencias
- Axios
- Parse CSV
- PDF Extract

## Autores
- [Fabio Medina Medina](https://www.fabiomedina.com "Fabio Medina Medina")
- Diana Suarez
