# Señales de tránsito del quiz

## De dónde salen

Las 53 imágenes de esta carpeta se recortaron del póster educativo oficial
de **Montevideo Tránsito** ("mecopa", Intendencia de Montevideo,
mecopa.montevideo.gub.uy), el mismo que se cita como fuente en cada
pregunta que las usa. Cada imagen es solo la señal, sin el texto de
referencia que traía debajo en el póster.

| Prefijo  | Tipo de señal                         |
|----------|---------------------------------------|
| `reg-*`  | Reglamentarias (incluye PARE)          |
| `adv-*`  | De advertencia (preventivas)           |
| `inf-*`  | Informativas                           |
| `lum-*`  | Luminosas (semáforos, balizas)         |

Con ellas hay 69 preguntas en `questions.json`, todas en el tema
"Señalización vial".

## Cómo agregar más señales

El quiz soporta dos formatos.

### 1. Imagen en la pregunta

```json
{
  "category": "Señalización vial",
  "topic": "Señales Reglamentarias",
  "question": "¿Qué indica esta señal?",
  "image": "img/signs/mi-senal.png",
  "imageAlt": "Descripción corta de la señal",
  "options": ["Opción correcta", "Distractor 1", "Distractor 2", "Distractor 3"],
  "correct": 0,
  "explanation": "...",
  "source": "..."
}
```

### 2. Imágenes como opciones

```json
{
  "category": "Señalización vial",
  "topic": "Señales Reglamentarias",
  "question": "¿Cuál de estas señales indica \"Nombre de la señal\"?",
  "optionImages": ["img/signs/a.png", "img/signs/b.png", "img/signs/c.png", "img/signs/d.png"],
  "options": ["Señal A", "Señal B", "Señal C", "Señal D"],
  "correct": 0,
  "explanation": "...",
  "source": "..."
}
```

`optionImages` debe tener el mismo orden y largo que `options`. En pantalla
las opciones con imagen se muestran sin el texto (solo el número), porque se
barajan y "Señal A/B/C/D" quedaría desordenado; el texto queda como
referencia en el archivo.

## Formato recomendado

- PNG con fondo uniforme (no hace falta transparencia), lado más o menos
  cuadrado.
- Nombre en minúsculas, sin espacios ni tildes, con el prefijo del tipo:
  `reg-ceda-el-paso.png`, `adv-doble-mano.png`.
- Verificá la licencia si la imagen no sale de una fuente oficial uruguaya.
