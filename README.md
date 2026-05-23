# Portal de noticias Django

Proyecto web desarrollado con Django para mostrar un portal de noticias basado en videos y resúmenes almacenados en base de datos.

La página principal lista los videos ordenados por fecha, muestra el canal, enlaza al video original y presenta el resumen asociado con una interfaz de lectura expandible.

## Tecnologías

- Python
- Django 6
- SQLite para desarrollo local
- HTML, CSS y JavaScript
- Markdown
- Oracle DB driver, usado por los scripts de migración

## Estructura principal

```text
djangoproject/
├── ad_final/              # Configuración principal del proyecto Django
├── noticias/              # Aplicación del portal de noticias
│   ├── models.py          # Modelos Video y Resumen
│   ├── views.py           # Vistas del portal
│   ├── templates/         # Plantillas HTML
│   └── static/noticias/   # CSS, JS e imágenes
├── manage.py
├── requirements.txt
├── migrate_oracle_to_django.py
└── README.md
```

## Instalación local

1. Clona el repositorio:

```bash
git clone <url-del-repositorio>
cd djangoproject
```

2. Crea y activa un entorno virtual:

```bash
python -m venv venv
venv\Scripts\activate
```

3. Instala las dependencias:

```bash
pip install -r requirements.txt
```

4. Aplica las migraciones:

```bash
python manage.py migrate
```

5. Arranca el servidor de desarrollo:

```bash
python manage.py runserver
```

6. Abre la web en:

```text
http://127.0.0.1:8000/
```

## Rutas disponibles

- `/` - Portal de noticias
- `/portal/` - Portal de noticias
- `/about/` - Página simple de prueba
- `/admin/` - Administración de Django

## Modelos

El proyecto usa dos modelos principales:

- `Video`: contiene fecha, canal, título, URL y transcripción.
- `Resumen`: contiene el resumen textual asociado a un video.

## Archivos no incluidos en Git

El repositorio ignora archivos locales o sensibles mediante `.gitignore`, como:

- `venv/`
- `__pycache__/`
- `*.pyc`
- `db.sqlite3`
- `.env`
- `config.py`

`config.py` no debe subirse porque contiene configuración local o credenciales.

## Notas de seguridad

Antes de publicar o desplegar el proyecto, conviene mover valores sensibles como `SECRET_KEY`, credenciales de base de datos y opciones de entorno a variables de entorno o a un archivo `.env` que no se suba al repositorio.
