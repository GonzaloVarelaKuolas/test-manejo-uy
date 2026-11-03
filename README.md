# Examen de manejo · Uruguay

Práctica para el examen teórico de manejo uruguayo: preguntas de opción
múltiple con explicación y fuente legal en cada respuesta.

*(English version below / versión en inglés más abajo)*

---

## 🇺🇾 Español

### Qué es

Un sitio estático (HTML/CSS/JS puro, sin frameworks) para practicar el
examen teórico de manejo en Uruguay. Dos modos:

- **Simulacro de examen** — 30 preguntas al azar, igual que el examen real.
  Aprueba con hasta 5 errores.
- **Práctica por tema** — elegís un tema y vas viendo si acertaste y por qué
  después de cada pregunta.

Cada pregunta indica de qué norma sale: Guía Nacional de Conducción, Ley
18.191 (Ley de Tránsito y Seguridad Vial), Ley 19.061, Ley 18.113 o el
Reglamento Nacional de Circulación Vial.

### Cómo correrlo

**Opción 1 — servidor local simple** (no requiere nada más que Python):

```bash
cd site
python3 -m http.server 8080
```

Abrí [http://localhost:8080](http://localhost:8080).

**Opción 2 — Docker** (pensado también como ejercicio para aprender
Docker + Terraform/IaC):

```bash
cd site
docker build -t manejo-uy .
docker run -d -p 8080:80 --name manejo manejo-uy
```

**Opción 3 — Terraform** (gestiona el contenedor como infraestructura,
`plan` / `apply` / `destroy`):

```bash
cd site && docker build -t manejo-uy .   # construye la imagen primero
cd ../infra
terraform init
terraform apply
```

Ver `infra/main.tf` para el detalle. No se necesita cuenta de nube — usa el
provider de Docker local.

### Estructura

```
site/             # el sitio en sí (estático)
  index.html
  style.css
  app.js
  questions.json  # banco de preguntas
  img/signs/       # imágenes de señales (ver COMO-AGREGAR-SENALES.md)
infra/            # Terraform para levantarlo con Docker localmente
```

### Estado y próximos pasos

- 134 preguntas de texto con fuente verificada contra la normativa, más 48
  preguntas con señales de tránsito reales (35 señales reglamentarias y de
  advertencia, recortadas del material oficial de Montevideo Tránsito).
- Faltan las señales luminosas (semáforos) y las informativas de formato
  libre del mismo póster — ver `site/img/signs/COMO-AGREGAR-SENALES.md`.

### Aviso

No es material oficial. Las preguntas se basan en la Guía Nacional de
Conducción (1.ª edición, junio 2013) y en normativa publicada en
[impo.com.uy](https://www.impo.com.uy). Verificá siempre con la Intendencia
de tu departamento.

---

## 🇬🇧 English

### What this is

A static site (plain HTML/CSS/JS, no frameworks) for practicing Uruguay's
written driving exam. Two modes:

- **Exam simulation** — 30 random questions, matching the real exam format.
  Passes with up to 5 wrong answers.
- **Practice by topic** — pick a topic and get immediate feedback (correct/
  incorrect + explanation) after each question.

Every question cites its legal source: the official Guía Nacional de
Conducción (National Driving Guide), Ley 18.191 (Traffic and Road Safety
Law), Ley 19.061, Ley 18.113, or the Reglamento Nacional de Circulación
Vial (National Traffic Regulation).

### Running it

**Option 1 — plain local server** (just needs Python):

```bash
cd site
python3 -m http.server 8080
```

Open [http://localhost:8080](http://localhost:8080).

**Option 2 — Docker** (also built as a learning exercise for Docker +
Terraform/IaC):

```bash
cd site
docker build -t manejo-uy .
docker run -d -p 8080:80 --name manejo manejo-uy
```

**Option 3 — Terraform** (manages the container as infrastructure, full
`plan` / `apply` / `destroy` lifecycle):

```bash
cd site && docker build -t manejo-uy .   # build the image first
cd ../infra
terraform init
terraform apply
```

See `infra/main.tf` for details. No cloud account needed — it targets the
local Docker provider.

### Structure

```
site/             # the static site itself
  index.html
  style.css
  app.js
  questions.json  # question bank
  img/signs/       # road-sign images (see COMO-AGREGAR-SENALES.md)
infra/            # Terraform config to run it locally via Docker
```

### Status and next steps

- 134 text questions, each source-checked against the actual legal text,
  plus 48 real road-sign questions (35 regulatory/warning signs cropped
  from Montevideo Tránsito's official material).
- Still missing: traffic-light signals and free-form informational signs
  from the same source — see `site/img/signs/COMO-AGREGAR-SENALES.md`.

### Disclaimer

This is not official material. Questions are based on the Guía Nacional de
Conducción (1st edition, June 2013) and on regulations published at
[impo.com.uy](https://www.impo.com.uy). Always double-check with your local
Intendencia.
