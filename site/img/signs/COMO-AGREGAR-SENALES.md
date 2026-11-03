# Señales de tránsito del quiz

## De dónde salen las que ya están

Las 35 imágenes de esta carpeta (`reg-*.png` = señales reglamentarias,
`adv-*.png` = señales de advertencia) se recortaron del póster educativo
oficial de **Montevideo Tránsito** ("mecopa", Intendencia de Montevideo,
mecopa.montevideo.gub.uy) — el mismo que citamos como fuente en cada
pregunta que las usa. Cada imagen es solo el ícono de la señal, sin el
texto de referencia que traía debajo en el póster original.

Con ellas se generaron 48 preguntas nuevas en `questions.json`:

- 35 del tipo "¿Qué indica esta señal?" (una por señal).
- 13 del tipo "¿Cuál de estas señales indica X?" (opciones con imagen).

## Cómo agregar más señales

El motor del quiz soporta dos formatos, ya usados arriba:

### 1. Imagen en la pregunta

```json
{
  "category": "Señales Reglamentarias",
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
  "category": "Señales Reglamentarias",
  "question": "¿Cuál de estas señales indica \"Nombre de la señal\"?",
  "optionImages": ["img/signs/a.png", "img/signs/b.png", "img/signs/c.png", "img/signs/d.png"],
  "options": ["Señal A", "Señal B", "Señal C", "Señal D"],
  "correct": 0,
  "explanation": "...",
  "source": "..."
}
```

`optionImages` debe tener el mismo orden y largo que `options`. Las opciones
se barajan igual que en las preguntas de solo texto.

## Señales que faltan

Las **señales luminosas** (semáforos y sus variantes: direccionales,
destellantes, peatonales) y las **informativas** con formato libre
(carteles de distancia, hospital, estacionamiento tarifado, etc.) del
mismo póster todavía no están cargadas — su formato es menos uniforme
(tamaños y proporciones variables) y conviene revisarlas una por una antes
de recortarlas. Si querés que arme esa segunda tanda, avisá.

## Formato recomendado para señales nuevas

- PNG con fondo uniforme (no hace falta transparencia), lado más o menos
  cuadrado.
- Nombre de archivo descriptivo en minúsculas sin espacios ni tildes:
  `ceda-el-paso.png`, `doble-mano.png`.
- Verificá la licencia si la imagen no sale de una fuente oficial uruguaya.
