import os
import django
import oracledb
import config

# Inicializar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ad_final.settings')
django.setup()

from noticias.models import Video, Resumen  # ajusta el nombre de tu app

# ── Conexión a Oracle ──────────────────────────────────────────────
oracle_conn = oracledb.connect(
    user=config.DB_USER,
    password=config.DB_PASSWORD,
    dsn=config.DB_DSN
)
cursor = oracle_conn.cursor()

# ── Migrar VIDEOS ──────────────────────────────────────────────────
print("Migrando tabla VIDEOS...")

cursor.execute("SELECT ID, FECHA, CANAL, TITULO, URL, TRANSCRIPCION FROM VIDEOS")
rows = cursor.fetchall()

videos_creados = 0
for row in rows:
    id_, fecha, canal, titulo, url, transcripcion = row

    # Los CLOB hay que leerlos explícitamente
    if transcripcion is not None:
        transcripcion = transcripcion.read()

    Video.objects.update_or_create(
        id=id_,
        defaults={
            'fecha': fecha,
            'canal': canal,
            'titulo': titulo,
            'url': url,
            'transcripcion': transcripcion,
        }
    )
    videos_creados += 1

print(f"  ✅ {videos_creados} videos migrados")

# ── Migrar RESUMEN ─────────────────────────────────────────────────
print("Migrando tabla RESUMEN...")

cursor.execute("SELECT ID_RESUMEN, VIDEO_ID, RESUMEN_TEXTO FROM RESUMEN")
rows = cursor.fetchall()

resumenes_creados = 0
errores = 0
for row in rows:
    id_resumen, video_id, resumen_texto = row

    # Los CLOB hay que leerlos explícitamente
    if resumen_texto is not None:
        resumen_texto = resumen_texto.read()

    # Solo migramos si el video padre existe
    try:
        video = Video.objects.get(id=video_id)
        Resumen.objects.update_or_create(
            id_resumen=id_resumen,
            defaults={
                'video': video,
                'resumen_texto': resumen_texto,
            }
        )
        resumenes_creados += 1
    except Video.DoesNotExist:
        print(f"  ⚠️  Video con id {video_id} no encontrado, resumen {id_resumen} omitido")
        errores += 1

print(f"  ✅ {resumenes_creados} resúmenes migrados")
if errores:
    print(f"  ⚠️  {errores} resúmenes omitidos por falta de video padre")

# ── Limpieza ───────────────────────────────────────────────────────
cursor.close()
oracle_conn.close()
print("\n🎉 Migración completada!")