import re
from django.db import models

class Video(models.Model):
    id = models.AutoField(primary_key=True)
    fecha = models.DateTimeField(null=True, blank=True)
    canal = models.CharField(max_length=255, null=True, blank=True)
    titulo = models.CharField(max_length=500, null=True, blank=True)
    url = models.URLField(max_length=1000, null=True, blank=True)
    transcripcion = models.TextField(null=True, blank=True)

    class Meta:
        db_table = 'videos'  # opcional, Django usaría 'appnombre_video' por defecto

    def __str__(self):
        return self.titulo or f"Video {self.id}"

    @property
    def titulo_sin_autor(self):
        if not self.titulo:
            return ""

        autor_pattern = re.compile(
            r"\s*(?:J\.?\s*L\.?|JL|Jos(?:é|e)(?:\s+L(?:uis)?)?)\s+Cava\.?\s*",
            flags=re.IGNORECASE,
        )

        texto = autor_pattern.sub("", self.titulo)
        texto = re.sub(r"\s*\.+$", "", texto).strip()
        texto = re.sub(r"\s{2,}", " ", texto)
        return texto


class Resumen(models.Model):
    id_resumen = models.AutoField(primary_key=True)
    video = models.ForeignKey(
        Video,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        db_column='video_id'
    )
    resumen_texto = models.TextField(null=True, blank=True)

    class Meta:
        db_table = 'resumen'

    def __str__(self):
        return f"Resumen {self.id_resumen} - Video {self.video_id}"