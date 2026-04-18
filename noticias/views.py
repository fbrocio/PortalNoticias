from django.shortcuts import render
from django.http import HttpResponse
from .models import Video
# Create your views here.
def hello(request):
    return HttpResponse("<h1>Hello World</h1>")

def about(request):
    return HttpResponse("About")

def portal(request):
    videos = Video.objects.prefetch_related("resumen_set").all()
    return render(request, "portal.html", {"videos": videos})