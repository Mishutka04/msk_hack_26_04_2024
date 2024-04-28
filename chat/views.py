from django.contrib.auth import logout
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.views import LoginView
from django.http import HttpResponseRedirect
from django.shortcuts import render, redirect
from django.urls import reverse_lazy, reverse


class LoginUser(LoginView):
    form_class = AuthenticationForm
    template_name = "chat/LoginPage.html"

    def get_success_url(self):
        return reverse_lazy('chat-page')


def room(request):
    #if not request.user.is_authenticated:
    #    return redirect("login")
    context = {"room_name": request.user}
    return render(request, "chat/chatPage.html", context)


def logout_user(request):
    logout(request)
    return HttpResponseRedirect(reverse('login-user'))